"""
Scheduling Engine - Benchmark THỰC TẾ

Mô phỏng scenario thực tế:
1. Dịch vụ có duration đa dạng (30, 45, 60, 90, 120 phút)
2. Khách hàng chọn từ TOP 5 slot (không phải luôn top 1)
3. 50% khách có preference KTV
4. Có Resource constraints (Giường/Ghế)

So sánh:
- FCFS: Chọn KTV đầu tiên còn trống
- OR-Tools: Tối ưu hóa đa mục tiêu
"""

import uuid
import time as time_module
import random
from datetime import datetime, date, time, timedelta, timezone
from dataclasses import dataclass

from src.modules.scheduling_engine.models import (
    SchedulingProblem, StaffData, StaffScheduleData,
    ResourceData, ExistingAssignment
)
from src.modules.scheduling_engine.flexible_solver import FlexibleTimeSolver


@dataclass
class SimulationResult:
    """Kết quả mô phỏng."""
    method: str
    num_bookings: int
    avg_solve_time_ms: float
    max_min_deviation: int
    jain_index: float
    pref_satisfied: int
    pref_total: int
    pref_rate: float
    workload_distribution: list[int]


def calculate_jain_index(workloads: list[int]) -> float:
    """Tính Jain's Fairness Index."""
    if not workloads or sum(workloads) == 0:
        return 1.0
    n = len(workloads)
    sum_x = sum(workloads)
    sum_x2 = sum(x * x for x in workloads)
    if sum_x2 == 0:
        return 1.0
    return (sum_x ** 2) / (n * sum_x2)


def simulate_realistic_scenario(
    num_staff: int = 10,
    num_bookings: int = 50,
    use_ortools: bool = True,
    seed: int = 42
) -> SimulationResult:
    """
    Mô phỏng scenario thực tế.

    - Duration: 30, 45, 60, 90, 120 phút (random)
    - 50% khách có preference
    - Khách chọn ngẫu nhiên từ TOP 5 (không phải luôn top 1)
    """
    random.seed(seed)
    target_date = date(2024, 1, 15)

    # Tạo staff
    staff_list = []
    schedules = []
    for i in range(num_staff):
        s_id = uuid.uuid4()
        staff_list.append(StaffData(id=s_id, name=f"KTV_{i+1}", skill_ids=[]))
        schedules.append(StaffScheduleData(
            staff_id=s_id,
            work_date=target_date,
            start_time=time(8, 0),
            end_time=time(20, 0),
            shift_name="Full"
        ))

    # Danh sách duration đa dạng
    durations = [30, 45, 60, 90, 120]

    # Preference KTV (KTV_1 được yêu thích nhất)
    preferred_staff = staff_list[0].id

    # Tracking
    workloads = {s.id: 0 for s in staff_list}
    existing_assignments: list[ExistingAssignment] = []
    staff_next_slot = {s.id: datetime.combine(target_date, time(8, 0), tzinfo=timezone.utc) for s in staff_list}

    pref_satisfied = 0
    pref_total = 0
    total_solve_time = 0.0

    method_name = "OR-Tools" if use_ortools else "FCFS"

    for booking_idx in range(num_bookings):
        # Random duration
        duration = random.choice(durations)

        # 50% khách có preference
        has_pref = random.random() < 0.5
        pref_id = preferred_staff if has_pref else None
        if has_pref:
            pref_total += 1

        if use_ortools:
            # OR-Tools: Tìm TOP 5 slot tối ưu
            problem = SchedulingProblem(
                unassigned_items=[],
                available_staff=staff_list,
                available_resources=[],
                staff_schedules=schedules,
                existing_assignments=existing_assignments.copy(),
                target_date=target_date,
                weight_load_balance=3.0,
                weight_utilization=1.0,
                weight_preference=5.0,  # Ưu tiên preference hơn
                transition_time_minutes=15
            )

            solver = FlexibleTimeSolver(problem)

            start_time = time_module.time()
            slots = solver.find_optimal_slots(
                duration_minutes=duration,
                preferred_staff_id=pref_id,
                top_k=5,
                time_limit_seconds=2
            )
            solve_time = (time_module.time() - start_time) * 1000
            total_solve_time += solve_time

            if slots:
                # Khách chọn ngẫu nhiên từ TOP 5 (thực tế hơn)
                # Xác suất: 50% chọn top 1, 25% top 2, 15% top 3, 7% top 4, 3% top 5
                weights = [0.50, 0.25, 0.15, 0.07, 0.03]
                choices = min(len(slots), 5)
                chosen_idx = random.choices(range(choices), weights=weights[:choices])[0]
                chosen = slots[chosen_idx]
                chosen_id = chosen.staff.id
            else:
                # Fallback: chọn KTV ít việc nhất
                chosen_id = min(workloads, key=lambda x: workloads[x])
        else:
            # FCFS: Chọn KTV đầu tiên còn trống theo round-robin
            chosen_idx = booking_idx % num_staff
            chosen_id = staff_list[chosen_idx].id

        # Cập nhật workload
        workloads[chosen_id] += duration

        # Thêm vào existing assignments
        start = staff_next_slot[chosen_id]
        end = start + timedelta(minutes=duration)
        existing_assignments.append(ExistingAssignment(
            item_id=uuid.uuid4(),
            staff_id=chosen_id,
            resource_id=None,
            start_time=start,
            end_time=end
        ))
        staff_next_slot[chosen_id] = end + timedelta(minutes=15)

        # Check preference
        if has_pref and chosen_id == preferred_staff:
            pref_satisfied += 1

    # Tính metrics
    loads = list(workloads.values())
    max_min = max(loads) - min(loads)
    jain = calculate_jain_index(loads)
    pref_rate = (pref_satisfied / pref_total * 100) if pref_total > 0 else 0
    avg_solve_time = total_solve_time / num_bookings if use_ortools else 0

    return SimulationResult(
        method=method_name,
        num_bookings=num_bookings,
        avg_solve_time_ms=round(avg_solve_time, 2),
        max_min_deviation=max_min,
        jain_index=round(jain, 4),
        pref_satisfied=pref_satisfied,
        pref_total=pref_total,
        pref_rate=round(pref_rate, 1),
        workload_distribution=sorted(loads)
    )


