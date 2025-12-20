
import pytest
import uuid
from datetime import datetime, date, time
from src.modules.scheduling_engine.models import (
    SchedulingProblem,
    BookingItemData,
    StaffData,
    StaffScheduleData,
    ResourceData,
    ExistingAssignment
)
from src.modules.scheduling_engine.solver import SpaSolver, SolveStatus

# Helper to create UUIDs
def get_uuid():
    return uuid.uuid4()

@pytest.fixture
def base_problem():
    target_date = date(2025, 1, 1)
    staff_a_id = get_uuid()
    staff_b_id = get_uuid()

    staff_a = StaffData(id=staff_a_id, name="Staff A", skill_ids=[])
    staff_b = StaffData(id=staff_b_id, name="Staff B", skill_ids=[])

    # Full day shifts
    schedule_a = StaffScheduleData(
        staff_id=staff_a_id,
        work_date=target_date,
        start_time=time(8, 0),
        end_time=time(18, 0),
        shift_name="Day"
    )
    schedule_b = StaffScheduleData(
        staff_id=staff_b_id,
        work_date=target_date,
        start_time=time(8, 0),
        end_time=time(18, 0),
        shift_name="Day"
    )

    return SchedulingProblem(
        unassigned_items=[],
        available_staff=[staff_a, staff_b],
        available_resources=[],
        staff_schedules=[schedule_a, schedule_b],
        target_date=target_date,
        weight_fairness=1.0,
        weight_utilization=1.0,
        weight_preference=1.0
    )

def test_load_balancing_fairness(base_problem):
    """
    Test 2 items, 2 staff. Should assign 1 each.
    """
    target_date = base_problem.target_date

    item1 = BookingItemData(
        id=get_uuid(),
        booking_id=get_uuid(),
        service_id=get_uuid(),
        service_name="S1",
        start_time=datetime.combine(target_date, time(9, 0)),
        end_time=datetime.combine(target_date, time(10, 0)),
        duration_minutes=60
    )
    item2 = BookingItemData(
        id=get_uuid(),
        booking_id=get_uuid(),
        service_id=get_uuid(),
        service_name="S2",
        start_time=datetime.combine(target_date, time(10, 0)),
        end_time=datetime.combine(target_date, time(11, 0)),
        duration_minutes=60
    )

    base_problem.unassigned_items = [item1, item2]
    # High fairness weight to force balancing
    base_problem.weight_fairness = 10.0

    solver = SpaSolver(base_problem)
    solution = solver.solve()

    assert solution.status in [SolveStatus.OPTIMAL, SolveStatus.FEASIBLE]

    # Check assignments
    assignments = solution.assignments
    staff_counts = {}
    for a in assignments:
        staff_counts[a.staff_id] = staff_counts.get(a.staff_id, 0) + 1

    # Should be distributed 1 and 1
    assert len(staff_counts) == 2
    assert list(staff_counts.values()) == [1, 1]

def test_gap_minimization(base_problem):
    """
    Test 2 staff.
    1 task fixed (pretend via preference logic or constraint) to Staff A.
    Another task that creates a gap for Staff A but contiguous for Staff B.
    Solver should prefer Staff B to avoid gap for A.

    Actually, easier setup:
    3 tasks.
    T1: 9-10.
    T2: 10-11.
    T3: 13-14.

    Staff A does T1 (force via preference).
    Staff B is free.

    We want to assign T2.
    - If T2 -> Staff A: Contiguous with T1. Great.
    - If T2 -> Staff B: Isolated. OK.

    We want to assign T3.
    - If T3 -> Staff A (who has T1): Gap 10-13 (3h). Bad.
    - If T3 -> Staff B (who is free): Span 13-14. Gap 0. Good.

    Let's modify problem:
    T1: 9-10 (Preferred Staff A)
    T2: 13-14 (No preference)

    If T2 -> Staff A: Gap 10-13.
    If T2 -> Staff B: No Gap.

    We assume solver minimizes gaps.
    """
    target_date = base_problem.target_date
    staff_a = base_problem.available_staff[0]

    t1 = BookingItemData(
        id=get_uuid(),
        booking_id=get_uuid(),
        service_id=get_uuid(),
        service_name="T1",
        start_time=datetime.combine(target_date, time(9, 0)),
        end_time=datetime.combine(target_date, time(10, 0)),
        duration_minutes=60,
        preferred_staff_id=staff_a.id # Force to A
    )

    t2 = BookingItemData(
        id=get_uuid(),
        booking_id=get_uuid(),
        service_id=get_uuid(),
        service_name="T2",
        start_time=datetime.combine(target_date, time(13, 0)),
        end_time=datetime.combine(target_date, time(14, 0)),
        duration_minutes=60
    )

    base_problem.unassigned_items = [t1, t2]
    base_problem.weight_preference = 100.0 # Strict preference
    base_problem.weight_utilization = 10.0 # Minimize gaps
    base_problem.weight_fairness = 0.0 # Ignore load balancing

    solver = SpaSolver(base_problem)
    solution = solver.solve()

    assert solution.status in [SolveStatus.OPTIMAL, SolveStatus.FEASIBLE]

    # T1 should be A
    a1 = next(a for a in solution.assignments if a.item_id == t1.id)
    assert a1.staff_id == staff_a.id

    # T2 should be B (to avoid gap for A)
    a2 = next(a for a in solution.assignments if a.item_id == t2.id)
    assert a2.staff_id != staff_a.id

