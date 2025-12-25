import asyncio
import uuid
from datetime import date, time, datetime, timezone
from src.modules.scheduling_engine.models import SchedulingProblem, StaffData, ResourceData, ResourceRequirementData, BookingItemData, ExistingAssignment
from src.modules.scheduling_engine.flexible_solver import FlexibleTimeSolver

# Mock Data
target_date = date(2023, 10, 27)

staff1 = StaffData(id=uuid.uuid4(), name="Staff A", skill_ids=[])
resource_group_id = uuid.uuid4()
resource1 = ResourceData(id=uuid.uuid4(), name="Machine X", group_id=resource_group_id, group_name="Machine")

problem = SchedulingProblem(
    unassigned_items=[],
    available_staff=[staff1],
    available_resources=[resource1],
    staff_schedules=[], # Not used in this specific test path if we mock workloads
    existing_assignments=[],
    target_date=target_date
)

# Initialize Solver
solver = FlexibleTimeSolver(problem)
# Mock helper methods to bypass Staff Schedule checks
solver._is_staff_in_shift = lambda s, start, end: True
solver._has_conflict = lambda s, start, end: False

# Mock Existing Assignment (Booking A)
# Booking A: 10:00 - 11:00 (60 mins)
# Resource Usage: 10:15 - 10:35 (Start + 15, Duration 20)
booking_a_start = datetime.strptime("2023-10-27 10:00:00", "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
booking_a_end = datetime.strptime("2023-10-27 11:00:00", "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)


res_busy_start = datetime.strptime("2023-10-27 10:15:00", "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
res_busy_end = datetime.strptime("2023-10-27 10:35:00", "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
problem.existing_assignments = [
    ExistingAssignment(resource_id=resource1.id, start_time=res_busy_start, end_time=res_busy_end)
]

# Test Case 1: Booking B (10:45 - 11:15)
# Resource Usage: 10:45 + 15 = 11:00 -> 11:20
# Expected: SUCCESS (11:00 > 10:35)
req_b = ResourceRequirementData(group_id=resource_group_id, start_delay=15, usage_duration=20)
slots_b = solver.find_optimal_slots(
    duration_minutes=60,
    required_resources=[req_b],
    search_start=time(10, 45),
    search_end=time(12, 0)
)
print(f"Test Case 1 (Should Succeed): Found {len(slots_b)} slots")
for s in slots_b:
    print(f"  - {s.start_time.time()}")

# Test Case 2: Booking C (10:00 - 11:00)
# Resource Usage: 10:00 + 15 = 10:15 -> 10:35
# Expected: FAIL (Conflict with existing)
req_c = ResourceRequirementData(group_id=resource_group_id, start_delay=15, usage_duration=20)
slots_c = solver.find_optimal_slots(
    duration_minutes=60,
    required_resources=[req_c],
    search_start=time(10, 0),
    search_end=time(12, 0)
)
print(f"Test Case 2 (Should Fail for 10:00): Found {len(slots_c)} slots")
for s in slots_c:
    print(f"  - {s.start_time.time()}")
