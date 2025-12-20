"""
Scheduling Engine - Slot Finder Component

Component xử lý logic tìm kiếm slot khả dụng dựa trên constraints.
"""
import uuid
from datetime import datetime, date, time, timedelta
from typing import TYPE_CHECKING

from .models import SlotOption, StaffSuggestionInfo, ResourceSuggestionInfo

if TYPE_CHECKING:
    from .solver import SpaSolver


class SlotFinder:
    """Xử lý logic tìm kiếm slot khả dụng."""

    def __init__(self, problem, solver: "SpaSolver"):
        self.problem = problem
        self.solver = solver

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
        """Thuật toán tìm slot dựa trên các constraints."""
        target_date = self.problem.target_date
        increment = timedelta(minutes=increment_minutes)
        current_dt = datetime.combine(target_date, search_start)
        end_dt = datetime.combine(target_date, search_end)

        available_options = []

        while current_dt + timedelta(minutes=duration) <= end_dt:
            slot_start = current_dt
            slot_end = current_dt + timedelta(minutes=duration)

            for staff_data in self.problem.available_staff:
                if preferred_staff_id and staff_data.id != preferred_staff_id:
                    continue

                # Check Skill
                if not all(sk in staff_data.skill_ids for sk in required_skill_ids):
                    continue

                # Check Working Hours & Overlap
                if not self.solver._is_staff_available(staff_data.id, slot_start, slot_end):
                    continue

                if self.solver._has_staff_conflict(staff_data.id, slot_start, slot_end):
                    continue

                # Check Resource
                assigned_resources = []
                if required_resource_group_id:
                    for res in self.problem.available_resources:
                        if res.group_id == required_resource_group_id:
                            if not self.solver._has_resource_conflict(res.id, slot_start, slot_end):
                                assigned_resources.append(ResourceSuggestionInfo(
                                    id=res.id,
                                    name=res.name,
                                    group_name=res.group_name
                                ))
                                break
                    if not assigned_resources:
                        continue

                # Scoring
                final_score = self._calculate_score(slot_start, staff_data.id, preferred_staff_id)

                available_options.append(SlotOption(
                    start_time=slot_start,
                    end_time=slot_end,
                    staff=StaffSuggestionInfo(
                        id=staff_data.id,
                        name=staff_data.name,
                        is_preferred=(staff_data.id == preferred_staff_id)
                    ),
                    resources=assigned_resources,
                    score=final_score
                ))

            current_dt += increment

        return available_options

    def _calculate_score(
        self,
        start_time: datetime,
        staff_id: uuid.UUID,
        preferred_staff_id: uuid.UUID | None
    ) -> float:
        """Logic chấm điểm slot."""
        score = 100

        if preferred_staff_id and staff_id != preferred_staff_id:
            score -= 30

        # Penalize later slots (prefer mornings)
        time_penalty = (start_time.hour * 60 + start_time.minute) // 60
        return max(0, score - time_penalty)
