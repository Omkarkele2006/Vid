import json
from pathlib import Path

from src.policy_engine.telemetry import load_execution_events
from src.policy_engine.policy_v2 import AdaptivePolicyV2


ROOT = Path(__file__).resolve().parents[1]

INPUT = ROOT / "results" / "syscall_events.jsonl"
OUTPUT = ROOT / "results" / "policy_v2_decisions.json"


def main():
    print("Running VID Adaptive Policy V2...")
    print()

    events = load_execution_events(INPUT)

    print(f"Execution events : {len(events)}")

    syscall_count = sum(
        len(event.syscalls)
        for event in events
    )

    print(f"Syscall events   : {syscall_count}")

    policy = AdaptivePolicyV2()
    decisions = policy.analyze(events)

    high = sum(
        d.priority == "high"
        for d in decisions
    )

    medium = sum(
        d.priority == "medium"
        for d in decisions
    )

    low = sum(
        d.priority == "low"
        for d in decisions
    )

    average_score = (
        sum(d.score for d in decisions) / len(decisions)
        if decisions else 0.0
    )

    output = [
        {
            "syscall": d.name,
            "executions": d.executions,
            "totalNewEdges": d.total_new_edges,
            "averageNewEdges": d.average_new_edges,
            "maxNewEdges": d.max_new_edges,
            "errorRate": d.error_rate,
            "score": d.score,
            "priority": d.priority,
        }
        for d in decisions
    ]

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print()
    print("Policy            : AdaptiveSyscallV2")
    print(f"Syscalls analyzed: {len(decisions)}")
    print(f"High priority     : {high}")
    print(f"Medium priority   : {medium}")
    print(f"Low priority      : {low}")
    print(f"Average score     : {average_score:.4f}")
    print()
    print(f"Output written to : {OUTPUT}")


if __name__ == "__main__":
    main()