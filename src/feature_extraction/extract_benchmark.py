#!/usr/bin/env python3
"""
Vid — Benchmark Engine

Computes a single honest baseline BenchmarkEntry from real Syzkaller run data
(coverage.json + executions.json + crashes.json). This does NOT fabricate a
policy comparison -- only one policy (Syzkaller's default heuristic) has
actually been run, so this produces exactly one real entry, not a
multi-policy table. A second entry can be appended once Policy V2 exists.

Usage:
    python3 extract_benchmark.py results/coverage.json results/executions.json results/crashes.json results/benchmark.json
"""

import sys
import json
import os


def main():
    if len(sys.argv) != 5:
        print(f"usage: {sys.argv[0]} <coverage.json> <executions.json> <crashes.json> <output.json>", file=sys.stderr)
        sys.exit(1)

    coverage_path, executions_path, crashes_path, out_path = sys.argv[1:5]

    coverage = json.load(open(coverage_path))
    executions = json.load(open(executions_path))
    crashes = json.load(open(crashes_path))

    if not coverage or not executions:
        print("No data to compute benchmark from.", file=sys.stderr)
        sys.exit(1)

    final_coverage = coverage[-1]["coverage"]
    total_execs = len(executions)

    durations = [e["duration"] for e in executions if e.get("duration", 0) > 0]
    total_duration_sec = sum(durations) if durations else 1
    exec_per_sec = round(total_execs / total_duration_sec, 2) if total_duration_sec > 0 else 0

    crash_count = len(crashes)
    time_to_first = crashes[0]["timeToFirst"] if crashes else 0

    entry = {
        "policy": "Random",
        "coverage": final_coverage,
        "crashes": crash_count,
        "timeToFirst": time_to_first,
        "execPerSec": exec_per_sec,
        "cpuEff": 0,
        "memEff": 0,
    }

    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    with open(out_path, "w") as f:
        json.dump([entry], f, indent=2)

    print(f"Wrote 1 benchmark entry to {out_path}: {entry}")


if __name__ == "__main__":
    main()
