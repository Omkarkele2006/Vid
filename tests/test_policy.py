import json
import sys
from pathlib import Path

# Allow importing src/policy_engine/policy.py
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.policy_engine.policy import calculate_priority


# ---------------------------------------------------------
# Load real project data
# ---------------------------------------------------------

def load_json(filename):
    path = ROOT / "results" / filename

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


coverage_data = load_json("coverage.json")
execution_data = load_json("executions.json")
crash_data = load_json("crashes.json")


# ---------------------------------------------------------
# Basic policy test
# ---------------------------------------------------------

def test_policy_returns_valid_result():

    result = calculate_priority(
        coverage_data[0],
        execution_data,
        crash_data,
    )

    assert isinstance(result, dict)

    assert result["policy"] == "AdaptiveHeuristicV1"

    assert 0.0 <= result["score"] <= 1.0

    assert result["priority"] in {
        "low",
        "medium",
        "high",
    }

    assert "signals" in result
    assert "reason" in result


# ---------------------------------------------------------
# Coverage signal test
# ---------------------------------------------------------

def test_policy_detects_new_edges():

    record = {
        "coverage": 50000,
        "newEdges": 1000,
        "executions": 100,
    }

    result = calculate_priority(
        record,
        execution_data,
        [],
    )

    assert result["signals"]["newEdges"] == 1000


# ---------------------------------------------------------
# Crash signal test
# ---------------------------------------------------------

def test_reproduced_crash_increases_priority():

    record = {
        "coverage": 10000,
        "newEdges": 0,
        "executions": 10,
    }

    crashes = [
        {
            "severity": "medium",
            "reproduced": True,
        }
    ]

    result = calculate_priority(
        record,
        execution_data,
        crashes,
    )

    assert result["signals"]["crash"] == 1.0
    assert result["score"] > 0.0


# ---------------------------------------------------------
# No crash test
# ---------------------------------------------------------

def test_no_crash_has_zero_crash_signal():

    record = {
        "coverage": 10000,
        "newEdges": 0,
        "executions": 10,
    }

    result = calculate_priority(
        record,
        execution_data,
        [],
    )

    assert result["signals"]["crash"] == 0.0


# ---------------------------------------------------------
# Score bounds test
# ---------------------------------------------------------

def test_score_is_bounded():

    for record in coverage_data[:20]:

        result = calculate_priority(
            record,
            execution_data,
            crash_data,
        )

        assert 0.0 <= result["score"] <= 1.0


# ---------------------------------------------------------
# Real dataset test
# ---------------------------------------------------------

def test_real_dataset():

    results = []

    for record in coverage_data:

        result = calculate_priority(
            record,
            execution_data,
            crash_data,
        )

        results.append(result)

    assert len(results) == len(coverage_data)

    # Every real coverage record should produce a decision.
    for result in results:

        assert result["policy"] == "AdaptiveHeuristicV1"
        assert result["priority"] in {"low", "medium", "high"}
        assert 0.0 <= result["score"] <= 1.0


if __name__ == "__main__":
    print("Running Policy Engine V1 tests...")

    test_policy_returns_valid_result()
    test_policy_detects_new_edges()
    test_reproduced_crash_increases_priority()
    test_no_crash_has_zero_crash_signal()
    test_score_is_bounded()
    test_real_dataset()

    print("All Policy Engine V1 tests passed.")