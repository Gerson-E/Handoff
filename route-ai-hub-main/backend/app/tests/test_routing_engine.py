from __future__ import annotations

from app.domain.routing_engine import score_and_choose, _softmax_top3_confidence


def test_capability_preference():
    candidates = [
        {"id": "A", "has_capability": False, "distance_km": 1.0, "capacity_score": 0.9},
        {"id": "B", "has_capability": True,  "distance_km": 2.0, "capacity_score": 0.5},
    ]
    history = {}
    chosen, feats, reason, conf, status = score_and_choose(candidates, history, "p1", "imaging", None)
    assert chosen["id"] == "B"
    assert status == "routed"
    assert feats["capability"] == 1.0


def test_fallback_when_no_capability():
    candidates = [
        {"id": "A", "has_capability": False, "distance_km": 1.0, "capacity_score": 0.9},
        {"id": "B", "has_capability": False, "distance_km": 0.5, "capacity_score": 0.4},
    ]
    history = {}
    chosen, feats, reason, conf, status = score_and_choose(candidates, history, "p1", "imaging", None)
    assert chosen["id"] in {"A", "B"}
    assert status == "fallback"


def test_tie_breakers_history_then_capacity_then_hash():
    # identical components except history differs
    candidates = [
        {"id": "A", "has_capability": True, "distance_km": 1.0, "capacity_score": 0.5},
        {"id": "B", "has_capability": True, "distance_km": 1.0, "capacity_score": 0.5},
    ]
    history = {"A": 10, "B": 1}
    chosen, feats, reason, conf, status = score_and_choose(candidates, history, "p1", "imaging", None)
    assert chosen["id"] == "A"


