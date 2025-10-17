Handoff Smart Router API (FastAPI)

Setup

1. Create and fill `.env` (see `.env.example`).
2. Install deps: `pip install -r requirements.txt`
3. Run dev server: `uvicorn app.main:app --reload`

Notes

- Async SQLAlchemy with SQLite at `DATABASE_URL`.
- CORS allowed origin pulled from `FRONTEND_ORIGIN`.
- OpenAPI endpoints match `app/docs/openapi.yaml`.


