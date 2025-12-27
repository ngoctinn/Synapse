"""
Test FlexibleTimeSolver - Kiểm tra bộ giải OR-Tools cho tìm slot.
"""

import uuid
from datetime import date, time, datetime, timezone

from src.modules.scheduling_engine.models import (
    SchedulingProblem,
    StaffData,
    StaffScheduleData,
    ExistingAssignment,
)
from src.modules.scheduling_engine.flexible_solver import FlexibleTimeSolver


def create_test_problem() -> SchedulingProblem:
    """Tạo dữ liệu test."""
    target_date = date(2024, 1, 15)

    # 5 KTV
    staff_list = []
    schedules = []
    for i in range(5):
        s_id = uuid.uuid4()
        staff_list.append(StaffData(
            id=s_id,
            name=f"KTV_{i+1}",
            skill_ids=[]
        ))
        schedules.append(StaffScheduleData(
            staff_id=s_id,
            work_date=target_date,
            start_time=time(8, 0),
            end_time=time(20, 0),
            shift_name="Full"
        ))

    # Existing assignments (mô phỏng lịch hiện có)
    existing = []

    # KTV_1: 2 booking (120 phút) - Workload cao nhất
    existing.append(ExistingAssignment(
        item_id=uuid.uuid4(),
        staff_id=staff_list[0].id,
        resource_id=None,
        start_time=datetime.combine(target_date, time(9, 0), tzinfo=timezone.utc),
        end_time=datetime.combine(target_date, time(10, 0), tzinfo=timezone.utc)
    ))
    existing.append(ExistingAssignment(
        item_id=uuid.uuid4(),
        staff_id=staff_list[0].id,
        resource_id=None,
        start_time=datetime.combine(target_date, time(10, 30), tzinfo=timezone.utc),
        end_time=datetime.combine(target_date, time(11, 30), tzinfo=timezone.utc)
    ))

    # KTV_2: 1 booking (60 phút)
    existing.append(ExistingAssignment(
        item_id=uuid.uuid4(),
        staff_id=staff_list[1].id,
        resource_id=None,
        start_time=datetime.combine(target_date, time(9, 0), tzinfo=timezone.utc),
        end_time=datetime.combine(target_date, time(10, 0), tzinfo=timezone.utc)
    ))

    # KTV_3, KTV_4, KTV_5: Chưa có booking (Workload = 0)

    return SchedulingProblem(
        unassigned_items=[],
        available_staff=staff_list,
        available_resources=[],
        staff_schedules=schedules,
        existing_assignments=existing,
        target_date=target_date,
        weight_load_balance=1.0,
        weight_utilization=0.5,
        weight_preference=2.0,
        transition_time_minutes=15
    )


def test_flexible_solver():
    """Test FlexibleTimeSolver."""
    print("=" * 70)
    print("TEST: FlexibleTimeSolver với OR-Tools CP-SAT")
    print("=" * 70)

    problem = create_test_problem()
    solver = FlexibleTimeSolver(problem)

    print("\n[DỮ LIỆU HIỆN CÓ]")
    print(f"Số KTV: {len(problem.available_staff)}")
    print(f"Số booking hiện có: {len(problem.existing_assignments)}")

    for staff in problem.available_staff:
        workload = solver.staff_workloads.get(staff.id, 0)
        print(f"  - {staff.name}: {workload} phút")

    # Tìm slot cho booking mới (60 phút)
    print("\n[TÌM SLOT TỐI ƯU] Dịch vụ 60 phút, không có KTV yêu thích")
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        preferred_staff_id=None,
        top_k=5,
        time_limit_seconds=5
    )

    print(f"\nTìm thấy {len(slots)} slot:")
    for i, slot in enumerate(slots):
        print(f"  {i+1}. {slot.start_time.strftime('%H:%M')} - {slot.end_time.strftime('%H:%M')} | "
              f"KTV: {slot.staff.name} | Score: {slot.score}")

    # Tìm slot với KTV yêu thích (KTV_1 - đang bận nhất)
    preferred_id = problem.available_staff[0].id
    print("\n[TÌM SLOT TỐI ƯU] Dịch vụ 60 phút, KTV yêu thích: KTV_1")
    slots_with_pref = solver.find_optimal_slots(
        duration_minutes=60,
        preferred_staff_id=preferred_id,
        top_k=5,
        time_limit_seconds=5
    )

    print(f"\nTìm thấy {len(slots_with_pref)} slot:")
    for i, slot in enumerate(slots_with_pref):
        pref_mark = "⭐" if slot.staff.is_preferred else ""
        print(f"  {i+1}. {slot.start_time.strftime('%H:%M')} - {slot.end_time.strftime('%H:%M')} | "
              f"KTV: {slot.staff.name} {pref_mark} | Score: {slot.score}")

    print("\n" + "=" * 70)
    print("TEST HOÀN TẤT - OR-Tools CP-SAT ĐƯỢC SỬ DỤNG CHO TÌM SLOT!")
    print("=" * 70)


if __name__ == "__main__":
    test_flexible_solver()
