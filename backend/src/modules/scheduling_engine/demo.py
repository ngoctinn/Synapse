"""
DEMO CONSOLE - FlexibleTimeSolver
Kiểm chứng trực quan kết quả tìm slot tối ưu

Chạy: python -m src.modules.scheduling_engine.demo
"""

import uuid
from datetime import datetime, date, time, timezone

from src.modules.scheduling_engine.models import (
    SchedulingProblem, StaffData, StaffScheduleData,
    ResourceData, ExistingAssignment
)
from src.modules.scheduling_engine.flexible_solver import FlexibleTimeSolver


def print_header(title: str):
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)


def print_section(title: str):
    print(f"\n[{title}]")
    print("-" * 50)


def run_demo():
    """Demo tìm slot với dữ liệu thực tế."""
    print_header("🔬 DEMO FLEXIBLETIMESOLVER - KIỂM CHỨNG TRỰC QUAN")

    target_date = date(2024, 1, 15)

    # =====================================================
    # 1. TẠO DỮ LIỆU TEST
    # =====================================================
    print_section("1. DỮ LIỆU ĐẦU VÀO")

    # Skills
    skill_massage = uuid.uuid4()
    skill_facial = uuid.uuid4()
    print(f"Skills: Massage ({str(skill_massage)[:8]}...), Facial ({str(skill_facial)[:8]}...)")

    # Staff
    staff_list = [
        StaffData(id=uuid.uuid4(), name="Lan", skill_ids=[skill_massage, skill_facial]),
        StaffData(id=uuid.uuid4(), name="Huệ", skill_ids=[skill_massage]),
        StaffData(id=uuid.uuid4(), name="Mai", skill_ids=[skill_facial]),
    ]

    schedules = [
        StaffScheduleData(staff_id=s.id, work_date=target_date,
                          start_time=time(8, 0), end_time=time(18, 0), shift_name="Full")
        for s in staff_list
    ]

    print("\nStaff (3 người):")
    for s in staff_list:
        skills_name = []
        if skill_massage in s.skill_ids:
            skills_name.append("Massage")
        if skill_facial in s.skill_ids:
            skills_name.append("Facial")
        print(f"  • {s.name}: {', '.join(skills_name)}")

    # Resources
    bed_group = uuid.uuid4()
    equip_group = uuid.uuid4()

    resources = [
        ResourceData(id=uuid.uuid4(), name="Giường 1", group_id=bed_group, group_name="Giường"),
        ResourceData(id=uuid.uuid4(), name="Giường 2", group_id=bed_group, group_name="Giường"),
        ResourceData(id=uuid.uuid4(), name="Máy Laser", group_id=equip_group, group_name="Thiết bị"),
    ]

    print("\nResources (3):")
    for r in resources:
        print(f"  • {r.name} ({r.group_name})")

    # Existing bookings
    existing = [
        ExistingAssignment(
            staff_id=staff_list[0].id,  # Lan
            resource_id=resources[0].id,  # Giường 1
            start_time=datetime.combine(target_date, time(9, 0), tzinfo=timezone.utc),
            end_time=datetime.combine(target_date, time(10, 30), tzinfo=timezone.utc)
        ),
        ExistingAssignment(
            staff_id=staff_list[0].id,  # Lan
            resource_id=resources[0].id,
            start_time=datetime.combine(target_date, time(14, 0), tzinfo=timezone.utc),
            end_time=datetime.combine(target_date, time(15, 30), tzinfo=timezone.utc)
        ),
        ExistingAssignment(
            staff_id=staff_list[1].id,  # Huệ
            resource_id=resources[1].id,  # Giường 2
            start_time=datetime.combine(target_date, time(10, 0), tzinfo=timezone.utc),
            end_time=datetime.combine(target_date, time(11, 30), tzinfo=timezone.utc)
        ),
    ]

    print("\nLịch hiện có (3 booking):")
    for e in existing:
        staff_name = next(s.name for s in staff_list if s.id == e.staff_id)
        resource_name = next((r.name for r in resources if r.id == e.resource_id), "N/A")
        print(f"  • {e.start_time.strftime('%H:%M')}-{e.end_time.strftime('%H:%M')}: "
              f"{staff_name} @ {resource_name}")

    # =====================================================
    # 2. TÌM SLOT VỚI YÊU CẦU CỤ THỂ
    # =====================================================
    print_section("2. YÊU CẦU BOOKING MỚI")

    duration = 60
    required_skill = skill_massage
    preferred_staff = staff_list[0]  # Muốn Lan

    print(f"Dịch vụ: Massage ({duration} phút)")
    print("Yêu cầu: Skill Massage + 1 Giường")
    print(f"KTV yêu thích: {preferred_staff.name}")

    # =====================================================
    # 3. GIẢI VÀ IN KẾT QUẢ
    # =====================================================
    print_section("3. KẾT QUẢ TÌM SLOT (OR-Tools CP-SAT)")

    problem = SchedulingProblem(
        unassigned_items=[],
        available_staff=staff_list,
        available_resources=resources,
        staff_schedules=schedules,
        existing_assignments=existing,
        target_date=target_date,
        weight_load_balance=3.0,
        weight_utilization=1.0,
        weight_preference=5.0,
        transition_time_minutes=15
    )

    import time as time_module
    start_t = time_module.time()

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=duration,
        required_skill_ids=[required_skill],
        required_resource_group_ids=[bed_group],
        preferred_staff_id=preferred_staff.id,
        top_k=5,
        time_limit_seconds=5
    )

    elapsed_ms = (time_module.time() - start_t) * 1000

    print(f"\n⏱️  Thời gian giải: {elapsed_ms:.1f}ms")
    print(f"📊 Tìm được: {len(slots)} slot\n")

    if slots:
        print(f"{'#':<3} {'Giờ':<15} {'KTV':<10} {'Pref':<6} {'Resource':<15} {'Score':<8}")
        print("-" * 60)

        for i, slot in enumerate(slots):
            time_str = f"{slot.start_time.strftime('%H:%M')}-{slot.end_time.strftime('%H:%M')}"
            pref_mark = "⭐" if slot.staff.is_preferred else ""
            res_names = ", ".join(r.name for r in slot.resources) if slot.resources else "N/A"

            print(f"{i+1:<3} {time_str:<15} {slot.staff.name:<10} {pref_mark:<6} {res_names:<15} {slot.score:<8.1f}")

    # =====================================================
    # 4. KIỂM CHỨNG RÀNG BUỘC
    # =====================================================
    print_section("4. KIỂM CHỨNG RÀNG BUỘC")

    checks = []

    # H02: Staff No-Overlap
    staff_overlap = False
    for slot in slots:
        for e in existing:
            if slot.staff.id == e.staff_id:
                if not (slot.end_time <= e.start_time or slot.start_time >= e.end_time):
                    staff_overlap = True
    checks.append(("H02 Staff No-Overlap", not staff_overlap))

    # H04: Skill Matching (lookup từ staff_list vì StaffSuggestionInfo không có skill_ids)
    def get_staff_skills(staff_id):
        return next((s.skill_ids for s in staff_list if s.id == staff_id), [])
    skill_ok = all(required_skill in get_staff_skills(slot.staff.id) for slot in slots)
    checks.append(("H04 Skill Matching", skill_ok))

    # H05: Resource Group (lookup từ resources list vì ResourceSuggestionInfo không có group_id)
    def get_resource_group(res_id):
        return next((r.group_id for r in resources if r.id == res_id), None)
    resource_ok = all(
        any(get_resource_group(r.id) == bed_group for r in slot.resources)
        for slot in slots
    ) if slots else True
    checks.append(("H05 Resource Group", resource_ok))

    # H06: Shift Boundaries
    shift_ok = all(
        slot.start_time.hour >= 8 and slot.end_time.hour <= 18
        for slot in slots
    )
    checks.append(("H06 Shift Boundaries", shift_ok))

    # S01: Preference
    pref_first = slots[0].staff.id == preferred_staff.id if slots else False
    checks.append(("S01 Preference (Best=Lan)", pref_first))

    for name, passed in checks:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"  {status}: {name}")

    # =====================================================
    # TỔNG KẾT
    # =====================================================
    all_pass = all(p for _, p in checks)
    print_header("✅ TẤT CẢ RÀNG BUỘC ĐỀU THỎA MÃN" if all_pass else "❌ CÓ RÀNG BUỘC BỊ VI PHẠM")


if __name__ == "__main__":
    run_demo()
