"""
Vid - Adaptive Policy Engine V1

Rule-based policy for prioritizing fuzzing activity.

V1 is intentionally deterministic and explainable.
It uses currently available Syzkaller-derived data while
remaining extensible for richer execution-level telemetry.
"""

from typing import Any, Dict, List


# ---------------------------------------------------------
# Configuration
# ---------------------------------------------------------

COVERAGE_WEIGHT = 0.50
CRASH_WEIGHT = 0.35
EFFICIENCY_WEIGHT = 0.15

REPRODUCED_CRASH_SCORE = 1.0
MEDIUM_CRASH_SCORE = 0.6
LOW_CRASH_SCORE = 0.3


# ---------------------------------------------------------
# Utility functions
# ---------------------------------------------------------

def normalize(value: float, minimum: float, maximum: float) -> float:
    """Normalize a value to the range [0, 1]."""

    if maximum <= minimum:
        return 0.0

    return (value - minimum) / (maximum - minimum)


def crash_score(crashes: List[Dict[str, Any]]) -> float:
    """
    Calculate crash priority from crash records.

    Reproduced crashes receive higher priority.
    Severity is also considered.
    """

    if not crashes:
        return 0.0

    highest_score = 0.0

    for crash in crashes:
        score = 0.0

        severity = str(crash.get("severity", "")).lower()
        reproduced = crash.get("reproduced", False)

        if severity == "medium":
            score = MEDIUM_CRASH_SCORE
        elif severity == "high" or severity == "critical":
            score = 1.0
        elif severity == "low":
            score = LOW_CRASH_SCORE

        if reproduced:
            score = max(score, REPRODUCED_CRASH_SCORE)

        highest_score = max(highest_score, score)

    return highest_score


# ---------------------------------------------------------
# Policy
# ---------------------------------------------------------

def calculate_priority(
    coverage_record: Dict[str, Any],
    execution_records: List[Dict[str, Any]],
    crashes: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Calculate the priority of the current fuzzing state.

    Parameters
    ----------
    coverage_record:
        One record from results/coverage.json.

    execution_records:
        Execution records associated with the current run.

    crashes:
        Crash records from results/crashes.json.

    Returns
    -------
    dict
        Policy decision containing score, priority and explanation.
    """

    # -----------------------------------------------------
    # Coverage signal
    # -----------------------------------------------------

    new_edges = float(coverage_record.get("newEdges", 0))
    coverage = float(coverage_record.get("coverage", 0))

    # Find observed ranges from coverage data available
    # through the supplied execution context where possible.
    observed_new_edges = [
        float(record.get("newEdges", 0))
        for record in execution_records
    ]

    if observed_new_edges:
        max_new_edges = max(observed_new_edges)
    else:
        max_new_edges = new_edges

    coverage_signal = normalize(
        new_edges,
        0,
        max(max_new_edges, new_edges, 1),
    )

    # -----------------------------------------------------
    # Crash signal
    # -----------------------------------------------------

    crash_signal = crash_score(crashes)

    # -----------------------------------------------------
    # Execution efficiency signal
    # -----------------------------------------------------

    durations = [
        float(record.get("duration", 0))
        for record in execution_records
        if float(record.get("duration", 0)) >= 0
    ]

    current_duration = (
        durations[-1]
        if durations
        else 0.0
    )

    if durations:
        min_duration = min(durations)
        max_duration = max(durations)

        # Faster executions receive a higher efficiency score.
        efficiency_signal = 1.0 - normalize(
            current_duration,
            min_duration,
            max_duration,
        )
    else:
        efficiency_signal = 0.0

    # -----------------------------------------------------
    # Weighted policy score
    # -----------------------------------------------------

    score = (
        COVERAGE_WEIGHT * coverage_signal
        + CRASH_WEIGHT * crash_signal
        + EFFICIENCY_WEIGHT * efficiency_signal
    )

    score = round(max(0.0, min(score, 1.0)), 4)

    # -----------------------------------------------------
    # Decision
    # -----------------------------------------------------

    if score >= 0.70:
        priority = "high"
    elif score >= 0.40:
        priority = "medium"
    else:
        priority = "low"

    # -----------------------------------------------------
    # Explanation
    # -----------------------------------------------------

    reasons = []

    if new_edges > 0:
        reasons.append("new coverage edges detected")

    if crash_signal > 0:
        reasons.append("kernel crash signal detected")

    if efficiency_signal > 0.5:
        reasons.append("execution efficiency is favorable")

    if not reasons:
        reasons.append("no strong adaptive signal detected")

    return {
        "policy": "AdaptiveHeuristicV1",
        "score": score,
        "priority": priority,
        "signals": {
            "coverage": round(coverage_signal, 4),
            "newEdges": new_edges,
            "crash": round(crash_signal, 4),
            "efficiency": round(efficiency_signal, 4),
            "rawCoverage": coverage,
            "duration": current_duration,
        },
        "reason": reasons,
    }


# ---------------------------------------------------------
# Simple interface for future integration
# ---------------------------------------------------------

def select_policy(
    coverage_record: Dict[str, Any],
    execution_records: List[Dict[str, Any]],
    crashes: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Public policy-engine interface.

    This wrapper gives the rest of Vid a stable interface,
    allowing the internal policy to evolve later.
    """

    return calculate_priority(
        coverage_record,
        execution_records,
        crashes,
    )