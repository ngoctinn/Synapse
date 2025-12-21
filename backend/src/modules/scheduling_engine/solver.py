"""
Scheduling Module - CP-SAT Solver

CORE: Bộ giải tối ưu hóa sử dụng Google OR-Tools CP-SAT

Mô hình hóa bài toán RCPSP (Resource-Constrained Project Scheduling Problem)
cho nghiệp vụ Spa - gán KTV và Phòng cho booking items.
"""

import uuid
import time as time_module
from datetime import datetime, time
from ortools.sat.python import cp_model

from .models import (
    SchedulingProblem,
    SchedulingSolution,
    Assignment,
    SolutionMetrics,
    SolveStatus,
    BookingItemData,
    StaffData,
    ResourceData,
)


class SpaSolver:
    """
    Bộ giải lập lịch cho Spa sử dụng CP-SAT.

    Mô hình:
    - Biến: x[item, staff, resource] = 1 nếu item được gán cho (staff, resource)
    - Ràng buộc cứng:
        1. Mỗi item được gán cho đúng 1 cặp (staff, resource)
        2. Staff không overlap (AddNoOverlap)
        3. Resource không overlap (AddNoOverlap)
        4. Skill matching: Staff phải có skill cần thiết
        5. Resource matching: Resource thuộc group cần thiết
        6. Schedule bound: Staff phải trong ca làm việc
    - Hàm mục tiêu: Minimize penalty
    """

    def __init__(self, problem: SchedulingProblem):
        self.problem = problem
        self.model = cp_model.CpModel()

        # Mapping để tiện truy cập
        self.staff_by_id = {s.id: s for s in problem.available_staff}
        self.resource_by_id = {r.id: r for r in problem.available_resources}

        # Tính toán staff schedules dạng dict
        self.staff_working_times = self._compute_staff_working_times()

        # Variables
        self.assignment_vars: dict[tuple[uuid.UUID, uuid.UUID, uuid.UUID | None], cp_model.IntVar] = {}
        self.interval_vars: dict[tuple[uuid.UUID, uuid.UUID], cp_model.IntervalVar] = {}
        self.staff_intervals: dict[uuid.UUID, list[cp_model.IntervalVar]] = {}
        self.resource_intervals: dict[uuid.UUID, list[cp_model.IntervalVar]] = {}

    def _compute_staff_working_times(self) -> dict[uuid.UUID, list[tuple[time, time]]]:
        """Tính toán khung giờ làm việc của từng staff."""
        result: dict[uuid.UUID, list[tuple[time, time]]] = {}
        for schedule in self.problem.staff_schedules:
            if schedule.staff_id not in result:
                result[schedule.staff_id] = []
            result[schedule.staff_id].append((schedule.start_time, schedule.end_time))
        return result

    def _is_staff_available(
        self, staff_id: uuid.UUID, start: datetime, end: datetime
    ) -> bool:
        """Kiểm tra staff có làm việc trong khoảng thời gian này không."""
        if staff_id not in self.staff_working_times:
            return False

        start_time = start.time()
        end_time = end.time()

        for work_start, work_end in self.staff_working_times[staff_id]:
            if work_start <= start_time and end_time <= work_end:
                return True
        return False

    def _get_qualified_staff(self, item: BookingItemData) -> list[StaffData]:
        """Lấy danh sách KTV đủ điều kiện cho item."""
        qualified = []

        for staff in self.problem.available_staff:
            # Check 1: Staff có làm việc trong khung giờ này?
            if not self._is_staff_available(staff.id, item.start_time, item.end_time):
                continue

            # Check 2: Staff có đủ skills?
            if item.required_skill_ids:
                if not all(skill in staff.skill_ids for skill in item.required_skill_ids):
                    continue

            # Check 3: Staff không bị conflict với existing assignments
            if self._has_staff_conflict(staff.id, item.start_time, item.end_time):
                continue

            qualified.append(staff)

        return qualified

    def _get_qualified_resources(self, item: BookingItemData) -> list[ResourceData]:
        """Lấy danh sách Resources đủ điều kiện cho item."""
        if not item.required_resource_group_ids:
            return []  # Không yêu cầu resource

        qualified = []
        for resource in self.problem.available_resources:
            # Check 1: Resource thuộc group được yêu cầu?
            if resource.group_id not in item.required_resource_group_ids:
                continue

            # Check 2: Resource không bị conflict
            if self._has_resource_conflict(resource.id, item.start_time, item.end_time):
                continue

            qualified.append(resource)

        return qualified

    def _has_staff_conflict(
        self, staff_id: uuid.UUID, start: datetime, end: datetime
    ) -> bool:
        """Kiểm tra staff có bị conflict với existing assignments không (có tính transition time)."""
        buffer = timedelta(minutes=self.problem.transition_time_minutes)
        s_with_buffer = start - buffer
        e_with_buffer = end + buffer

        for ea in self.problem.existing_assignments:
            if ea.staff_id == staff_id:
                # Giao nhau: (s1 < e2) and (s2 < e1)
                if ea.start_time < e_with_buffer and s_with_buffer < ea.end_time:
                    return True
        return False

    def _has_resource_conflict(
        self, resource_id: uuid.UUID, start: datetime, end: datetime
    ) -> bool:
        """Kiểm tra resource có bị conflict không (có tính transition time)."""
        buffer = timedelta(minutes=self.problem.transition_time_minutes)
        s_with_buffer = start - buffer
        e_with_buffer = end + buffer

        for ea in self.problem.existing_assignments:
            if ea.resource_id == resource_id:
                if ea.start_time < e_with_buffer and s_with_buffer < ea.end_time:
                    return True
        return False

    def _time_to_minutes(self, dt: datetime) -> int:
        """Chuyển datetime sang số phút từ đầu ngày."""
        return dt.hour * 60 + dt.minute

    def build_model(self) -> bool:
        """
        Xây dựng mô hình CP-SAT.

        Returns:
            True nếu mô hình khả thi, False nếu không có nghiệm
        """
        # Khởi tạo containers
        for staff in self.problem.available_staff:
            self.staff_intervals[staff.id] = []
        for resource in self.problem.available_resources:
            self.resource_intervals[resource.id] = []

        # Với mỗi item
        for item in self.problem.unassigned_items:
            qualified_staff = self._get_qualified_staff(item)
            qualified_resources = self._get_qualified_resources(item)

            if not qualified_staff:
                # Không có KTV nào phù hợp → Infeasible
                return False

            # Nếu service không yêu cầu resource, tạo dummy
            if not qualified_resources:
                qualified_resources = [None]  # type: ignore

            item_assignment_vars = []

            for staff in qualified_staff:
                for resource in qualified_resources:
                    resource_id = resource.id if resource else None

                    # Biến boolean: item được gán cho (staff, resource) này?
                    var_name = f"assign_{item.id}_{staff.id}_{resource_id}"
                    is_assigned = self.model.NewBoolVar(var_name)
                    self.assignment_vars[(item.id, staff.id, resource_id)] = is_assigned
                    item_assignment_vars.append(is_assigned)

                    # Tạo interval variable (optional)
                    start_minutes = self._time_to_minutes(item.start_time)
                    duration = item.duration_minutes

                    # Đảm bảo interval có tính transition time
                    # Trong model CP-SAT, chúng ta tạo interval từ (start, duration + transition)
                    # Tuy nhiên do item.start/end là cố định, ta đơn giản là tạo interval rộng hơn
                    extended_duration = item.duration_minutes + self.problem.transition_time_minutes

                    # Create optional intervals for staff and resource
                    staff_interval = self.model.NewOptionalFixedSizeIntervalVar(
                        start_minutes, extended_duration, is_assigned,
                        f"interval_staff_{item.id}_{staff.id}_{resource_id}"
                    )
                    self.staff_intervals[staff.id].append(staff_interval)

                    if resource:
                        resource_interval = self.model.NewOptionalFixedSizeIntervalVar(
                            start_minutes, extended_duration, is_assigned,
                            f"interval_resource_{item.id}_{staff.id}_{resource_id}"
                        )
                        self.resource_intervals[resource.id].append(resource_interval)


            # Ràng buộc: Mỗi item được gán cho đúng 1 cặp (staff, resource)
            self.model.AddExactlyOne(item_assignment_vars)

        # Ràng buộc: NoOverlap cho mỗi staff
        for staff_id, intervals in self.staff_intervals.items():
            if len(intervals) > 1:
                self.model.AddNoOverlap(intervals)

        # Ràng buộc: NoOverlap cho mỗi resource
        for resource_id, intervals in self.resource_intervals.items():
            if len(intervals) > 1:
                self.model.AddNoOverlap(intervals)

        # Ràng buộc: NoOverlap cho mỗi resource
        for resource_id, intervals in self.resource_intervals.items():
            if len(intervals) > 1:
                self.model.AddNoOverlap(intervals)

        # ====================================================================
        # OBJECTIVE FUNCTION
        # ====================================================================

        # Scaling factor for float weights (since CP-SAT requires int)
        SCALE = 100
        w_pref = int(getattr(self.problem, "weight_preference", 1.0) * SCALE)
        w_util = int(getattr(self.problem, "weight_utilization", 1.0) * SCALE)
        w_balance = int(getattr(self.problem, "weight_load_balance", 1.0) * SCALE)
        w_perturb = int(getattr(self.problem, "weight_perturbation", 1.0) * SCALE)

        objective_terms = []

        # 1. Preference Penalty
        # --------------------------------------------------------
        for item in self.problem.unassigned_items:
            for (item_id, staff_id, resource_id), var in self.assignment_vars.items():
                if item_id != item.id:
                    continue

                # Preference penalty: +10 (base) * weight
                if item.preferred_staff_id and staff_id != item.preferred_staff_id:
                    objective_terms.append(10 * w_pref * var)

        # Staff load vars (dùng cho cả Load Balancing và Utilization)
        staff_loads = []
        for staff in self.problem.available_staff:
            staff_vars = []
            staff_durations = []

            for (item_id, s_id, r_id), var in self.assignment_vars.items():
                if s_id == staff.id:
                    item = next(i for i in self.problem.unassigned_items if i.id == item_id)
                    staff_vars.append(var)
                    staff_durations.append(item.duration_minutes)

            if staff_vars:
                load_var = self.model.NewIntVar(0, 1440, f"load_{staff.id}")
                self.model.Add(load_var == sum(v * d for v, d in zip(staff_vars, staff_durations)))
                staff_loads.append(load_var)
            else:
                zero = self.model.NewConstant(0)
                staff_loads.append(zero)

        # 2. Load Balancing: Minimize (MaxLoad - MinLoad)
        # --------------------------------------------------------
        # Mục tiêu: Phân bổ workload đều giữa các KTV
        if staff_loads and w_balance > 0:
            max_load = self.model.NewIntVar(0, 1440, "max_load")
            min_load = self.model.NewIntVar(0, 1440, "min_load")

            self.model.AddMaxEquality(max_load, staff_loads)
            self.model.AddMinEquality(min_load, staff_loads)

            # Penalty = (max - min) * weight
            objective_terms.append((max_load - min_load) * w_balance)


        # 3. Gap Minimization (Utilization)
        # --------------------------------------------------------
        # Minimize (Span - TotalLoad) for each staff
        # Span = MaxEnd - MinStart

        if w_util > 0:
            for i, staff in enumerate(self.problem.available_staff):
                msg_prefix = f"staff_{staff.id}"
                min_start = self.model.NewIntVar(0, 1440, f"{msg_prefix}_min_start")
                max_end = self.model.NewIntVar(0, 1440, f"{msg_prefix}_max_end")

                # Default for unassigned: min_start=max_end (span=0)
                # We enforce min_start <= max_end
                self.model.Add(min_start <= max_end)

                has_any_assignment = False

                for (item_id, s_id, r_id), var in self.assignment_vars.items():
                    if s_id == staff.id:
                        item = next(it for it in self.problem.unassigned_items if it.id == item_id)
                        start_mins = self._time_to_minutes(item.start_time)
                        end_mins = start_mins + item.duration_minutes

                        # Constraints implications
                        # If assigned: min_start <= start, max_end >= end
                        self.model.Add(min_start <= start_mins).OnlyEnforceIf(var)
                        self.model.Add(max_end >= end_mins).OnlyEnforceIf(var)
                        has_any_assignment = True

                if has_any_assignment:
                    span = max_end - min_start
                    load = staff_loads[i] # Correspond to the index in available_staff

                    # Gap = Span - Load
                    # Objective: Minimize Gap * weight
                    # Gap >= 0 is implicitly true if constraints correct
                    objective_terms.append((span - load) * w_util)

        # 4. Stability: Minimize Perturbation (C_perturb)
        # --------------------------------------------------------
        # Phát nếu gán KTV khác với gán hiện tại (chỉ áp dụng khi có current_staff_id)
        for item in self.problem.unassigned_items:
            if item.current_staff_id:
                for (item_id, staff_id, resource_id), var in self.assignment_vars.items():
                    if item_id == item.id:
                        # Nếu gán cho KTV KHÁC với KTV cũ -> Penalty
                        if staff_id != item.current_staff_id:
                            # C_perturb: phạt xáo trộn
                            objective_terms.append(20 * w_perturb * var)

        if objective_terms:
            self.model.Minimize(sum(objective_terms))

        return True

    def solve(self, time_limit_seconds: int = 30) -> SchedulingSolution:
        """
        Giải bài toán lập lịch.

        Args:
            time_limit_seconds: Giới hạn thời gian (giây)

        Returns:
            SchedulingSolution với assignments và metrics
        """
        start_time = time_module.time()

        # Build model
        if not self.build_model():
            return SchedulingSolution(
                status=SolveStatus.INFEASIBLE,
                message="Không có KTV phù hợp cho một hoặc nhiều dịch vụ"
            )

        # Solve
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = time_limit_seconds
        solver.parameters.num_search_workers = 4  # Parallel search

        status = solver.Solve(self.model)
        solve_time_ms = int((time_module.time() - start_time) * 1000)

        # Map OR-Tools status to our status
        status_map = {
            cp_model.OPTIMAL: SolveStatus.OPTIMAL,
            cp_model.FEASIBLE: SolveStatus.FEASIBLE,
            cp_model.INFEASIBLE: SolveStatus.INFEASIBLE,
            cp_model.MODEL_INVALID: SolveStatus.ERROR,
            cp_model.UNKNOWN: SolveStatus.TIMEOUT,
        }
        solve_status = status_map.get(status, SolveStatus.ERROR)

        if solve_status in [SolveStatus.OPTIMAL, SolveStatus.FEASIBLE]:
            assignments = self._extract_assignments(solver)
            metrics = self._calculate_metrics(assignments)

            return SchedulingSolution(
                status=solve_status,
                assignments=assignments,
                objective_value=solver.ObjectiveValue() if self.model.HasObjective() else 0,
                solve_time_ms=solve_time_ms,
                metrics=metrics,
                message="Tìm được lịch tối ưu" if solve_status == SolveStatus.OPTIMAL else "Tìm được lịch khả thi"
            )
        else:
            return SchedulingSolution(
                status=solve_status,
                solve_time_ms=solve_time_ms,
                message="Không tìm được lịch khả thi"
            )

    def _extract_assignments(self, solver: cp_model.CpSolver) -> list[Assignment]:
        """Trích xuất assignments từ solution."""
        assignments = []

        for (item_id, staff_id, resource_id), var in self.assignment_vars.items():
            if solver.Value(var) == 1:
                # Tìm item để lấy thời gian
                item = next(i for i in self.problem.unassigned_items if i.id == item_id)

                staff = self.staff_by_id.get(staff_id)
                resource = self.resource_by_id.get(resource_id) if resource_id else None

                assignments.append(Assignment(
                    item_id=item_id,
                    staff_id=staff_id,
                    resource_id=resource_id,
                    start_time=item.start_time,
                    end_time=item.end_time,
                    staff_name=staff.name if staff else None,
                    resource_name=resource.name if resource else None
                ))

        return assignments

    def _calculate_metrics(self, assignments: list[Assignment]) -> SolutionMetrics:
        """Tính toán các metrics cho solution."""
        # Staff workload
        staff_workloads: dict[uuid.UUID, int] = {}
        for assignment in assignments:
            duration = int((assignment.end_time - assignment.start_time).total_seconds() / 60)
            staff_workloads[assignment.staff_id] = staff_workloads.get(assignment.staff_id, 0) + duration

        workloads = list(staff_workloads.values()) if staff_workloads else [0]

        # Staff utilization (rough estimate)
        total_available_minutes = len(self.problem.available_staff) * 8 * 60  # Giả sử 8h/ngày
        total_assigned_minutes = sum(workloads)
        staff_utilization = total_assigned_minutes / total_available_minutes if total_available_minutes > 0 else 0

        # Resource utilization (rough estimate)
        resource_minutes = sum(
            int((a.end_time - a.start_time).total_seconds() / 60)
            for a in assignments if a.resource_id
        )
        total_resource_minutes = len(self.problem.available_resources) * 8 * 60
        resource_utilization = resource_minutes / total_resource_minutes if total_resource_minutes > 0 else 0

        # Preference satisfaction
        matched_preferences = sum(
            1 for a in assignments
            if any(
                i.id == a.item_id and i.preferred_staff_id == a.staff_id
                for i in self.problem.unassigned_items
                if i.preferred_staff_id
            )
        )
        total_with_preference = sum(
            1 for i in self.problem.unassigned_items if i.preferred_staff_id
        )
        pref_satisfaction = matched_preferences / total_with_preference if total_with_preference > 0 else 1.0

        return SolutionMetrics(
            staff_utilization=round(staff_utilization, 3),
            resource_utilization=round(resource_utilization, 3),
            preference_satisfaction=round(pref_satisfaction, 3),
            max_staff_load_minutes=max(workloads) if workloads else 0,
            min_staff_load_minutes=min(workloads) if workloads else 0,
            avg_staff_load_minutes=round(sum(workloads) / len(workloads), 1) if workloads else 0,
            total_idle_minutes=0  # TODO: Calculate properly
        )

