from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class SyscallEvent:
    name: str
    new_edges: int = 0
    coverage: int = 0


@dataclass
class ExecutionEvent:
    exec_id: str
    timestamp: str
    syscalls: List[SyscallEvent] = field(default_factory=list)

    total_new_coverage: int = 0
    exec_time_ms: float = 0.0

    crashed: bool = False
    crash_id: Optional[str] = None