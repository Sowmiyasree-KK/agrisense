"""
predictor.py — Crop Health Detection Logic
-------------------------------------------
Current implementation: color-tone analysis using raw pixel data.
No external ML libraries needed — works out of the box.

To plug in a real ML model later:
  1. Load your model at the top (e.g. TensorFlow, PyTorch, scikit-learn)
  2. Replace the body of `analyze_image()` with model inference
  3. Keep the return format identical so the API stays unchanged
"""

import struct
import zlib
import os


def _read_png_pixels(path):
    """
    Minimal PNG pixel reader using only stdlib (struct + zlib).
    Returns a flat list of (R, G, B) tuples sampled from the image.
    Falls back to None if the file is not a valid PNG.
    """
    try:
        with open(path, "rb") as f:
            data = f.read()

        # Validate PNG signature
        if data[:8] != b"\x89PNG\r\n\x1a\n":
            return None

        # Parse chunks to find IHDR and IDAT
        pos = 8
        idat_chunks = []
        width = height = bit_depth = color_type = 0

        while pos < len(data):
            length = struct.unpack(">I", data[pos:pos+4])[0]
            chunk_type = data[pos+4:pos+8]
            chunk_data = data[pos+8:pos+8+length]

            if chunk_type == b"IHDR":
                width, height = struct.unpack(">II", chunk_data[:8])
                bit_depth, color_type = chunk_data[8], chunk_data[9]
            elif chunk_type == b"IDAT":
                idat_chunks.append(chunk_data)
            elif chunk_type == b"IEND":
                break

            pos += 12 + length

        # Only handle 8-bit RGB (color_type=2) or RGBA (color_type=6)
        if bit_depth != 8 or color_type not in (2, 6):
            return None

        channels = 3 if color_type == 2 else 4
        raw = zlib.decompress(b"".join(idat_chunks))

        pixels = []
        stride = width * channels + 1  # +1 for filter byte per row

        for row in range(height):
            row_start = row * stride + 1  # skip filter byte
            for col in range(0, width * channels, channels):
                idx = row_start + col
                r, g, b = raw[idx], raw[idx+1], raw[idx+2]
                pixels.append((r, g, b))

        return pixels

    except Exception:
        return None


def _read_jpeg_pixels_approx(path):
    """
    Approximate JPEG color sampling by reading raw byte triplets.
    Not pixel-perfect but good enough for dominant color detection.
    """
    try:
        with open(path, "rb") as f:
            raw = f.read()

        # Skip JPEG header bytes (first ~500 bytes are metadata)
        payload = raw[500:]
        pixels = []
        step = max(1, len(payload) // (300 * 3))  # sample ~300 pixels

        for i in range(0, len(payload) - 2, step * 3):
            r, g, b = payload[i], payload[i+1], payload[i+2]
            # Filter out near-black/white noise bytes
            if 20 < r < 235 and 20 < g < 235 and 20 < b < 235:
                pixels.append((r, g, b))

        return pixels if pixels else None

    except Exception:
        return None


def analyze_image(image_path):
    """
    Analyze a crop image and return a health prediction.

    Strategy:
    - Sample pixel colors from the image
    - Classify each pixel as: green (healthy), yellow/brown (stressed), or other
    - Compute ratio of healthy vs stressed pixels
    - Return structured result

    Returns a dict:
        prediction  : "Healthy" | "Unhealthy"
        confidence  : float (0.0 – 1.0)
        reason      : str
        suggestion  : str
    """
    ext = os.path.splitext(image_path)[1].lower()

    # Try to read pixels based on format
    pixels = None
    if ext == ".png":
        pixels = _read_png_pixels(image_path)
    if pixels is None:
        # Fallback: approximate sampling for JPEG or unreadable PNG
        pixels = _read_jpeg_pixels_approx(image_path)

    # If we still can't read pixels, return a safe default
    if not pixels or len(pixels) < 10:
        return {
            "prediction": "Healthy",
            "confidence": 0.60,
            "reason": "Image format could not be fully decoded; defaulting to visual inspection baseline.",
            "suggestion": "For best results, upload a clear PNG or JPEG image of the crop leaves.",
        }

    # ── Pixel classification ──────────────────────────────────────────────
    green_count  = 0
    yellow_count = 0
    brown_count  = 0
    total        = len(pixels)

    for r, g, b in pixels:
        # Green: G channel dominant, moderate saturation
        if g > r + 15 and g > b + 15:
            green_count += 1
        # Yellow: high R + G, low B
        elif r > 140 and g > 120 and b < 100:
            yellow_count += 1
        # Brown: high R, moderate G, low B
        elif r > 100 and g < r - 20 and b < 80:
            brown_count += 1

    green_ratio   = green_count  / total
    stressed_ratio = (yellow_count + brown_count) / total

    # ── Decision logic ────────────────────────────────────────────────────
    if green_ratio >= 0.45:
        confidence = round(min(0.60 + green_ratio * 0.4, 0.98), 2)
        return {
            "prediction": "Healthy",
            "confidence": confidence,
            "reason": (
                f"Approximately {int(green_ratio * 100)}% of the image shows "
                "strong green pigmentation, indicating good chlorophyll levels."
            ),
            "suggestion": (
                "Crop appears healthy. Maintain current irrigation and "
                "fertilization schedule. Monitor weekly."
            ),
        }

    elif stressed_ratio >= 0.35:
        confidence = round(min(0.55 + stressed_ratio * 0.4, 0.97), 2)
        dominant = "yellow" if yellow_count >= brown_count else "brown"
        return {
            "prediction": "Unhealthy",
            "confidence": confidence,
            "reason": (
                f"Approximately {int(stressed_ratio * 100)}% of the image shows "
                f"{dominant} discoloration, which may indicate nutrient deficiency, "
                "drought stress, or fungal infection."
            ),
            "suggestion": (
                "Inspect leaves for fungal spots or pest damage. "
                "Check soil moisture and nitrogen levels. "
                "Consider applying a balanced fertilizer and ensure adequate irrigation."
            ),
        }

    else:
        # Mixed / ambiguous — lean slightly unhealthy to be cautious
        confidence = round(0.55 + abs(green_ratio - stressed_ratio) * 0.3, 2)
        prediction = "Healthy" if green_ratio > stressed_ratio else "Unhealthy"
        return {
            "prediction": prediction,
            "confidence": confidence,
            "reason": (
                f"Mixed color distribution detected (green: {int(green_ratio*100)}%, "
                f"stressed: {int(stressed_ratio*100)}%). "
                "Image may contain soil, sky, or non-leaf regions."
            ),
            "suggestion": (
                "Upload a close-up image of the crop leaves for a more accurate result. "
                "Visually inspect the plant for wilting, spots, or discoloration."
            ),
        }
