"""
Comprehensive Tests for FlexibleTimeSolver
23 Test Cases dựa trên algorithm_spec.md

Chạy: python -m src.modules.scheduling_engine.test_flexible_solver_comprehensive

Categories:
- Hard Constraints: H01-H09 (9 tests)
- Soft Constraints: S01-S03 (3 tests)
- Multi-Resource: 3 tests
- Edge Cases: 5 tests
- Score/Ranking: 3 tests
"""

import uuid
from datetime import datetime, date, time, timezone

from src.modules.scheduling_engine.models import (
    SchedulingProblem, StaffData, StaffScheduleData,
    ResourceData, ExistingAssignment, ResourceRequirementData
)
from src.modules.scheduling_engine.flexible_solver import FlexibleTimeSolver


# ============================================================================
# HELPERS
# ============================================================================

TARGET_DATE = date(2024, 1, 15)

def create_staff(name: str, skill_ids: list[uuid.UUID] = []) -> StaffData:
    return StaffData(id=uuid.uuid4(), name=name, skill_ids=skill_ids)

def create_schedule(staff_id: uuid.UUID, start: time = time(8, 0), end: time = time(20, 0)) -> StaffScheduleData:
    return StaffScheduleData(
        staff_id=staff_id, work_date=TARGET_DATE,
        start_time=start, end_time=end, shift_name="Full"
    )

def create_resource(name: str, group_id: uuid.UUID, group_name: str = "Group") -> ResourceData:
    return ResourceData(id=uuid.uuid4(), name=name, group_id=group_id, group_name=group_name)

def create_existing(staff_id: uuid.UUID, start_hour: int, end_hour: int,
                    resource_id: uuid.UUID | None = None) -> ExistingAssignment:
    return ExistingAssignment(
        staff_id=staff_id, resource_id=resource_id,
        start_time=datetime.combine(TARGET_DATE, time(start_hour, 0), tzinfo=timezone.utc),
        end_time=datetime.combine(TARGET_DATE, time(end_hour, 0), tzinfo=timezone.utc)
    )

def create_problem(**kwargs) -> SchedulingProblem:
    defaults = {
        'unassigned_items': [],
        'available_staff': [],
        'available_resources': [],
        'staff_schedules': [],
        'existing_assignments': [],
        'target_date': TARGET_DATE,
        'weight_load_balance': 1.0,
        'weight_utilization': 1.0,
        'weight_preference': 1.0,
        'transition_time_minutes': 15
    }
    defaults.update(kwargs)
    return SchedulingProblem(**defaults)

def run_test(name: str, test_func) -> bool:
    try:
        result = test_func()
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"  {status}: {name}")
        return result
    except Exception as e:
        print(f"  ✗ ERROR: {name} - {e}")
        return False


# ============================================================================
# HARD CONSTRAINTS (H01-H09)
# ============================================================================

def test_h01_assignment_completeness():
    """H01: Mỗi slot = 1 staff + đủ resources."""
    staff = create_staff("KTV")
    bed_group = uuid.uuid4()
    bed = create_resource("Bed", bed_group, "Giường")

    problem = create_problem(
        available_staff=[staff],
        available_resources=[bed],
        staff_schedules=[create_schedule(staff.id)]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        required_resources=[ResourceRequirementData(group_id=bed_group)],
        top_k=5
    )

    # Verify: Mỗi slot có đúng 1 staff và 1 resource
    for slot in slots:
        if slot.staff is None:
            return False
        if len(slot.resources) != 1:
            return False
    return len(slots) > 0


