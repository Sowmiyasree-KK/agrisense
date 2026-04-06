import axios from "axios";

/**
 * HOW THE BACKEND URL WORKS
 * ─────────────────────────────────────────────────────────────────────────
 * We use an environment variable (VITE_API_URL) so the same codebase works
 * in every environment without any code changes:
 *
 *  • Local dev  → set VITE_API_URL in .env.local (e.g. http://localhost:5000)
 *  • Vercel     → set VITE_API_URL in the Vercel dashboard → Project Settings
 *                 → Environment Variables
 *  • No variable set → falls back to the deployed Render backend automatically
 *
 * WHY NOT HARDCODE THE URL?
 * Hardcoding means you must edit source code every time the backend moves.
 * An env variable lets you change the target with zero code changes.
 *
 * Vite exposes env variables that start with VITE_ to the browser bundle.
 * Access them via: import.meta.env.VITE_API_URL
 */

// ── Single source of truth for the backend address ────────────────────────
export const BASE_URL =
  import.meta.env.VITE_API_URL || "https://agrisense-hsc5.onrender.com";
// ─────────────────────────────────────────────────────────────────────────

// Axios instance — all API calls go through this one object.
// Timeout is generous (12 s) because Render free tier cold-starts can be slow.
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Fetch one soil reading from the Flask /data endpoint.
 * Returns the full payload: temp, moisture, ph, status, crops, advice, risk, hash …
 */
export async function fetchSoilData() {
  try {
    const response = await api.get("/data");
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw new Error(
        `Cannot reach backend at ${BASE_URL}. ` +
        `Check your internet connection or VITE_API_URL setting.`
      );
    }
    const msg = err.response?.data?.error || err.response?.statusText;
    throw new Error(`Server error ${err.response.status}: ${msg}`);
  }
}

/**
 * Upload a crop image to /predict for health analysis.
 * @param {File} imageFile — File object from <input type="file">
 * @returns {Promise<{prediction, confidence, reason, suggestion}>}
 */
export async function predictCrop(imageFile) {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    // Do NOT set Content-Type manually for FormData —
    // the browser adds the correct multipart boundary automatically.
    const response = await axios.post(`${BASE_URL}/predict`, formData, {
      timeout: 20000, // image upload + inference can take a few seconds
    });
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw new Error(
        `Cannot reach backend at ${BASE_URL}. ` +
        `Check your internet connection or VITE_API_URL setting.`
      );
    }
    const msg = err.response?.data?.error || err.response?.statusText;
    throw new Error(`Prediction failed: ${msg}`);
  }
}
