from src.policy_engine.events import SyscallEvent, ExecutionEvent


def test_syscall_event():

    event = SyscallEvent(
        name="io_uring_setup",
        new_edges=25,
        coverage=1200,
    )

    assert event.name == "io_uring_setup"
    assert event.new_edges == 25
    assert event.coverage == 1200


def test_execution_event():

    event = ExecutionEvent(
        exec_id="exec-1",
        timestamp="2026-08-15T12:00:00Z",
        syscalls=[
            SyscallEvent(
                name="io_uring_setup",
                new_edges=25,
                coverage=1200,
            )
        ],
        total_new_coverage=25,
        exec_time_ms=5.2,
    )

    assert event.exec_id == "exec-1"
    assert len(event.syscalls) == 1
    assert event.total_new_coverage == 25
    assert event.crashed is False