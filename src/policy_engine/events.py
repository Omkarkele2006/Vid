from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class SyscallEvent:
    """
    One syscall-level telemetry event extracted from Syzkaller.

    Signal is Syzkaller's deduplicated coverage signal for this call.
    new_edges is derived as len(signal).
    """

    name: str

    # Syzkaller CallInfoRawT.Signal
    signal: List[int] = field(default_factory=list)

    # Number of new coverage signals contributed by this syscall.
    new_edges: int = 0

    # Raw coverage PCs are optional and normally unavailable in the
    # current Syzkaller collection mode.
    cover: List[int] = field(default_factory=list)

    # Number of raw PCs observed, when available.
    coverage: int = 0

    # Syzkaller execution information.
    errno: int = 0
    flags: int = 0

    def __post_init__(self):
        # Signal is the authoritative source for new-edge count.
        if self.signal and self.new_edges == 0:
            self.new_edges = len(self.signal)

        # Cover is optional; currently expected to be empty.
        if self.cover and self.coverage == 0:
            self.coverage = len(self.cover)


@dataclass
class ExecutionEvent:
    """
    Canonical execution-level telemetry record.

    One ExecutionEvent contains all syscall-level events belonging
    to one Syzkaller execution/program.
    """

    exec_id: str
    timestamp: str

    syscalls: List[SyscallEvent] = field(default_factory=list)

    # Aggregate new coverage across all syscalls in this execution.
    total_new_coverage: int = 0

    # Execution duration in milliseconds.
    exec_time_ms: float = 0.0

    # Crash information.
    crashed: bool = False
    crash_id: Optional[str] = None

    def __post_init__(self):
        # Automatically derive aggregate coverage when syscall
        # telemetry is available.
        if self.total_new_coverage == 0 and self.syscalls:
            self.total_new_coverage = sum(
                syscall.new_edges for syscall in self.syscalls
            )