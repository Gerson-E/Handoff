# app/ai/provider.py
from __future__ import annotations
import os, json, time
from typing import Optional, Dict, Any
import anthropic
from pydantic import BaseModel

class LLMClient:
    def __init__(self):
        self.enabled = bool(os.getenv("ANTHROPIC_API_KEY"))
        self.model = os.getenv("LLM_MODEL", "claude-3-5-sonnet-20241022")
        api_key = os.getenv("ANTHROPIC_API_KEY")
        self.client = anthropic.Anthropic(api_key=api_key) if api_key else None

    def json_completion(self, system: str, user: str, max_tokens: int = 256) -> Optional[Dict[str, Any]]:
        if not self.enabled:
            return None
        # Anthropic JSON output
        for attempt in range(3):
            try:
                msg = self.client.messages.create(
                    model=self.model,
                    max_tokens=max_tokens,
                    system=system,
                    messages=[{"role": "user", "content": user}],
                    response_format={"type": "json_object"},
                )
                # Content comes as list of blocks; first should be text with JSON
                text = "".join([b.text for b in msg.content if hasattr(b, "text")])
                return json.loads(text)
            except Exception:
                time.sleep(0.4 * (2**attempt))
        return None
