from __future__ import annotations

import os
from functools import lru_cache
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env if present (searches upwards)
load_dotenv(find_dotenv(), override=False)


class Settings:
    api_key: str
    database_url: str
    frontend_origin: str
    ai_classify: bool
    ai_explain: bool

    def __init__(self) -> None:
        self.api_key = os.getenv("API_KEY", "")
        self.database_url = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./app.db")
        self.frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
        self.ai_classify = os.getenv("AI_CLASSIFY", "false").lower() == "true"
        self.ai_explain = os.getenv("AI_EXPLAIN", "false").lower() == "true"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