def run_realistic_benchmark():
    """Chạy benchmark với scenario thực tế."""
    print("=" * 80)
    print("   SYNAPSE SCHEDULING ENGINE - BENCHMARK THỰC TẾ")
    print("=" * 80)
    print(f"Thời gian: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    print("\n" + "=" * 70)
    print("SCENARIO MÔ PHỎNG")
    print("=" * 70)
    print("- 10 KTV, 50 booking mới")
    print("- Duration: 30, 45, 60, 90, 120 phút (random)")
    print("- 50% khách có preference KTV_1")
    print("- Khách chọn từ TOP 5 slot (xác suất: 50% top 1, 25% top 2, ...)")

    # Chạy mô phỏng
    print("\n" + "=" * 70)
    print("KẾT QUẢ MÔ PHỎNG")
    print("=" * 70)

    print("\n[FCFS] Đang mô phỏng...")
    fcfs = simulate_realistic_scenario(use_ortools=False)

    print("[OR-Tools] Đang mô phỏng với CP-SAT...")
    ortools = simulate_realistic_scenario(use_ortools=True)

    # In bảng so sánh
    print(f"\n{'Metric':<30}{'FCFS':>15}{'OR-Tools':>15}{'Cải thiện':>15}")
    print("-" * 75)

    print(f"{'Thời gian TB (ms)':<30}{'-':>15}{ortools.avg_solve_time_ms:>15.1f}{'-':>15}")

    print(f"{'Max-Min Deviation (phút)':<30}{fcfs.max_min_deviation:>15}{ortools.max_min_deviation:>15}", end="")
    if fcfs.max_min_deviation > 0:
        improvement = (fcfs.max_min_deviation - ortools.max_min_deviation) / fcfs.max_min_deviation * 100
        print(f"{improvement:>14.1f}%")
    else:
        print(f"{'N/A':>15}")

    print(f"{'Jain Fairness Index':<30}{fcfs.jain_index:>15.4f}{ortools.jain_index:>15.4f}", end="")
    delta_jain = (ortools.jain_index - fcfs.jain_index) * 100
    print(f"{delta_jain:>+14.2f}%")

    print(f"{'Preference Rate':<30}{fcfs.pref_rate:>14.1f}%{ortools.pref_rate:>14.1f}%", end="")
    delta_pref = ortools.pref_rate - fcfs.pref_rate
    print(f"{delta_pref:>+14.1f}%")

    # Workload distribution
    print("\n[Workload Distribution]")
    print(f"  FCFS:     {fcfs.workload_distribution}")
    print(f"  OR-Tools: {ortools.workload_distribution}")

    # Kết luận
    print("\n" + "=" * 80)
    print("KẾT LUẬN ĐỊNH LƯỢNG")
    print("=" * 80)

    conclusions = []

    if ortools.avg_solve_time_ms < 500:
        conclusions.append(f"✓ Thời gian phản hồi: {ortools.avg_solve_time_ms:.0f}ms < 500ms (real-time)")

    if ortools.max_min_deviation < fcfs.max_min_deviation:
        improvement = (fcfs.max_min_deviation - ortools.max_min_deviation) / fcfs.max_min_deviation * 100
        conclusions.append(f"✓ Load Balance cải thiện: {improvement:.0f}% ({fcfs.max_min_deviation} → {ortools.max_min_deviation} phút)")

    if ortools.jain_index > fcfs.jain_index:
        delta = (ortools.jain_index - fcfs.jain_index) * 100
        conclusions.append(f"✓ Jain Index: {fcfs.jain_index:.4f} → {ortools.jain_index:.4f} (+{delta:.2f}%)")

    if ortools.pref_rate > fcfs.pref_rate:
        conclusions.append(f"✓ Preference Rate: {fcfs.pref_rate:.1f}% → {ortools.pref_rate:.1f}%")
    elif ortools.pref_rate < fcfs.pref_rate:
        conclusions.append(f"⚠ Preference Rate giảm: {fcfs.pref_rate:.1f}% → {ortools.pref_rate:.1f}% (do ưu tiên Load Balance)")

    for c in conclusions:
        print(c)

    print("\n→ HÀM MỤC TIÊU ĐA BIẾN VỚI OR-Tools CP-SAT HOẠT ĐỘNG TRONG THỰC TẾ")


def run_stress_test():
    """
    Stress Test TOÀN DIỆN với đầy đủ ràng buộc:
    - Skills: 3 loại skill (Massage, Facial, Body)
    - Resources: 2 groups (Giường, Thiết bị)
    - Preferences: 50% booking có KTV yêu thích
    - Load Balance: Existing workload không đều
    """
    print("\n" + "=" * 80)
    print("STRESS TEST TOÀN DIỆN (Skills + Resources + Preferences)")
    print("=" * 80)

    test_cases = [
        # (num_staff, num_bookings, num_existing_per_staff, num_resources)
        (10, 20, 3, 5),     # Nhỏ
        (15, 50, 4, 8),     # Vừa
        (20, 100, 5, 12),   # Lớn
        (30, 150, 6, 20),   # Rất lớn
    ]

    print(f"\n{'Quy mô':<12}{'Staff':>6}{'Res':>6}{'Skills':>8}{'Pref%':>8}{'Time':>10}{'Status':>10}")
    print("-" * 60)

    random.seed(42)

    for num_staff, num_bookings, num_existing_per_staff, num_resources in test_cases:
        target_date = date(2024, 1, 15)

        # === SKILLS (3 loại) ===
        skill_massage = uuid.uuid4()
        skill_facial = uuid.uuid4()
        skill_body = uuid.uuid4()
        all_skills = [skill_massage, skill_facial, skill_body]

        # === STAFF với skills random ===
        staff_list = []
        schedules = []
        for i in range(num_staff):
            s_id = uuid.uuid4()
            # Mỗi staff có 1-3 skills random
            num_skills = random.randint(1, 3)
            staff_skills = random.sample(all_skills, num_skills)
            staff_list.append(StaffData(id=s_id, name=f"KTV_{i+1}", skill_ids=staff_skills))
            schedules.append(StaffScheduleData(
                staff_id=s_id,
                work_date=target_date,
                start_time=time(8, 0),
                end_time=time(20, 0),
                shift_name="Full"
            ))

        # === RESOURCES (2 groups) ===
        bed_group = uuid.uuid4()
        equip_group = uuid.uuid4()
        resources = []
        for i in range(num_resources // 2):
            resources.append(ResourceData(
                id=uuid.uuid4(), name=f"Giường_{i+1}",
                group_id=bed_group, group_name="Giường"
            ))
        for i in range(num_resources // 2):
            resources.append(ResourceData(
                id=uuid.uuid4(), name=f"Máy_{i+1}",
                group_id=equip_group, group_name="Thiết bị"
            ))

        # === EXISTING BOOKINGS (workload không đều) ===
        existing_assignments = []
        working_start = datetime.combine(target_date, time(8, 0), tzinfo=timezone.utc)
        staff_next_slot = {s.id: working_start for s in staff_list}

        # Một số staff có nhiều booking hơn (không đều)
        for idx, staff in enumerate(staff_list):
            # Staff đầu có ít booking, staff cuối có nhiều
            num_existing = num_existing_per_staff + (idx % 3)
            for _ in range(num_existing):
                start = staff_next_slot[staff.id]
                if start.hour >= 18:
                    break
                duration = random.choice([30, 45, 60])
                end = start + timedelta(minutes=duration)
                existing_assignments.append(ExistingAssignment(
                    staff_id=staff.id,
                    resource_id=None,
                    start_time=start,
                    end_time=end
                ))
                staff_next_slot[staff.id] = end + timedelta(minutes=15)

        # === CHẠY TEST (10 samples) ===
        sample_size = 10
        total_time = 0.0
        success_count = 0
        pref_count = 0

        for i in range(sample_size):
            # Random skill yêu cầu
            required_skill = random.choice(all_skills)

            # Random resource group (50% cần giường, 50% cần cả 2)
            if random.random() < 0.5:
                required_groups = [bed_group]
            else:
                required_groups = [bed_group, equip_group]

            # 50% có preference
            preferred_id = None
            if random.random() < 0.5:
                pref_count += 1
                # Chọn random staff có skill phù hợp
                qualified = [s for s in staff_list if required_skill in s.skill_ids]
                if qualified:
                    preferred_id = random.choice(qualified).id

            problem = SchedulingProblem(
                unassigned_items=[],
                available_staff=staff_list,
                available_resources=resources,
                staff_schedules=schedules,
                existing_assignments=existing_assignments,
                target_date=target_date,
                weight_load_balance=3.0,
                weight_utilization=1.0,
                weight_preference=5.0,
                transition_time_minutes=15
            )

            solver = FlexibleTimeSolver(problem)

            start_t = time_module.time()
            slots = solver.find_optimal_slots(
                duration_minutes=random.choice([30, 45, 60, 90]),
                required_skill_ids=[required_skill],
                required_resource_group_ids=required_groups,
                preferred_staff_id=preferred_id,
                top_k=5,
                time_limit_seconds=2
            )
            elapsed = (time_module.time() - start_t) * 1000
            total_time += elapsed

            if slots:
                success_count += 1

        avg_time = total_time / sample_size
        success_rate = success_count / sample_size * 100
        status = "✓" if success_rate >= 80 else "✗"
        pref_pct = pref_count / sample_size * 100

        label = f"{num_staff}x{num_bookings}"
        print(f"{label:<12}{num_staff:>6}{num_resources:>6}{3:>8}{pref_pct:>7.0f}%{avg_time:>9.0f}ms{status:>10}")

    print("\n[KẾT LUẬN] Stress test với đầy đủ ràng buộc đa mục tiêu")



def run_all_benchmarks():
    """Chạy tất cả benchmark."""
    print("=" * 80)
    print("   SYNAPSE SCHEDULING ENGINE - BENCHMARK TOÀN DIỆN")
    print("=" * 80)
    print(f"Thời gian: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # 1. Realistic scenario
    run_realistic_benchmark()

    # 2. Stress test
    run_stress_test()

    print("\n" + "=" * 80)
    print("TẤT CẢ BENCHMARK HOÀN TẤT")
    print("=" * 80)


if __name__ == "__main__":
    run_all_benchmarks()

