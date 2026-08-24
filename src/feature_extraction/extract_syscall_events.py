#!/usr/bin/env python3
"""
Vid — Feature Extraction Engine (per-syscall telemetry)
Produces results/syscall_events.jsonl matching the ExecutionEvent/SyscallEvent
schema agreed with Om for Policy V2 (UCB1/bandit).

Schema per line:
  exec_id, timestamp, syscalls[] { name, newEdges, errno, flags },
  totalNewCoverage, executionTime (ns), crashed

Data source:
  Real per-call data was pulled directly from Syzkaller's internal RPC path:
    ExecResult.Info (*ProgInfoRawT) -> Calls []*CallInfoRawT
  CallInfoRawT.Signal (per-call new coverage) was used as the reward signal
  per Om's confirmation — raw Cover (PC addresses) was not needed for V2.

How it was captured:
  A temporary debug hook (pkg/fuzzer/vid_extract.go) was added to Syzkaller's
  local checkout, writing one JSON line per completed execution to
  /tmp/vid-extraction.jsonl during a live run against our real Linux 7.1.8
  KCOV/KASAN kernel (~/syzkaller-workdir/vid-kernel.cfg). The Syzkaller source
  was reverted immediately after capture (git status clean) — no permanent
  changes were kept, per the "no changes yet unless necessary" agreement.

Run summary from this capture (2026-08-23):
  3,584 total execution events
  1,651 (46%) were multi-syscall programs
  0 crashed events (matches the real 7.1.8 baseline: 0 crashes so far)

Usage (if re-running against a fresh capture):
    python3 extract_syscall_events.py /tmp/vid-extraction.jsonl results/syscall_events.jsonl
"""
import sys
import json


def validate_and_copy(src_path: str, dst_path: str):
    count = 0
    multi = 0
    crashed = 0
    with open(src_path, "r") as fin, open(dst_path, "w") as fout:
        for line in fin:
            line = line.strip()
            if not line:
                continue
            ev = json.loads(line)  # validates JSON shape
            assert "exec_id" in ev
            assert "syscalls" in ev
            assert "totalNewCoverage" in ev
            assert "executionTime" in ev
            assert "crashed" in ev
            if len(ev["syscalls"]) > 1:
                multi += 1
            if ev["crashed"]:
                crashed += 1
            fout.write(json.dumps(ev) + "\n")
            count += 1
    print(f"Wrote {count} events to {dst_path}")
    print(f"  multi-syscall: {multi} ({100*multi/count:.1f}%)")
    print(f"  crashed: {crashed}")


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else "/tmp/vid-extraction.jsonl"
    dst = sys.argv[2] if len(sys.argv) > 2 else "results/syscall_events.jsonl"
    validate_and_copy(src, dst)
