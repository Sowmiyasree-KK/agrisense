"""
logic.py — Soil analysis, crop recommendation, AI advice, and risk scoring.
All pure functions — no external dependencies beyond Python stdlib.
"""


# ── 1. Soil health check ──────────────────────────────────────────────────

def check_soil(temp, moisture, ph):
    issues = []
    suggestions = []

    if temp > 32:
        issues.append("temperature too high")
        suggestions.append("provide shade or increase irrigation to cool the soil")
    elif temp < 20:
        issues.append("temperature too low")
        suggestions.append("use mulching or row covers to retain soil warmth")

    if moisture > 70:
        issues.append("moisture too high")
        suggestions.append("improve drainage and reduce watering frequency")
    elif moisture < 50:
        issues.append("moisture too low")
        suggestions.append("increase irrigation and add organic mulch to retain moisture")

    if ph > 7.5:
        issues.append("pH too alkaline")
        suggestions.append("apply sulfur or acidic fertilizers to lower pH")
    elif ph < 6.0:
        issues.append("pH too acidic")
        suggestions.append("apply agricultural lime to raise pH")

    if issues:
        return {
            "status": "ABNORMAL",
            "reason": "Soil has " + ", ".join(issues),
            "suggestion": "; ".join(suggestions),
        }

    return {
        "status": "NORMAL",
        "reason": "All soil parameters are within optimal range",
        "suggestion": "Continue current irrigation and fertilization schedule",
    }


# ── 2. Crop recommendation ────────────────────────────────────────────────

# Each crop defines ideal ranges and a short reason template.
CROP_PROFILES = [
    {
        "name": "Wheat",
        "icon": "🌾",
        "temp":     (20, 30),
        "moisture": (50, 65),
        "ph":       (6.0, 7.5),
        "reason":   "Thrives in moderate temperature with well-drained soil",
    },
    {
        "name": "Rice",
        "icon": "🍚",
        "temp":     (25, 35),
        "moisture": (60, 80),
        "ph":       (5.5, 7.0),
        "reason":   "Prefers warm, high-moisture paddy conditions",
    },
    {
        "name": "Maize",
        "icon": "🌽",
        "temp":     (18, 32),
        "moisture": (50, 70),
        "ph":       (5.5, 7.5),
        "reason":   "Adaptable crop suited to warm, moderately moist soil",
    },
    {
        "name": "Soybean",
        "icon": "🫘",
        "temp":     (20, 30),
        "moisture": (55, 75),
        "ph":       (6.0, 7.0),
        "reason":   "Nitrogen-fixing legume ideal for balanced soil",
    },
    {
        "name": "Cotton",
        "icon": "🌸",
        "temp":     (25, 35),
        "moisture": (45, 65),
        "ph":       (5.8, 7.5),
        "reason":   "Warm-season crop tolerant of moderate drought",
    },
    {
        "name": "Sugarcane",
        "icon": "🎋",
        "temp":     (27, 38),
        "moisture": (65, 85),
        "ph":       (6.0, 7.5),
        "reason":   "High-yield tropical crop needing warm, moist conditions",
    },
]


def _range_score(value, low, high):
    """
    Returns 0–100 score for how well a value fits within [low, high].
    100 = perfectly centred, 0 = far outside range.
    """
    if low <= value <= high:
        centre = (low + high) / 2
        half   = (high - low) / 2
        return round(100 - (abs(value - centre) / half) * 30, 1)
    # Outside range — penalise proportionally
    margin = (high - low) * 0.5
    if value < low:
        dist = low - value
    else:
        dist = value - high
    score = max(0, 100 - (dist / max(margin, 1)) * 60)
    return round(score, 1)


def recommend_crops(temp, moisture, ph):
    """
    Returns top-2 crop recommendations sorted by composite suitability score.
    Each entry: {name, icon, score, reason}
    """
    scored = []
    for crop in CROP_PROFILES:
        t_score = _range_score(temp,     *crop["temp"])
        m_score = _range_score(moisture, *crop["moisture"])
        p_score = _range_score(ph,       *crop["ph"])
        composite = round((t_score + m_score + p_score) / 3, 1)
        scored.append({
            "name":   crop["name"],
            "icon":   crop["icon"],
            "score":  composite,
            "reason": crop["reason"],
        })

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:2]


# ── 3. AI farming advice ──────────────────────────────────────────────────

def generate_advice(temp, moisture, ph, status):
    """
    Returns a list of 2–4 actionable advice strings based on current readings.
    """
    advice = []

    # Moisture advice
    if moisture > 75:
        advice.append("💧 Reduce watering — soil moisture is critically high. Improve field drainage to prevent root rot.")
    elif moisture > 70:
        advice.append("💧 Moisture is elevated. Monitor drainage channels and reduce irrigation frequency.")
    elif moisture < 45:
        advice.append("💧 Soil is too dry. Increase irrigation immediately and apply organic mulch to retain moisture.")
    elif moisture < 50:
        advice.append("💧 Moisture is slightly low. Consider a light irrigation cycle within the next 24 hours.")
    else:
        advice.append("💧 Moisture levels are optimal. Maintain current irrigation schedule.")

    # Temperature advice
    if temp > 35:
        advice.append("🌡️ Extreme heat detected. Use shade nets and increase irrigation to cool the root zone.")
    elif temp > 32:
        advice.append("🌡️ Temperature is above optimal range. Consider evening irrigation to reduce heat stress.")
    elif temp < 15:
        advice.append("🌡️ Soil temperature is too low. Apply mulching or row covers to retain warmth.")
    elif temp < 20:
        advice.append("🌡️ Temperature is slightly cool. Monitor for frost risk and consider protective covers.")

    # pH advice
    if ph > 8.0:
        advice.append("⚗️ Soil is highly alkaline. Apply elemental sulfur or acidic fertilizers to lower pH.")
    elif ph > 7.5:
        advice.append("⚗️ pH is slightly high. Consider nutrient balancing with ammonium-based fertilizers.")
    elif ph < 5.5:
        advice.append("⚗️ Soil is highly acidic. Apply agricultural lime to raise pH and improve nutrient availability.")
    elif ph < 6.0:
        advice.append("⚗️ pH is slightly acidic. A light lime application can improve crop uptake.")

    # Status-based summary
    if status == "NORMAL":
        advice.append("✅ All parameters are within optimal range. Continue current farming practices.")
    else:
        advice.append("⚠️ Abnormal conditions detected. Address the issues above before the next planting cycle.")

    return advice[:4]  # cap at 4 items


# ── 4. Risk score ─────────────────────────────────────────────────────────

def calculate_risk(temp, moisture, ph, status):
    """
    Returns a risk level: LOW, MEDIUM, or HIGH.
    Also returns a 0–100 numeric score for the progress bar.
    """
    score = 0

    # Temperature risk
    if temp > 38 or temp < 10:
        score += 35
    elif temp > 32 or temp < 15:
        score += 20
    elif temp > 30 or temp < 20:
        score += 8

    # Moisture risk
    if moisture > 85 or moisture < 35:
        score += 35
    elif moisture > 70 or moisture < 45:
        score += 20
    elif moisture > 65 or moisture < 50:
        score += 8

    # pH risk
    if ph > 8.5 or ph < 5.0:
        score += 30
    elif ph > 7.5 or ph < 6.0:
        score += 18
    elif ph > 7.2 or ph < 6.2:
        score += 6

    # Status multiplier
    if status == "ABNORMAL":
        score = min(100, int(score * 1.3))

    score = min(score, 100)

    if score >= 55:
        level = "HIGH"
    elif score >= 25:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {"level": level, "score": score}
