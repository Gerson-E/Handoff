from __future__ import annotations

import uuid


def new_id(prefix: str = "id") -> str:
    return f"{prefix}-{uuid.uuid4().hex[:8]}"


def new_decision_id() -> str:
    return new_id("dec")


