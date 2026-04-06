import axios from "axios";

/**
 * WHY WE USE LOCAL IP INSTEAD OF LOCALHOST
 * -----------------------------------------
 * "localhost" always refers to the machine running the code.
 *
 * When the React dev server (Vite) runs in your browser, "localhost"
 * points to YOUR BROWSER'S machine — not the Flask server.
 *
 * If Flask is running on a different machine, or even just a different
 * process that isn't proxied, the browser cannot reach "localhost:5000".
 *
 * Using the actual LAN IP (e.g. 172.19.3.181) tells the browser exactly
 * which machine on the network to talk to — so it always works whether
 * you're on the same PC or accessing from another device on the same WiFi.
 *
 * ✅ TO UPDATE: Run `ipconfig` in PowerShell and look for "IPv4 Address"
 *    under your active WiFi or Ethernet adapter, then change LOCAL_IP below.
 */

// ─── Single source of truth for the backend address ───────────────────────
const LOCAL_IP = "172.19.3.181"; // ← your machine's LAN IP
const PORT     = 5000;

export const BASE_URL = `http://${LOCAL_IP}:${PORT}`;
// ──────────────────────────────────────────────────────────────────────────

// Axios instance — all API calls go through this one object.
// Changing BASE_URL above is the only thing you ever need to touch.
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000, // fail fast if Flask is unreachable (8 seconds)
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch one soil reading from Flask.
 * Throws a descriptive error so the UI can show a helpful message.
 */
export async function fetchSoilData() {
  try {
    const response = await api.get("/data");
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw new Error(
        `Cannot reach Flask at ${BASE_URL}. ` +
        `Make sure the backend is running and your IP is correct.`
      );
    }
    const serverMsg = err.response?.data?.error || err.response?.statusText;
    throw new Error(`Server error ${err.response.status}: ${serverMsg}`);
  }
}

/**
 * Upload a crop image for health prediction.
 * @param {File} imageFile — the File object from an <input type="file">
 * @returns {Promise<{prediction, confidence, reason, suggestion}>}
 */
export async function predictCrop(imageFile) {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    // Note: do NOT set Content-Type header manually for FormData —
    // the browser sets it automatically with the correct boundary.
    const response = await axios.post(`${BASE_URL}/predict`, formData, {
      timeout: 15000,
    });
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw new Error(
        `Cannot reach Flask at ${BASE_URL}. ` +
        `Make sure the backend is running.`
      );
    }
    const serverMsg = err.response?.data?.error || err.response?.statusText;
    throw new Error(`Prediction failed: ${serverMsg}`);
  }
}
