"""
Scheduling Engine - Smart Slot Finder

Component tìm kiếm slot khả dụng và tối thiểu hóa hàm mục tiêu đa biến.

CHIẾN LƯỢC: Incremental Optimization
- Với mỗi slot candidate, tính ΔZ (chi phí gia tăng) nếu chọn slot đó
- ΔZ = α·ΔC_fair + β·ΔC_pref + γ·ΔC_idle
- Slot TỐT NHẤT = Slot có ΔZ THẤP NHẤT (tối thiểu hóa hàm mục tiêu)

Đây là Online Approximation của bài toán tối ưu đa biến.
"""
import uuid
from datetime import datetime, time, timedelta, timezone
from typing import TYPE_CHECKING

from .models import SlotOption, StaffSuggestionInfo, ResourceSuggestionInfo

if TYPE_CHECKING:
    from .models import SchedulingProblem


class SlotFinder:
    """
    Tìm kiếm slot khả dụng với thuật toán Incremental Cost Minimization.

    Áp dụng hàm mục tiêu đa biến:
    Z = α·C_fair + β·C_pref + γ·C_idle

    Với mỗi slot, tính ΔZ (incremental cost) và chọn slot có ΔZ thấp nhất.
    """

    # Hệ số phạt cơ sở (Base Penalty Coefficients) - từ algorithm_spec.md
    K_FAIR = 1      # 1 điểm phạt / phút chênh lệch tải
    K_PREF = 10     # 10 điểm phạt / lần sai KTV yêu thích
    K_IDLE = 1      # 1 điểm phạt / phút nhàn rỗi (gap)

    # Trọng số điều chỉnh mặc định (có thể config từ problem)
    DEFAULT_WEIGHT_FAIR = 1.0
    DEFAULT_WEIGHT_PREF = 1.0
    DEFAULT_WEIGHT_IDLE = 1.0

    def __init__(self, problem: "SchedulingProblem"):
        self.problem = problem

        # Lấy trọng số từ problem (nếu có)
        self.weight_fair = getattr(problem, 'weight_load_balance', self.DEFAULT_WEIGHT_FAIR)
        self.weight_pref = getattr(problem, 'weight_preference', self.DEFAULT_WEIGHT_PREF)
        self.weight_idle = getattr(problem, 'weight_utilization', self.DEFAULT_WEIGHT_IDLE)

        # Pre-compute workload hiện tại của mỗi staff
        self.staff_current_workload = self._compute_current_workloads()

        # Pre-compute last_end_time của mỗi staff (để tính gap)
        self.staff_last_end_time = self._compute_last_end_times()

        # Cache staff working times
        self.staff_working_times = self._compute_staff_working_times()

        # Tính toán các thống kê cần thiết
        self._compute_workload_stats()

    def _compute_current_workloads(self) -> dict[uuid.UUID, int]:
        """Tính tổng workload hiện tại của mỗi staff (phút)."""
        workloads: dict[uuid.UUID, int] = {s.id: 0 for s in self.problem.available_staff}

        for ea in self.problem.existing_assignments:
            if ea.staff_id and ea.staff_id in workloads:
                duration = int((ea.end_time - ea.start_time).total_seconds() / 60)
                workloads[ea.staff_id] += duration

        return workloads

    def _compute_last_end_times(self) -> dict[uuid.UUID, datetime | None]:
        """Tìm thời điểm kết thúc cuối cùng của mỗi staff."""
        last_times: dict[uuid.UUID, datetime | None] = {s.id: None for s in self.problem.available_staff}

        for ea in self.problem.existing_assignments:
            if ea.staff_id and ea.staff_id in last_times:
                current_last = last_times[ea.staff_id]
                if current_last is None or ea.end_time > current_last:
                    last_times[ea.staff_id] = ea.end_time

        return last_times

    def _compute_staff_working_times(self) -> dict[uuid.UUID, list[tuple[time, time]]]:
        """Tính khung giờ làm việc của từng staff."""
        result: dict[uuid.UUID, list[tuple[time, time]]] = {}
        for schedule in self.problem.staff_schedules:
            if schedule.staff_id not in result:
                result[schedule.staff_id] = []
            result[schedule.staff_id].append((schedule.start_time, schedule.end_time))
        return result

    def _compute_workload_stats(self) -> None:
        """Tính các thống kê workload để tính ΔC_fair."""
        workloads = list(self.staff_current_workload.values())
        if workloads:
            self.current_max_load = max(workloads)
            self.current_min_load = min(workloads)
            self.current_deviation = self.current_max_load - self.current_min_load
        else:
            self.current_max_load = 0
            self.current_min_load = 0
            self.current_deviation = 0

    def _is_staff_available(self, staff_id: uuid.UUID, start: datetime, end: datetime) -> bool:
        """Kiểm tra staff có trong ca làm việc không."""
        if staff_id not in self.staff_working_times:
            return False

        start_time = start.time()
        end_time = end.time()

        for work_start, work_end in self.staff_working_times[staff_id]:
            if work_start <= start_time and end_time <= work_end:
                return True
        return False

    def _has_staff_conflict(self, staff_id: uuid.UUID, start: datetime, end: datetime) -> bool:
        """Kiểm tra staff có bị trùng lịch không."""
        buffer = timedelta(minutes=self.problem.transition_time_minutes)
        s_with_buffer = start - buffer
        e_with_buffer = end + buffer

        for ea in self.problem.existing_assignments:
            if ea.staff_id == staff_id:
                if ea.start_time < e_with_buffer and s_with_buffer < ea.end_time:
                    return True
        return False

    def _has_resource_conflict(self, resource_id: uuid.UUID, start: datetime, end: datetime) -> bool:
        """Kiểm tra resource có bị trùng không."""
        buffer = timedelta(minutes=self.problem.transition_time_minutes)
        s_with_buffer = start - buffer
        e_with_buffer = end + buffer

        for ea in self.problem.existing_assignments:
            if ea.resource_id == resource_id:
                if ea.start_time < e_with_buffer and s_with_buffer < ea.end_time:
                    return True
        return False

    def find_top_slots(
        self,
        duration: int,
        required_skill_ids: list[uuid.UUID],
        required_resource_group_id: uuid.UUID | None = None,
        preferred_staff_id: uuid.UUID | None = None,
        search_start: time = time(8, 0),
        search_end: time = time(21, 0),
        increment_minutes: int = 15,
        top_k: int = 5
    ) -> list[SlotOption]:
        """
        Tìm TOP K slot có chi phí gia tăng (ΔZ) thấp nhất.

        Thuật toán Incremental Cost Minimization:
        1. Duyệt tất cả khung giờ khả thi
        2. Với mỗi slot, tính ΔZ = incremental cost nếu chọn slot đó
        3. Sắp xếp theo ΔZ TĂNG DẦN (thấp = tốt)
        4. Trả về TOP K

        Độ phức tạp: O(slots × staff × resources)
        Thời gian thực tế: < 100ms
        """
        target_date = self.problem.target_date
        increment = timedelta(minutes=increment_minutes)
        current_dt = datetime.combine(target_date, search_start, tzinfo=timezone.utc)
        end_dt = datetime.combine(target_date, search_end, tzinfo=timezone.utc)

        all_options: list[SlotOption] = []

        while current_dt + timedelta(minutes=duration) <= end_dt:
            slot_start = current_dt
            slot_end = current_dt + timedelta(minutes=duration)

            for staff_data in self.problem.available_staff:
                # Check 1: Skill Match
                if required_skill_ids:
                    if not all(sk in staff_data.skill_ids for sk in required_skill_ids):
                        continue

                # Check 2: Working Hours
                if not self._is_staff_available(staff_data.id, slot_start, slot_end):
                    continue

                # Check 3: No Overlap
                if self._has_staff_conflict(staff_data.id, slot_start, slot_end):
                    continue

                # Check 4: Resource (nếu cần)
                assigned_resources: list[ResourceSuggestionInfo] = []
                if required_resource_group_id:
                    for res in self.problem.available_resources:
                        if res.group_id == required_resource_group_id:
                            if not self._has_resource_conflict(res.id, slot_start, slot_end):
                                assigned_resources.append(ResourceSuggestionInfo(
                                    id=res.id,
                                    name=res.name,
                                    group_name=res.group_name
                                ))
                                break
                    if not assigned_resources:
                        continue

                # Tính chi phí gia tăng ΔZ
                delta_z = self._calculate_incremental_cost(
                    slot_start=slot_start,
                    slot_end=slot_end,
                    staff_id=staff_data.id,
                    preferred_staff_id=preferred_staff_id,
                    duration=duration
                )

                # Chuyển đổi: ΔZ thấp = score cao (để UI hiển thị dễ hiểu hơn)
                # Score = MAX_SCORE - ΔZ
                MAX_SCORE = 1000
                score = max(0, MAX_SCORE - int(delta_z))

                all_options.append(SlotOption(
                    start_time=slot_start,
                    end_time=slot_end,
                    staff=StaffSuggestionInfo(
                        id=staff_data.id,
                        name=staff_data.name,
                        is_preferred=(staff_data.id == preferred_staff_id)
                    ),
                    resources=assigned_resources,
                    score=score
                ))

            current_dt += increment

        # Sắp xếp theo score GIẢM DẦN (= ΔZ tăng dần = tốt nhất đầu tiên)
        all_options.sort(key=lambda x: x.score, reverse=True)
        return all_options[:top_k]

    def _calculate_incremental_cost(
        self,
        slot_start: datetime,
        slot_end: datetime,
        staff_id: uuid.UUID,
        preferred_staff_id: uuid.UUID | None,
        duration: int
    ) -> float:
        """
        Tính chi phí gia tăng (ΔZ) nếu booking mới được gán cho staff này.

        Công thức:
        ΔZ = α·K_fair·ΔC_fair + β·K_pref·ΔC_pref + γ·K_idle·ΔC_idle

        Trong đó:
        - ΔC_fair: Thay đổi độ lệch Max-Min sau khi gán
        - ΔC_pref: Chi phí vi phạm sở thích (0 hoặc 1)
        - ΔC_idle: Gap time được tạo ra

        Returns:
            float: Chi phí gia tăng (càng thấp càng tốt)
        """
        # ================================================================
        # 1. ΔC_fair: Thay đổi độ lệch tải
        # ================================================================
        current_workload = self.staff_current_workload.get(staff_id, 0)
        new_workload = current_workload + duration

        # Tính Max-Min mới sau khi gán
        new_max = max(self.current_max_load, new_workload)
        # Min có thể không đổi vì chỉ có 1 staff tăng
        new_min = self.current_min_load
        new_deviation = new_max - new_min

        # ΔC_fair = New Deviation - Current Deviation
        delta_c_fair = new_deviation - self.current_deviation

        # ================================================================
        # 2. ΔC_pref: Vi phạm sở thích
        # ================================================================
        delta_c_pref = 0
        if preferred_staff_id:
            if staff_id != preferred_staff_id:
                delta_c_pref = 1  # Vi phạm 1 lần

        # ================================================================
        # 3. ΔC_idle: Gap time (thời gian nhàn rỗi)
        # ================================================================
        delta_c_idle = 0
        last_end = self.staff_last_end_time.get(staff_id)

        if last_end:
            gap_minutes = (slot_start - last_end).total_seconds() / 60
            if gap_minutes > 0:
                # Gap > 0 → tạo thêm idle time
                delta_c_idle = gap_minutes
            # Nếu gap <= 0 thì slot liền kề hoặc trước → không tạo idle mới

        # ================================================================
        # Tổng hợp: ΔZ = Σ (weight × K × ΔC)
        # ================================================================
        delta_z = (
            self.weight_fair * self.K_FAIR * delta_c_fair +
            self.weight_pref * self.K_PREF * delta_c_pref +
            self.weight_idle * self.K_IDLE * delta_c_idle
        )

        return delta_z

    # Backward compatibility
    def find_slots(
        self,
        duration: int,
        required_skill_ids: list[uuid.UUID],
        required_resource_group_id: uuid.UUID | None = None,
        preferred_staff_id: uuid.UUID | None = None,
        search_start: time = time(8, 0),
        search_end: time = time(21, 0),
        increment_minutes: int = 15
    ) -> list[SlotOption]:
        """Backward compatibility - gọi find_top_slots với top_k=20."""
        return self.find_top_slots(
            duration=duration,
            required_skill_ids=required_skill_ids,
            required_resource_group_id=required_resource_group_id,
            preferred_staff_id=preferred_staff_id,
            search_start=search_start,
            search_end=search_end,
            increment_minutes=increment_minutes,
            top_k=20
        )
