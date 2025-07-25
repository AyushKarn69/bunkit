from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import List
import tempfile
import os
from dotenv import load_dotenv
import requests


# Load environment variables from .env
load_dotenv()
app = FastAPI()

# Replace with your Gemini API endpoint and API key
gemini_api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent"
gemini_api_key = os.getenv("GEMINI_API_KEY")


def call_gemini_api(pdf_path: str, prompt: str):
    # Read PDF as bytes
    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()
    # Gemini expects base64-encoded content for files
    import base64
    pdf_base64 = base64.b64encode(pdf_bytes).decode("utf-8")
    # Construct Gemini API request
    payload = {
        "contents": [
            {"parts": [
                {"text": prompt},
                {"file_data": {"mime_type": "application/pdf", "data": pdf_base64}}
            ]}
        ]
    }
    headers = {"Content-Type": "application/json"}
    params = {"key": gemini_api_key}
    response = requests.post(gemini_api_url, json=payload, headers=headers, params=params)
    response.raise_for_status()
    return response.json()

@app.post("/api/extract-timetable")
async def extract_timetable(file: UploadFile = File(...), prompt: str = Form(...)):
    # Save uploaded PDF to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        gemini_response = call_gemini_api(tmp_path, prompt)
        # Extract the relevant data from Gemini's response
        # (Assume Gemini returns a JSON string in the first candidate's text)
        candidates = gemini_response.get("candidates", [])
        if candidates:
            import json
            text = candidates[0]["content"]["parts"][0]["text"]
            try:
                data = json.loads(text)
            except Exception:
                data = text  # fallback if not valid JSON
            return JSONResponse(content={"data": data})
        else:
            return JSONResponse(content={"error": "No candidates returned from Gemini."}, status_code=500)
    finally:
        os.remove(tmp_path)
