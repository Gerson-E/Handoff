from __future__ import annotations

import json
from typing import Any, Dict


def format_sse(event: str, data: Dict[str, Any]) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


def keepalive() -> str:
    # 25s comment line keeps the connection open through proxies
    return ": keepalive\n\n"


