# Syzkaller Baseline Results — Stock Kernel Smoke Test

**Date:** 2026-08-13
**Kernel:** Vanilla Linux v6.6, built locally with Syzkaller's recommended KASAN+KCOV config
**Image:** Syzkaller's stock Debian bullseye test image
**Purpose:** Confirm Syzkaller itself works end-to-end before connecting to the team's custom 7.1.8 kernel (Phase B)

## Results (after ~8 min runtime)
- Coverage: ~20,461 (climbing)
- Corpus: 98 programs
- Candidates: 319
- Total executions: 1805 (~190/min)
- Crashes: 0
- Syscalls: 4142

## Notes
- Confirms syz-manager, syz-fuzzer, syz-executor, QEMU/KVM, and SSH into guest all working correctly.
- Key issues resolved during setup: WSL memory limits (OOM during kernel build), KVM group permissions, stale/incorrect kernel image causing missing network driver, SSH key ownership/permissions blocking authentication.