def test_h02_staff_no_overlap():
    """H02: Slot KHÔNG trùng với existing booking của staff."""
    staff = create_staff("KTV")
    existing = create_existing(staff.id, 10, 12)  # Bận 10-12h

    problem = create_problem(
        available_staff=[staff],
        staff_schedules=[create_schedule(staff.id)],
        existing_assignments=[existing]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(duration_minutes=60, top_k=30)

    # Verify: Không có slot bắt đầu trong 10-12h (+ buffer)
    for slot in slots:
        if 10 <= slot.start_time.hour < 12:
            return False
    return True


def test_h03_resource_no_overlap():
    """H03: Resource KHÔNG bị dùng song song."""
    staff = create_staff("KTV")
    bed_group = uuid.uuid4()
    bed1 = create_resource("Bed1", bed_group, "Giường")
    bed2 = create_resource("Bed2", bed_group, "Giường")

    # Bed1 bận 10-12h
    existing = create_existing(staff.id, 10, 12, resource_id=bed1.id)

    problem = create_problem(
        available_staff=[staff],
        available_resources=[bed1, bed2],
        staff_schedules=[create_schedule(staff.id)],
        existing_assignments=[existing]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        required_resources=[ResourceRequirementData(group_id=bed_group)],
        search_start=time(10, 0), search_end=time(12, 0),
        top_k=5
    )

    # Verify: Nếu có slot 10-12h, phải dùng Bed2
    for slot in slots:
        for res in slot.resources:
            if res.id == bed1.id:
                return False
    return True


def test_h04_skill_matching():
    """H04: Staff PHẢI có skill yêu cầu."""
    skill_massage = uuid.uuid4()
    skill_facial = uuid.uuid4()

    staff_massage = create_staff("Massage", [skill_massage])
    staff_facial = create_staff("Facial", [skill_facial])

    problem = create_problem(
        available_staff=[staff_massage, staff_facial],
        staff_schedules=[
            create_schedule(staff_massage.id),
            create_schedule(staff_facial.id)
        ]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        required_skill_ids=[skill_massage],
        top_k=10
    )

    for slot in slots:
        if slot.staff.id != staff_massage.id:
            return False
    return len(slots) > 0


def test_h05_resource_group_matching():
    """H05: Resource PHẢI thuộc đúng group."""
    staff = create_staff("KTV")
    bed_group = uuid.uuid4()
    equip_group = uuid.uuid4()

    bed = create_resource("Bed", bed_group, "Giường")
    equip = create_resource("Equip", equip_group, "Thiết bị")

    problem = create_problem(
        available_staff=[staff],
        available_resources=[bed, equip],
        staff_schedules=[create_schedule(staff.id)]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        required_resources=[ResourceRequirementData(group_id=bed_group)],
        top_k=5
    )

    for slot in slots:
        for res in slot.resources:
            if res.id != bed.id:
                return False
    return len(slots) > 0


def test_h06_shift_boundaries():
    """H06: Slot PHẢI trong ca làm việc."""
    staff = create_staff("KTV")
    # Ca 9-17h
    schedule = create_schedule(staff.id, start=time(9, 0), end=time(17, 0))

    problem = create_problem(
        available_staff=[staff],
        staff_schedules=[schedule]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(duration_minutes=60, top_k=30)

    for slot in slots:
        if slot.start_time.hour < 9:
            return False
        if slot.end_time.hour > 17:
            return False
    return len(slots) > 0


def test_h07_operating_hours():
    """H07: Slot trong giờ mở cửa (8h-21h default)."""
    staff = create_staff("KTV")

    problem = create_problem(
        available_staff=[staff],
        staff_schedules=[create_schedule(staff.id)]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        search_start=time(8, 0), search_end=time(21, 0),
        top_k=30
    )

    for slot in slots:
        if slot.start_time.hour < 8:
            return False
        if slot.end_time.hour > 21:
            return False
    return len(slots) > 0


def test_h08_continuity():
    """H08: Slot có duration đúng, không bị ngắt."""
    staff = create_staff("KTV")

    problem = create_problem(
        available_staff=[staff],
        staff_schedules=[create_schedule(staff.id)]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(duration_minutes=90, top_k=10)

    for slot in slots:
        actual_duration = (slot.end_time - slot.start_time).seconds // 60
        if actual_duration != 90:
            return False
    return len(slots) > 0


def test_h09_existing_conflict():
    """H09: Slot KHÔNG trùng với booking đã confirmed."""
    staff1 = create_staff("KTV1")
    staff2 = create_staff("KTV2")

    # Staff1 có booking 9-11h, 14-16h
    existing = [
        create_existing(staff1.id, 9, 11),
        create_existing(staff1.id, 14, 16),
    ]

    problem = create_problem(
        available_staff=[staff1, staff2],
        staff_schedules=[
            create_schedule(staff1.id),
            create_schedule(staff2.id)
        ],
        existing_assignments=existing
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(duration_minutes=60, top_k=30)

    # Verify: Nếu slot của staff1, không được trùng 9-11h hoặc 14-16h
    for slot in slots:
        if slot.staff.id == staff1.id:
            if 9 <= slot.start_time.hour < 11 or 14 <= slot.start_time.hour < 16:
                return False
    return True


# ============================================================================
# SOFT CONSTRAINTS (S01-S03)
# ============================================================================

def test_s01_preference():
    """S01: Preferred staff có score cao hơn."""
    staff1 = create_staff("Preferred")
    staff2 = create_staff("Other")

    problem = create_problem(
        available_staff=[staff1, staff2],
        staff_schedules=[
            create_schedule(staff1.id),
            create_schedule(staff2.id)
        ],
        weight_load_balance=0.0,
        weight_utilization=0.0,
        weight_preference=10.0
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        preferred_staff_id=staff1.id,
        top_k=5
    )

    if not slots:
        return False
    return slots[0].staff.id == staff1.id


def test_s02_load_balance():
    """S02: Staff ít việc được ưu tiên."""
    staff_busy = create_staff("Busy")
    staff_free = create_staff("Free")

    existing = [create_existing(staff_busy.id, h, h+1) for h in [8, 10, 12, 14, 16]]

    problem = create_problem(
        available_staff=[staff_busy, staff_free],
        staff_schedules=[
            create_schedule(staff_busy.id),
            create_schedule(staff_free.id)
        ],
        existing_assignments=existing,
        weight_load_balance=10.0,
        weight_preference=0.0
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(duration_minutes=60, top_k=5)

    if not slots:
        return False
    return slots[0].staff.id == staff_free.id


def test_s03_gap_minimization():
    """S03: Slot liền kề có score tốt hơn slot tạo gap."""
    staff = create_staff("KTV")
    existing = create_existing(staff.id, 10, 11)  # Booking 10-11h

    problem = create_problem(
        available_staff=[staff],
        staff_schedules=[create_schedule(staff.id)],
        existing_assignments=[existing],
        weight_load_balance=0.0,
        weight_preference=0.0,
        weight_utilization=10.0  # Ưu tiên gap minimization
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        search_start=time(11, 0), search_end=time(16, 0),
        top_k=10
    )

    # Slot liền kề (11h15-12h15) phải có score cao hơn slot xa (14h-15h)
    if len(slots) < 2:
        return True  # Not enough data

    # Best slot should be closest to 11:00 (right after existing)
    best_slot = slots[0]
    # 11:15 là slot liền kề tốt nhất (sau buffer 15p)
    return best_slot.start_time.hour == 11


# ============================================================================
# MULTI-RESOURCE (3 tests)
# ============================================================================

def test_multi_resource_two_groups():
    """Dịch vụ cần 2 groups → trả về 2 resources."""
    staff = create_staff("KTV")
    bed_group = uuid.uuid4()
    equip_group = uuid.uuid4()

    bed = create_resource("Bed", bed_group, "Giường")
    equip = create_resource("Equip", equip_group, "Thiết bị")

    problem = create_problem(
        available_staff=[staff],
        available_resources=[bed, equip],
        staff_schedules=[create_schedule(staff.id)]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        required_resources=[
            ResourceRequirementData(group_id=bed_group),
            ResourceRequirementData(group_id=equip_group)
        ],
        top_k=5
    )

    for slot in slots:
        if len(slot.resources) != 2:
            return False
    return len(slots) > 0


def test_multi_resource_one_busy():
    """1 resource bận → dùng resource khác cùng group."""
    staff = create_staff("KTV")
    bed_group = uuid.uuid4()

    bed1 = create_resource("Bed1", bed_group, "Giường")
    bed2 = create_resource("Bed2", bed_group, "Giường")

    existing = create_existing(staff.id, 10, 12, resource_id=bed1.id)

    problem = create_problem(
        available_staff=[staff],
        available_resources=[bed1, bed2],
        staff_schedules=[create_schedule(staff.id)],
        existing_assignments=[existing]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        required_resources=[ResourceRequirementData(group_id=bed_group)],
        search_start=time(10, 0), search_end=time(12, 0),
        top_k=5
    )

    for slot in slots:
        for res in slot.resources:
            if res.id == bed1.id:
                return False
    return True


def test_multi_resource_all_busy():
    """Tất cả resources bận → return []."""
    staff = create_staff("KTV")
    bed_group = uuid.uuid4()

    bed1 = create_resource("Bed1", bed_group, "Giường")

    existing = create_existing(staff.id, 10, 12, resource_id=bed1.id)

    problem = create_problem(
        available_staff=[staff],
        available_resources=[bed1],  # Chỉ có 1 bed và đã bận
        staff_schedules=[create_schedule(staff.id)],
        existing_assignments=[existing]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        required_resources=[ResourceRequirementData(group_id=bed_group)],
        search_start=time(10, 0), search_end=time(12, 0),
        top_k=5
    )

    return len(slots) == 0


# ============================================================================
# EDGE CASES (5 tests)
# ============================================================================

def test_edge_no_staff():
    """Không có staff → return []."""
    problem = create_problem(available_staff=[], staff_schedules=[])

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(duration_minutes=60)

    return len(slots) == 0


def test_edge_no_qualified():
    """Không có staff có skill → return []."""
    skill_required = uuid.uuid4()
    staff = create_staff("No Skill", [])

    problem = create_problem(
        available_staff=[staff],
        staff_schedules=[create_schedule(staff.id)]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        required_skill_ids=[skill_required]
    )

    return len(slots) == 0


def test_edge_fully_booked():
    """Staff kín lịch → return []."""
    staff = create_staff("KTV")
    schedule = create_schedule(staff.id, start=time(8, 0), end=time(10, 0))
    existing = create_existing(staff.id, 8, 10)

    problem = create_problem(
        available_staff=[staff],
        staff_schedules=[schedule],
        existing_assignments=[existing]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        search_start=time(8, 0), search_end=time(10, 0)
    )

    return len(slots) == 0


def test_edge_duration_too_long():
    """Duration vượt ca → return []."""
    staff = create_staff("KTV")
    schedule = create_schedule(staff.id, start=time(9, 0), end=time(11, 0))  # Ca 2h

    problem = create_problem(
        available_staff=[staff],
        staff_schedules=[schedule]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=180,  # 3h > ca 2h
        search_start=time(9, 0), search_end=time(11, 0)
    )

    return len(slots) == 0


def test_edge_empty_resources():
    """Không yêu cầu resource → OK with staff only."""
    staff = create_staff("KTV")

    problem = create_problem(
        available_staff=[staff],
        staff_schedules=[create_schedule(staff.id)]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(
        duration_minutes=60,
        required_resources=[],  # Không cần resource
        top_k=5
    )

    for slot in slots:
        if len(slot.resources) != 0:
            return False
    return len(slots) > 0


# ============================================================================
# SCORE/RANKING (3 tests)
# ============================================================================

def test_score_best_first():
    """Best slot (score cao nhất) phải đứng đầu."""
    staff = create_staff("KTV")

    problem = create_problem(
        available_staff=[staff],
        staff_schedules=[create_schedule(staff.id)]
    )

    solver = FlexibleTimeSolver(problem)
    slots = solver.find_optimal_slots(duration_minutes=60, top_k=10)

    if len(slots) < 2:
        return True

    # Slot đầu tiên phải có score >= các slot sau
    for i in range(1, len(slots)):
        if slots[0].score < slots[i].score:
            return False
    return True


def test_score_consistent():
    """Cùng input → cùng output."""
    staff = create_staff("KTV")

    problem = create_problem(
        available_staff=[staff],
        staff_schedules=[create_schedule(staff.id)]
    )

    solver1 = FlexibleTimeSolver(problem)
    slots1 = solver1.find_optimal_slots(duration_minutes=60, top_k=5)

    solver2 = FlexibleTimeSolver(problem)
    slots2 = solver2.find_optimal_slots(duration_minutes=60, top_k=5)

    if len(slots1) != len(slots2):
        return False

    for s1, s2 in zip(slots1, slots2):
        if s1.start_time != s2.start_time or s1.staff.id != s2.staff.id:
            return False
    return True


def test_score_weight_impact():
    """Thay đổi weight → thay đổi kết quả."""
    staff1 = create_staff("Preferred")
    staff2 = create_staff("Other")

    existing = [create_existing(staff1.id, h, h+1) for h in [8, 10, 12]]  # staff1 nhiều việc

    schedules = [create_schedule(staff1.id), create_schedule(staff2.id)]

    # Weight preference cao
    problem1 = create_problem(
        available_staff=[staff1, staff2],
        staff_schedules=schedules,
        existing_assignments=existing,
        weight_preference=10.0,
        weight_load_balance=0.0
    )

    solver1 = FlexibleTimeSolver(problem1)
    slots1 = solver1.find_optimal_slots(duration_minutes=60, preferred_staff_id=staff1.id, top_k=1)

    # Weight load_balance cao
    problem2 = create_problem(
        available_staff=[staff1, staff2],
        staff_schedules=schedules,
        existing_assignments=existing,
        weight_preference=0.0,
        weight_load_balance=10.0
    )

    solver2 = FlexibleTimeSolver(problem2)
    slots2 = solver2.find_optimal_slots(duration_minutes=60, preferred_staff_id=staff1.id, top_k=1)

    # Kết quả phải khác nhau
    if not slots1 or not slots2:
        return True
    return slots1[0].staff.id != slots2[0].staff.id


# ============================================================================
# MAIN
# ============================================================================

def run_all_tests():
    print("=" * 70)
    print("COMPREHENSIVE TESTS - FlexibleTimeSolver (23 Tests)")
    print("=" * 70)

    results = {"passed": 0, "failed": 0}

    def run_section(name: str, tests: list):
        print(f"\n[{name}]")
        for test_name, test_func in tests:
            if run_test(test_name, test_func):
                results["passed"] += 1
            else:
                results["failed"] += 1

    # Hard Constraints
    run_section("HARD CONSTRAINTS", [
        ("H01 - Assignment Completeness", test_h01_assignment_completeness),
        ("H02 - Staff No-Overlap", test_h02_staff_no_overlap),
        ("H03 - Resource No-Overlap", test_h03_resource_no_overlap),
        ("H04 - Skill Matching", test_h04_skill_matching),
        ("H05 - Resource Group Matching", test_h05_resource_group_matching),
        ("H06 - Shift Boundaries", test_h06_shift_boundaries),
        ("H07 - Operating Hours", test_h07_operating_hours),
        ("H08 - Continuity", test_h08_continuity),
        ("H09 - Existing Conflict", test_h09_existing_conflict),
    ])

    # Soft Constraints
    run_section("SOFT CONSTRAINTS", [
        ("S01 - Preference", test_s01_preference),
        ("S02 - Load Balance", test_s02_load_balance),
        ("S03 - Gap Minimization", test_s03_gap_minimization),
    ])

    # Multi-Resource
    run_section("MULTI-RESOURCE", [
        ("Two Groups", test_multi_resource_two_groups),
        ("One Busy", test_multi_resource_one_busy),
        ("All Busy", test_multi_resource_all_busy),
    ])

    # Edge Cases
    run_section("EDGE CASES", [
        ("No Staff", test_edge_no_staff),
        ("No Qualified", test_edge_no_qualified),
        ("Fully Booked", test_edge_fully_booked),
        ("Duration Too Long", test_edge_duration_too_long),
        ("Empty Resources", test_edge_empty_resources),
    ])

    # Score/Ranking
    run_section("SCORE/RANKING", [
        ("Best First", test_score_best_first),
        ("Consistent", test_score_consistent),
        ("Weight Impact", test_score_weight_impact),
    ])

    # Summary
    print("\n" + "=" * 70)
    total = results["passed"] + results["failed"]
    print(f"RESULTS: {results['passed']}/{total} passed, {results['failed']} failed")
    print("=" * 70)

    return results["failed"] == 0


if __name__ == "__main__":
    run_all_tests()
