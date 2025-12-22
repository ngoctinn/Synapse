"""
Scheduling Engine - Flexible Time Solver

Bộ giải OR-Tools CP-SAT cho bài toán tìm slot tối ưu.
THỰC SỰ sử dụng CP-SAT để minimize hàm mục tiêu Z.

Hàm mục tiêu:
Z = α·C_fair + β·C_pref + γ·C_idle

Sử dụng: Khi khách hàng tìm slot đặt lịch.
"""

import uuid
from datetime import datetime, date, time, timedelta, timezone
from ortools.sat.python import cp_model

from .models import (
    SchedulingProblem,
    SlotOption,
    StaffSuggestionInfo,
    ResourceSuggestionInfo,
    StaffData,
)


class FlexibleTimeSolver:
    """
    Bộ giải CP-SAT tìm slot tối ưu với thời gian linh hoạt.

    SỬ DỤNG OR-Tools CP-SAT để:
    1. Xây dựng mô hình với biến quyết định x[slot, staff]
    2. Thêm ràng buộc: Chọn đúng 1 (slot, staff)
    3. Định nghĩa hàm mục tiêu Z = α·C_fair + β·C_pref + γ·C_idle
    4. Giải bằng CP-SAT solver
    5. Tìm TOP K nghiệm tốt nhất
    """

    # Hệ số phạt cơ sở
    K_FAIR = 1      # 1 điểm / phút chênh lệch
    K_PREF = 100    # 100 điểm / lần sai KTV (tăng để rõ hơn)
    K_IDLE = 1      # 1 điểm / phút gap

    def __init__(self, problem: SchedulingProblem):
        self.problem = problem

        # Trọng số từ problem
        self.weight_fair = problem.weight_load_balance
        self.weight_pref = problem.weight_preference
        self.weight_idle = problem.weight_utilization

        # Tính workload hiện tại
        self.staff_workloads = self._compute_workloads()
        self.staff_last_end = self._compute_last_end_times()
        self.staff_working_times = self._compute_working_times()

    def _compute_workloads(self) -> dict[uuid.UUID, int]:
        """Tính workload hiện tại của mỗi staff (phút)."""
        workloads = {s.id: 0 for s in self.problem.available_staff}
        for ea in self.problem.existing_assignments:
            if ea.staff_id in workloads:
                duration = int((ea.end_time - ea.start_time).total_seconds() / 60)
                workloads[ea.staff_id] += duration
        return workloads

    def _compute_last_end_times(self) -> dict[uuid.UUID, int | None]:
        """Tính last_end của mỗi staff (phút từ đầu ngày)."""
        last_times: dict[uuid.UUID, int | None] = {s.id: None for s in self.problem.available_staff}
        for ea in self.problem.existing_assignments:
            if ea.staff_id in last_times:
                end_minutes = ea.end_time.hour * 60 + ea.end_time.minute
                if last_times[ea.staff_id] is None or end_minutes > last_times[ea.staff_id]:
                    last_times[ea.staff_id] = end_minutes
        return last_times

    def _compute_working_times(self) -> dict[uuid.UUID, list[tuple[int, int]]]:
        """Tính khung giờ làm việc (phút từ đầu ngày)."""
        result: dict[uuid.UUID, list[tuple[int, int]]] = {}
        for schedule in self.problem.staff_schedules:
            if schedule.staff_id not in result:
                result[schedule.staff_id] = []
            start_min = schedule.start_time.hour * 60 + schedule.start_time.minute
            end_min = schedule.end_time.hour * 60 + schedule.end_time.minute
            result[schedule.staff_id].append((start_min, end_min))
        return result

    def _is_staff_in_shift(self, staff_id: uuid.UUID, start_min: int, end_min: int) -> bool:
        """Kiểm tra staff có trong ca làm việc không."""
        if staff_id not in self.staff_working_times:
            return False
        for shift_start, shift_end in self.staff_working_times[staff_id]:
            if shift_start <= start_min and end_min <= shift_end:
                return True
        return False

    def _has_conflict(self, staff_id: uuid.UUID, start_min: int, end_min: int) -> bool:
        """Kiểm tra staff có conflict không."""
        buffer = self.problem.transition_time_minutes
        for ea in self.problem.existing_assignments:
            if ea.staff_id == staff_id:
                ea_start = ea.start_time.hour * 60 + ea.start_time.minute
                ea_end = ea.end_time.hour * 60 + ea.end_time.minute
                if ea_start - buffer < end_min and start_min < ea_end + buffer:
                    return True
        return False

    def _has_resource_conflict(self, resource_id: uuid.UUID, start_min: int, end_min: int) -> bool:
        """Kiểm tra resource có conflict không."""
        buffer = self.problem.transition_time_minutes
        for ea in self.problem.existing_assignments:
            if ea.resource_id == resource_id:
                ea_start = ea.start_time.hour * 60 + ea.start_time.minute
                ea_end = ea.end_time.hour * 60 + ea.end_time.minute
                if ea_start - buffer < end_min and start_min < ea_end + buffer:
                    return True
        return False

    def _find_available_resource(
        self,
        resource_group_id: uuid.UUID,
        start_min: int,
        end_min: int
    ) -> "ResourceSuggestionInfo | None":
        """Tìm resource khả dụng trong một group."""
        from .models import ResourceData

        for resource in self.problem.available_resources:
            if resource.group_id == resource_group_id:
                if not self._has_resource_conflict(resource.id, start_min, end_min):
                    return ResourceSuggestionInfo(
                        id=resource.id,
                        name=resource.name,
                        group_name=resource.group_name
                    )
        return None

    def _find_available_resources_for_groups(
        self,
        group_ids: list[uuid.UUID],
        start_min: int,
        end_min: int
    ) -> list["ResourceSuggestionInfo"] | None:
        """
        Tìm resources khả dụng cho TẤT CẢ các groups.
        Trả về None nếu không tìm được đủ resources.
        """
        if not group_ids:
            return []

        result: list[ResourceSuggestionInfo] = []
        used_resource_ids: set[uuid.UUID] = set()

        for group_id in group_ids:
            found = False
            for resource in self.problem.available_resources:
                if resource.group_id == group_id and resource.id not in used_resource_ids:
                    if not self._has_resource_conflict(resource.id, start_min, end_min):
                        result.append(ResourceSuggestionInfo(
                            id=resource.id,
                            name=resource.name,
                            group_name=resource.group_name
                        ))
                        used_resource_ids.add(resource.id)
                        found = True
                        break
            if not found:
                return None  # Không tìm được resource cho group này

        return result

    def find_optimal_slots(
        self,
        duration_minutes: int,
        required_skill_ids: list[uuid.UUID] = [],
        required_resource_group_ids: list[uuid.UUID] = [],
        preferred_staff_id: uuid.UUID | None = None,
        search_start: time = time(8, 0),
        search_end: time = time(21, 0),
        slot_increment: int = 15,
        top_k: int = 5,
        time_limit_seconds: int = 5
    ) -> list[SlotOption]:
        """
        Tìm TOP K slot tối ưu sử dụng OR-Tools CP-SAT.

        Thuật toán:
        1. Tạo biến x[slot, staff] cho mỗi (slot, staff) khả thi
        2. Ràng buộc: AddExactlyOne - Chọn đúng 1 (slot, staff)
        3. Hàm mục tiêu CP-SAT: Minimize Z
        4. Giải và thu thập TOP K nghiệm
        """
        target_date = self.problem.target_date

        # Tạo danh sách time slots
        start_min = search_start.hour * 60 + search_start.minute
        end_min = search_end.hour * 60 + search_end.minute

        time_slots: list[int] = []
        current = start_min
        while current + duration_minutes <= end_min:
            time_slots.append(current)
            current += slot_increment

        if not time_slots:
            return []

        # Lọc staff đủ điều kiện
        qualified_staff: list[StaffData] = []
        for staff in self.problem.available_staff:
            if required_skill_ids:
                if not all(sk in staff.skill_ids for sk in required_skill_ids):
                    continue
            qualified_staff.append(staff)

        if not qualified_staff:
            return []

        # Tính workload stats
        all_workloads = list(self.staff_workloads.values())
        current_max = max(all_workloads) if all_workloads else 0
        current_min = min(all_workloads) if all_workloads else 0

        # ================================================================
        # XÂY DỰNG MÔ HÌNH CP-SAT
        # ================================================================
        model = cp_model.CpModel()

        # Biến quyết định: x[slot_idx, staff_idx] = 1 nếu chọn
        assignment_vars: dict[tuple[int, int], cp_model.IntVar] = {}
        # Lưu thông tin cho từng biến: (slot_min, staff, cost, resources)
        var_info: dict[tuple[int, int], tuple[int, StaffData, int, list["ResourceSuggestionInfo"]]] = {}

        SCALE = 100  # Scale cho weights

        for slot_idx, slot_min in enumerate(time_slots):
            slot_end_min = slot_min + duration_minutes

            for staff_idx, staff in enumerate(qualified_staff):
                # Kiểm tra constraints cứng
                if not self._is_staff_in_shift(staff.id, slot_min, slot_end_min):
                    continue
                if self._has_conflict(staff.id, slot_min, slot_end_min):
                    continue

                # Kiểm tra và tìm resources khả dụng cho TẤT CẢ các groups yêu cầu
                assigned_resources: list[ResourceSuggestionInfo] = []
                if required_resource_group_ids:
                    found_resources = self._find_available_resources_for_groups(
                        required_resource_group_ids, slot_min, slot_end_min
                    )
                    if found_resources is None:
                        continue  # Không tìm đủ resources → bỏ qua slot này
                    assigned_resources = found_resources

                # Tạo biến boolean
                var = model.NewBoolVar(f"x_{slot_idx}_{staff_idx}")
                assignment_vars[(slot_idx, staff_idx)] = var

                # Tính cost cho biến này (để dùng trong objective)
                current_workload = self.staff_workloads.get(staff.id, 0)
                new_workload = current_workload + duration_minutes
                new_max = max(current_max, new_workload)
                delta_c_fair = (new_max - current_min) - (current_max - current_min)

                delta_c_pref = 0
                if preferred_staff_id and staff.id != preferred_staff_id:
                    delta_c_pref = 1

                delta_c_idle = 0
                last_end = self.staff_last_end.get(staff.id)
                if last_end is not None:
                    gap = slot_min - last_end
                    if gap > 0:
                        delta_c_idle = gap

                # Cost cho biến này
                cost = int(
                    self.weight_fair * SCALE * self.K_FAIR * delta_c_fair +
                    self.weight_pref * SCALE * self.K_PREF * delta_c_pref +
                    self.weight_idle * SCALE * self.K_IDLE * delta_c_idle
                )

                var_info[(slot_idx, staff_idx)] = (slot_min, staff, cost, assigned_resources)

        if not assignment_vars:
            return []

        # ================================================================
        # RÀNG BUỘC: Chọn đúng 1 (slot, staff)
        # ================================================================
        model.AddExactlyOne(assignment_vars.values())

        # ================================================================
        # HÀM MỤC TIÊU: Minimize Z = Σ (cost[i] * x[i])
        # ================================================================
        objective_terms = []
        for (slot_idx, staff_idx), var in assignment_vars.items():
            _, _, cost, _ = var_info[(slot_idx, staff_idx)]
            objective_terms.append(cost * var)

        model.Minimize(sum(objective_terms))

        # ================================================================
        # GIẢI BẰNG CP-SAT VÀ TÌM TOP K
        # ================================================================
        results: list[SlotOption] = []

        # Tìm nghiệm tốt nhất trước
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = time_limit_seconds
        solver.parameters.num_search_workers = 4

        status = solver.Solve(model)

        if status not in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
            return []

        # Lấy nghiệm tốt nhất
        best_obj = solver.ObjectiveValue()

        for (slot_idx, staff_idx), var in assignment_vars.items():
            if solver.Value(var) == 1:
                slot_min, staff, cost, assigned_resources = var_info[(slot_idx, staff_idx)]

                start_dt = datetime.combine(
                    target_date,
                    time(slot_min // 60, slot_min % 60),
                    tzinfo=timezone.utc
                )
                end_dt = start_dt + timedelta(minutes=duration_minutes)

                results.append(SlotOption(
                    start_time=start_dt,
                    end_time=end_dt,
                    staff=StaffSuggestionInfo(
                        id=staff.id,
                        name=staff.name,
                        is_preferred=(staff.id == preferred_staff_id)
                    ),
                    resources=assigned_resources,  # Đã là list
                    score=int(1000 - cost / SCALE)
                ))
                break

        # Tìm thêm K-1 nghiệm bằng cách loại bỏ nghiệm trước
        for _ in range(top_k - 1):
            if not results:
                break

            # Thêm constraint loại bỏ nghiệm vừa tìm
            last_result = results[-1]
            for (slot_idx, staff_idx), var in assignment_vars.items():
                slot_min, staff, _, _ = var_info[(slot_idx, staff_idx)]
                if (slot_min // 60 == last_result.start_time.hour and
                    slot_min % 60 == last_result.start_time.minute and
                    staff.id == last_result.staff.id):
                    model.Add(var == 0)
                    break

            # Giải lại
            status = solver.Solve(model)
            if status not in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
                break

            # Lấy nghiệm mới
            for (slot_idx, staff_idx), var in assignment_vars.items():
                if solver.Value(var) == 1:
                    slot_min, staff, cost, assigned_resources = var_info[(slot_idx, staff_idx)]

                    start_dt = datetime.combine(
                        target_date,
                        time(slot_min // 60, slot_min % 60),
                        tzinfo=timezone.utc
                    )
                    end_dt = start_dt + timedelta(minutes=duration_minutes)

                    results.append(SlotOption(
                        start_time=start_dt,
                        end_time=end_dt,
                        staff=StaffSuggestionInfo(
                            id=staff.id,
                            name=staff.name,
                            is_preferred=(staff.id == preferred_staff_id)
                        ),
                        resources=assigned_resources,  # Đã là list
                        score=int(1000 - cost / SCALE)
                    ))
                    break


        return results
