import uuid
from datetime import datetime, date, time, timedelta
from src.modules.scheduling_engine.models import (
    SchedulingProblem, BookingItemData, StaffData, StaffScheduleData, SolveStatus
)
from src.modules.scheduling_engine.solver import SpaSolver
from src.modules.scheduling_engine.evaluator import ScheduleEvaluator

def create_mock_problem(num_staff=10, num_bookings=50):
    target_date = date(2023, 12, 1)

    # 1. Create Staff
    staff_list = []
    schedules = []
    for i in range(num_staff):
        s_id = uuid.uuid4()
        staff_list.append(StaffData(id=s_id, name=f"KTV {i+1}", skill_ids=[]))
        schedules.append(StaffScheduleData(
            staff_id=s_id,
            work_date=target_date,
            start_time=time(8, 0),
            end_time=time(22, 0),
            shift_name="Full Shift"
        ))

    preferred_staff_id = staff_list[0].id # Mọi người đều thích KTV 1

    # 2. Create Bookings
    booking_items = []
    base_time = datetime.combine(target_date, time(9, 0))
    durations = [45, 60, 90, 120]

    for i in range(num_bookings):
        duration = durations[i % len(durations)]
        # Phân bổ thưa để staff có thể nhận nhiều booking gối đầu (không overlap)
        # i % 5: tối đa 5 booking đồng thời (trong khi có 10 staff -> thừa tài nguyên)
        slot_index = i // 5
        start = base_time + timedelta(minutes=slot_index * 60)
        end = start + timedelta(minutes=duration)

        booking_items.append(BookingItemData(
            id=uuid.uuid4(),
            booking_id=uuid.uuid4(),
            service_id=uuid.uuid4(),
            service_name="Service",
            start_time=start,
            end_time=end,
            duration_minutes=duration,
            preferred_staff_id=preferred_staff_id # Ép dồn việc vào KTV 1
        ))

    return SchedulingProblem(
        unassigned_items=booking_items,
        available_staff=staff_list,
        available_resources=[],
        staff_schedules=schedules,
        existing_assignments=[],
        target_date=target_date,
        weight_load_balance=1.0,
        weight_utilization=0.0, # Tắt gap minimization để tránh tự động cân bằng
        weight_preference=1.0
    )

def run_experiment():
    print("=== THỰC NGHIỆM KIỂM CHỨNG CHỈ SỐ CÔNG BẰNG (FAIRNESS VERIFICATION) ===")

    import time as time_bench

    # Kịch bản 1: Chỉ có Preference, không có Fairness
    problem_no_fair = create_mock_problem()
    problem_no_fair.weight_load_balance = 0.0
    problem_no_fair.weight_preference = 10.0

    start_time = time_bench.time()
    solver_no_fair = SpaSolver(problem_no_fair)
    solution_no_fair = solver_no_fair.solve()
    end_time = time_bench.time()
    time_no_fair = end_time - start_time
    print(f"Status (No Fair): {solution_no_fair.status}, Time: {round(time_no_fair, 3)}s")

    # Kịch bản 2: Có Fairness (trọng số cao)
    problem_with_fair = create_mock_problem()
    problem_with_fair.weight_load_balance = 50.0
    problem_with_fair.weight_preference = 1.0

    start_time = time_bench.time()
    solver_with_fair = SpaSolver(problem_with_fair)
    solution_with_fair = solver_with_fair.solve()
    end_time = time_bench.time()
    time_with_fair = end_time - start_time
    print(f"Status (With High Fair): {solution_with_fair.status}, Time: {round(time_with_fair, 3)}s")

    # Đánh giá
    evaluator = ScheduleEvaluator(None) # Session None works for calculate_jain

    def get_stats(solution):
        workloads = {}
        for a in solution.assignments:
            duration = int((a.end_time - a.start_time).total_seconds() / 60)
            workloads[a.staff_id] = workloads.get(a.staff_id, 0) + duration

        w_list = list(workloads.values())
        jain = evaluator._calculate_jain_index(w_list)
        max_min_diff = max(w_list) - min(w_list) if w_list else 0
        return jain, max_min_diff, w_list

    j1, d1, w1 = get_stats(solution_no_fair)
    j2, d2, w2 = get_stats(solution_with_fair)

    print(f"\n[KỊCH BẢN 1: KHÔNG TỐI ƯU CÔNG BẰNG]")
    print(f"- Giải thích: Workload là tổng số phút phục vụ của mỗi KTV.")
    print(f"- Danh sách Workload (phút): {w1}")
    print(f"- Độ lệch Max-Min: {d1} phút")
    print(f"- Jain's Fairness Index: {j1}")
    print(f"- Thời gian giải: {round(time_no_fair, 3)} giây")

    print(f"\n[KỊCH BẢN 2: CÓ TỐI ƯU CÔNG BẰNG (MIN-MAX)]")
    print(f"- Danh sách Workload (phút): {w2}")
    print(f"- Độ lệch Max-Min: {d2} phút")
    print(f"- Jain's Fairness Index: {j2}")
    print(f"- Thời gian giải: {round(time_with_fair, 3)} giây")

    print("\n[KẾT LUẬN]")
    if time_with_fair < 1.0:
        print(f"==> Hiệu năng: Tốt ({round(time_with_fair, 3)}s), đáp ứng yêu cầu Real-time.")
    else:
        print(f"==> Hiệu năng: Thời gian giải ({round(time_with_fair, 3)}s) tăng đáng kể do quy mô và độ phức tạp (Conflict giữa Preference và Fairness).")
    if j2 > j1:
        print(f"==> Chỉ số Jain tăng từ {j1} lên {j2} ({round((j2-j1)*100, 2)}%)")
        print("==> Kỹ thuật Min-Max tỷ lệ thuận với Chỉ số Jain. Thực nghiệm thành công.")
    else:
        print("==> Kỹ thuật chưa cho thấy sự cải thiện rõ rệt trong kịch bản này.")

if __name__ == "__main__":
    run_experiment()
