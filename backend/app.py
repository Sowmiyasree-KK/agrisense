from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
import tempfile
from datetime import datetime

from logic import check_soil, recommend_crops, generate_advice, calculate_risk
from blockchain import Blockchain
from predictor import analyze_image

app = Flask(__name__)
CORS(app)

blockchain = Blockchain()
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "crop_data.csv")

# Allowed image extensions for the /predict endpoint
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}


def _allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


# ── GET /data ─────────────────────────────────────────────────────────────
@app.route("/data", methods=["GET"])
def get_soil_data():
    try:
        if not os.path.exists(DATA_PATH):
            return jsonify({"error": f"CSV not found at {DATA_PATH}"}), 500

        df = pd.read_csv(DATA_PATH)
        sample = df.sample(n=5)

        temp     = round(float(sample["temperature"].mean()), 2)
        moisture = round(float(sample["humidity"].mean()), 2)
        ph       = round(float(sample["ph"].mean()), 2)

        result = check_soil(temp, moisture, ph)

        payload = {
            "temp":       temp,
            "moisture":   moisture,
            "ph":         ph,
            "status":     result["status"],
            "reason":     result["reason"],
            "suggestion": result["suggestion"],
            "time":       datetime.utcnow().isoformat() + "Z",
            "crops":      recommend_crops(temp, moisture, ph),
            "advice":     generate_advice(temp, moisture, ph, result["status"]),
            "risk":       calculate_risk(temp, moisture, ph, result["status"]),
        }

        block = blockchain.add_block(payload)
        payload["hash"] = block.hash

        return jsonify(payload), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── POST /predict ──────────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict_crop():
    """
    Accepts a multipart/form-data POST with an image file under the key 'image'.
    Saves it to a temp file, runs color-tone analysis, returns JSON prediction.
    """
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image file provided. Use key 'image'."}), 400

        file = request.files["image"]

        if file.filename == "":
            return jsonify({"error": "Empty filename received."}), 400

        if not _allowed_file(file.filename):
            return jsonify({
                "error": f"Unsupported file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            }), 400

        # Save to a temp file so predictor can read it
        ext = file.filename.rsplit(".", 1)[1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        try:
            result = analyze_image(tmp_path)
        finally:
            # Always clean up the temp file
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
