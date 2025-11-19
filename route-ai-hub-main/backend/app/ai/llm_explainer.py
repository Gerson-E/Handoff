# app/ai/llm_explainer.py
import os
from .provider import LLMClient

USE_AI = os.getenv("AI_EXPLAIN","false").lower() == "true"
_client = LLMClient()

def explain_decision(patient_id: str, facility_name: str, features_used: dict) -> str:
    if not USE_AI or not _client.enabled:
        # deterministic fallback:
        return f"Routed to {facility_name} based on capability, proximity, and prior visits."
    system = "You write concise, clinical audit notes (<=25 words)."
    user = (
        "Return JSON with key 'text' containing a <=25-word sentence explaining the routing.\n"
        f"Patient: {patient_id}\nFacility: {facility_name}\nFeatureScores: {features_used}"
    )
    out = _client.json_completion(system, user, max_tokens=80)
    txt = (out or {}).get("text", "").strip()
    if not txt:
        txt = f"Routed to {facility_name} based on capability, proximity, and prior visits."
    # enforce length
    return " ".join(txt.split())[:200]
