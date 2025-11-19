from __future__ import annotations

import argparse
import asyncio
import json
import random
import time
from typing import Dict, List, Tuple

import httpx


REQUEST_TEXTS = {
    "imaging": [
        "Patient needs MRI of knee after injury.",
        "CT scan recommended by ED clinician.",
        "Ultrasound to evaluate abdominal pain.",
    ],
    "lab": [
        "Routine blood panel and A1C.",
        "CBC and CMP ordered by PCP.",
        "Lipid panel for annual exam.",
    ],
    "referral": [
        "Refer to specialist for follow-up care.",
        "Referral to cardiology clinic.",
        "Outpatient orthopedics referral.",
    ],
}


def parse_mix(mix: str) -> List[Tuple[str, float]]:
    parts = [p.strip() for p in mix.split(",") if p.strip()]
    out: List[Tuple[str, float]] = []
    total = 0.0
    for p in parts:
        if ":" not in p:
            continue
        key, val = p.split(":", 1)
        try:
            w = float(val)
        except ValueError:
            continue
        out.append((key.strip().lower(), w))
        total += w
    if not out or total <= 0:
        return [("imaging", 1.0)]
    # Normalize
    return [(k, w / total) for k, w in out]


def choose_type(mix: List[Tuple[str, float]]) -> str:
    r = random.random()
    acc = 0.0
    for k, w in mix:
        acc += w
        if r <= acc:
            return k
    return mix[-1][0]


def random_patient_id(prefix: str, count: int) -> str:
    idx = random.randint(0, max(0, count - 1))
    return f"{prefix}{idx:05d}"


async def send_one(client: httpx.AsyncClient, url: str, api_key: str | None, payload: Dict) -> None:
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["x-api-key"] = api_key
    try:
        resp = await client.post(url, headers=headers, content=json.dumps(payload))
        _ = resp.status_code  # for debugging; ignored
    except Exception:
        pass


async def run_rps(
    base_url: str,
    rps: float,
    mix: List[Tuple[str, float]],
    duration_s: float,
    api_key: str | None,
    missing_prob: float,
    patient_prefix: str,
    patient_count: int,
) -> None:
    route_url = base_url.rstrip("/") + "/route"
    period = 1.0 / max(0.1, rps)
    end = time.time() + duration_s if duration_s > 0 else None

    async with httpx.AsyncClient(timeout=10.0) as client:
        while end is None or time.time() < end:
            t0 = time.time()

            kind = choose_type(mix)
            patient_id = random_patient_id(patient_prefix, patient_count)
            payload: Dict = {
                "patient_id": patient_id,
                "request_type": kind,
                "department": "Radiology" if kind == "imaging" else ("Lab" if kind == "lab" else "Referral"),
                "location_hint": "90007",
            }
            if random.random() < missing_prob:
                # exercise classifier: drop request_type and include free_text
                payload.pop("request_type", None)
                texts = REQUEST_TEXTS.get(kind, ["Follow-up request."])
                payload["free_text"] = random.choice(texts)

            asyncio.create_task(send_one(client, route_url, api_key, payload))

            # sleep to maintain approximate RPS
            elapsed = time.time() - t0
            to_sleep = max(0.0, period - elapsed)
            await asyncio.sleep(to_sleep)


def main() -> None:
    parser = argparse.ArgumentParser(description="Simple traffic simulator for /route")
    parser.add_argument("--url", default="http://localhost:8000", help="Base URL of API")
    parser.add_argument("--rps", type=float, default=2.0, help="Requests per second")
    parser.add_argument(
        "--mix",
        default="imaging:0.6,lab:0.2,referral:0.2",
        help="Comma mix of type:weight, sums to 1.0",
    )
    parser.add_argument("--duration", type=float, default=60.0, help="Duration seconds (0=forever)")
    parser.add_argument("--api-key", default=None, help="x-api-key value if required")
    parser.add_argument("--missing-prob", type=float, default=0.3, help="Probability to omit request_type and include free_text")
    parser.add_argument("--patient-prefix", default="patient-", help="Seed patient ID prefix")
    parser.add_argument("--patient-count", type=int, default=100, help="Number of seeded patients")

    args = parser.parse_args()
    mix = parse_mix(args.mix)
    asyncio.run(
        run_rps(
            base_url=args.url,
            rps=args.rps,
            mix=mix,
            duration_s=args.duration,
            api_key=args.api_key,
            missing_prob=max(0.0, min(1.0, args.missing_prob)),
            patient_prefix=args.patient_prefix,
            patient_count=args.patient_count,
        )
    )


if __name__ == "__main__":
    main()


