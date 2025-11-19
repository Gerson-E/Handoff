# app/ai/llm_classifier.py
import os
from typing import Optional
from .provider import LLMClient

ALLOWED = ["lab","imaging","referral","telehealth","cardiology","orthopedics"]
USE_AI = os.getenv("AI_CLASSIFY","false").lower() == "true"

_client = LLMClient()

def classify_request_text(text: str) -> str:
    if not USE_AI or not _client.enabled:
        return "imaging"  # safe default
    system = "You classify healthcare service requests into strict, lowercase labels."
    user = (
        "Return a JSON object with a single key 'label' whose value is one of: "
        f"{ALLOWED}. Do not add extra keys.\nRequest: " + text
    )
    out = _client.json_completion(system, user, max_tokens=50)
    label = (out or {}).get("label", "").strip().lower()
    return label if label in ALLOWED else "imaging"
