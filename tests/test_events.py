from src.policy_engine.events import SyscallEvent, ExecutionEvent


def test_syscall_event_derives_new_edges_from_signal():
    event = SyscallEvent(
        name="mmap",
        signal=[101, 102, 103, 104],
    )

    assert event.name == "mmap"
    assert event.new_edges == 4
    assert event.coverage == 0
    assert event.errno == 0


def test_syscall_event_preserves_explicit_new_edges():
    event = SyscallEvent(
        name="io_uring_setup",
        signal=[1, 2, 3],
        new_edges=3,
    )

    assert event.new_edges == 3


def test_execution_event_aggregates_syscall_coverage():
    syscalls = [
        SyscallEvent(name="mmap", signal=list(range(10))),
        SyscallEvent(name="read", signal=list(range(25))),
        SyscallEvent(name="write", signal=list(range(5))),
    ]

    event = ExecutionEvent(
        exec_id="exec-001",
        timestamp="2026-08-23T10:00:00Z",
        syscalls=syscalls,
    )

    assert event.total_new_coverage == 40
    assert len(event.syscalls) == 3


def test_execution_event_crash_information():
    event = ExecutionEvent(
        exec_id="exec-002",
        timestamp="2026-08-23T10:01:00Z",
        crashed=True,
        crash_id="crash-001",
    )

    assert event.crashed is True
    assert event.crash_id == "crash-001"