"""
Run Vid Adaptive Policy V1 against extracted Syzkaller data.

Input:
    results/coverage.json
    results/executions.json
    results/crashes.json

Output:
    results/policy_decisions.json
"""

import json
import sys
from pathlib import Path
from statistics import mean


# ---------------------------------------------------------
# Project root
# ---------------------------------------------------------

ROOT = Path(__file__).resolve().parents[1]

# Allow imports from the Vid project root.
sys.path.insert(0, str(ROOT))

from src.policy_engine.policy import calculate_priority


# ---------------------------------------------------------
# Paths
# ---------------------------------------------------------

RESULTS_DIR = ROOT / "results"

COVERAGE_FILE = RESULTS_DIR / "coverage.json"
EXECUTIONS_FILE = RESULTS_DIR / "executions.json"
CRASHES_FILE = RESULTS_DIR / "crashes.json"

OUTPUT_FILE = RESULTS_DIR / "policy_decisions.json"

# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------

def load_json(path):
    """Load a JSON file and return its contents."""

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def save_json(path, data):
    """Save data as formatted JSON."""

    with open(path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2)


# ---------------------------------------------------------
# Main
# ---------------------------------------------------------

def main():

    print("Running Vid Adaptive Policy V1...")
    print()

    # Load extracted Syzkaller data
    coverage_data = load_json(COVERAGE_FILE)
    execution_data = load_json(EXECUTIONS_FILE)
    crash_data = load_json(CRASHES_FILE)

    print(f"Coverage records : {len(coverage_data)}")
    print(f"Execution records: {len(execution_data)}")
    print(f"Crash records    : {len(crash_data)}")
    print()

    decisions = []

    # Generate one policy decision for every coverage record
    for record in coverage_data:

        decision = calculate_priority(
            coverage_record=record,
            execution_records=execution_data,
            crashes=crash_data,
        )

        # Preserve useful information from the original
        # coverage record for traceability.
        decision["timestamp"] = record.get("timestamp")
        decision["coverageRecord"] = {
            "coverage": record.get("coverage", 0),
            "edges": record.get("edges", 0),
            "newEdges": record.get("newEdges", 0),
            "executions": record.get("executions", 0),
        }

        decisions.append(decision)

    # -----------------------------------------------------
    # Statistics
    # -----------------------------------------------------

    high_count = sum(
        1 for decision in decisions
        if decision["priority"] == "high"
    )

    medium_count = sum(
        1 for decision in decisions
        if decision["priority"] == "medium"
    )

    low_count = sum(
        1 for decision in decisions
        if decision["priority"] == "low"
    )

    scores = [
        decision["score"]
        for decision in decisions
    ]

    average_score = mean(scores) if scores else 0.0

    # -----------------------------------------------------
    # Final output
    # -----------------------------------------------------

    output = {
        "policy": "AdaptiveHeuristicV1",
        "recordsProcessed": len(decisions),
        "summary": {
            "highPriority": high_count,
            "mediumPriority": medium_count,
            "lowPriority": low_count,
            "averageScore": round(average_score, 4),
        },
        "decisions": decisions,
    }

    save_json(OUTPUT_FILE, output)

    # -----------------------------------------------------
    # Console summary
    # -----------------------------------------------------

    print("Policy execution completed.")
    print()
    print(f"Policy            : AdaptiveHeuristicV1")
    print(f"Records processed : {len(decisions)}")
    print(f"High priority     : {high_count}")
    print(f"Medium priority   : {medium_count}")
    print(f"Low priority      : {low_count}")
    print(f"Average score     : {average_score:.4f}")
    print()
    print(f"Output written to : {OUTPUT_FILE}")


if __name__ == "__main__":
    main()