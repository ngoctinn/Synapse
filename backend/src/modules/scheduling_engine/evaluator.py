"""
Scheduling Module - Solution Evaluator

Đánh giá chất lượng lịch hiện tại (Manual) và so sánh với lịch tối ưu.
"""

from datetime import datetime, date, time, timezone
from sqlalchemy import text
from sqlmodel.ext.asyncio.session import AsyncSession

from .models import SolutionMetrics, CompareResponse


class ScheduleEvaluator:
    """Đánh giá và so sánh lịch làm việc."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def evaluate_current_schedule(self, target_date: date) -> SolutionMetrics:
        """
        Đánh giá lịch hiện tại (đã được gán thủ công).

        Returns:
            SolutionMetrics với các chỉ số đánh giá
        """
        # Lấy tất cả booking items trong ngày (đã gán)
        assignments = await self._get_assigned_items(target_date)

        if not assignments:
            return SolutionMetrics(
                staff_utilization=0,
                resource_utilization=0,
                jain_fairness_index=1.0,
                preference_satisfaction=1.0,
                max_staff_load_minutes=0,
                min_staff_load_minutes=0,
                avg_staff_load_minutes=0,
                total_idle_minutes=0
            )

        # Tính workload cho mỗi staff
        staff_workloads: dict[str, int] = {}
        total_assigned_minutes = 0

        for row in assignments:
            staff_id = str(row[0]) if row[0] else "unassigned"
            duration = int(row[3]) if row[3] else 0

            if staff_id != "unassigned":
                staff_workloads[staff_id] = staff_workloads.get(staff_id, 0) + duration
                total_assigned_minutes += duration

        workloads = list(staff_workloads.values()) if staff_workloads else [0]

        # Staff utilization
        total_staff_hours = await self._get_total_scheduled_hours(target_date)
        staff_utilization = total_assigned_minutes / (total_staff_hours * 60) if total_staff_hours > 0 else 0

        # Resource utilization
        resource_minutes = sum(
            int(row[3]) if row[3] else 0
            for row in assignments
            if row[1]  # has resource_id
        )
        total_resources = await self._count_available_resources()
        total_resource_minutes = total_resources * 8 * 60  # Giả sử 8h
        resource_utilization = resource_minutes / total_resource_minutes if total_resource_minutes > 0 else 0

        return SolutionMetrics(
            staff_utilization=round(staff_utilization, 3),
            resource_utilization=round(resource_utilization, 3),
            preference_satisfaction=1.0,  # Không có dữ liệu preference
            max_staff_load_minutes=max(workloads) if workloads else 0,
            min_staff_load_minutes=min(workloads) if workloads else 0,
            avg_staff_load_minutes=round(sum(workloads) / len(workloads), 1) if workloads else 0,
            total_idle_minutes=await self._calculate_total_idle_minutes(assignments),
            jain_fairness_index=self._calculate_jain_index(workloads)
        )

    async def _calculate_total_idle_minutes(self, assignments: list) -> int:
        """
        Tính tổng thời gian chết (Gap) trong "Working Span" của các nhân viên.
        Idle = (Last Task End - First Task Start) - Total Worked Duration
        """
        staff_tasks = {}
        for row in assignments:
            staff_id = str(row[0]) if row[0] else None
            if not staff_id: continue

            # row[2] = start_time (datetime), row[3] = duration_minutes (float/int)
            start_time = row[2]
            duration = int(row[3]) if row[3] else 0
            end_time = start_time + timedelta(minutes=duration)

            if staff_id not in staff_tasks:
                staff_tasks[staff_id] = []
            staff_tasks[staff_id].append((start_time, end_time, duration))

        total_idle = 0
        for staff_id, tasks in staff_tasks.items():
            if not tasks: continue

            # Sort by start time
            tasks.sort(key=lambda x: x[0])

            first_start = tasks[0][0]
            last_end = max(t[1] for t in tasks) # Find max end time

            span_minutes = int((last_end - first_start).total_seconds() / 60)
            worked_minutes = sum(t[2] for t in tasks)

            idle = max(0, span_minutes - worked_minutes)
            total_idle += idle

        return total_idle

    def _calculate_jain_index(self, workloads: list[int]) -> float:
        """
        Tính toán Chỉ số Công bằng Jain (Jain's Fairness Index).
        Công thức: J = (sum(x)^2) / (n * sum(x^2))
        """
        if not workloads:
            return 1.0

        n = len(workloads)
        sum_x = sum(workloads)
        sum_x_sq = sum(x**2 for x in workloads)

        if sum_x_sq == 0:
            return 1.0 # Tuyệt đối công bằng nếu tất cả đều là 0

        jain_index = (sum_x**2) / (n * sum_x_sq)
        return round(jain_index, 4)

    async def compare_schedules(
        self,
        manual_metrics: SolutionMetrics,
        optimized_metrics: SolutionMetrics
    ) -> CompareResponse:
        """So sánh 2 lịch và tính improvement."""
        improvements = {}

        # Staff utilization improvement
        if manual_metrics.staff_utilization > 0:
            util_improvement = (
                (optimized_metrics.staff_utilization - manual_metrics.staff_utilization)
                / manual_metrics.staff_utilization * 100
            )
            improvements["staff_utilization_improvement_percent"] = round(util_improvement, 1)

        # Load balance improvement
        manual_variance = manual_metrics.max_staff_load_minutes - manual_metrics.min_staff_load_minutes
        opt_variance = optimized_metrics.max_staff_load_minutes - optimized_metrics.min_staff_load_minutes
        if manual_variance > 0:
            load_improvement = (manual_variance - opt_variance) / manual_variance * 100
            improvements["load_balance_improvement_percent"] = round(load_improvement, 1)

        return CompareResponse(
            manual_metrics=manual_metrics,
            optimized_metrics=optimized_metrics,
            improvement_summary=improvements
        )

    async def _get_assigned_items(self, target_date: date) -> list:
        """Lấy các booking items đã được gán trong ngày."""
        start_of_day = datetime.combine(target_date, time.min, tzinfo=timezone.utc)
        end_of_day = datetime.combine(target_date, time.max, tzinfo=timezone.utc)

        query = text("""
            SELECT
                bi.staff_id,
                bi.resource_id,
                bi.start_time,
                EXTRACT(EPOCH FROM (bi.end_time - bi.start_time)) / 60 as duration_minutes
            FROM booking_items bi
            JOIN bookings b ON bi.booking_id = b.id
            WHERE bi.start_time >= :start_of_day
              AND bi.start_time < :end_of_day
              AND bi.staff_id IS NOT NULL
              AND b.status NOT IN ('CANCELLED', 'NO_SHOW')
        """)
        result = await self.session.execute(query, {
            "start_of_day": start_of_day,
            "end_of_day": end_of_day
        })
        return result.fetchall()

    async def _get_total_scheduled_hours(self, target_date: date) -> float:
        """Tính tổng số giờ làm việc đã lên lịch trong ngày."""
        query = text("""
            SELECT
                SUM(
                    EXTRACT(EPOCH FROM (s.end_time - s.start_time)) / 3600
                ) as total_hours
            FROM staff_schedules ss
            JOIN shifts s ON ss.shift_id = s.id
            WHERE ss.work_date = :target_date
        """)
        result = await self.session.execute(query, {"target_date": target_date})
        row = result.fetchone()
        return float(row[0]) if row and row[0] else 0

    async def _count_available_resources(self) -> int:
        """Đếm số resources khả dụng."""
        query = text("SELECT COUNT(*) FROM resources WHERE status = 'ACTIVE'")
        result = await self.session.execute(query)
        row = result.fetchone()
        return int(row[0]) if row else 0
