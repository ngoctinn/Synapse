"""
Unit Tests for SchedulingService
"""

import pytest
import uuid
from datetime import date, datetime, timezone, time, timedelta
from unittest.mock import AsyncMock, MagicMock, patch
from src.modules.scheduling_engine.service import SchedulingService
from src.modules.scheduling_engine.models import (
    SolveRequest, SolveStatus, SchedulingSolution,
    SlotSearchRequest, SlotSuggestionResponse, SlotOption, StaffSuggestionInfo
)

@pytest.fixture
def mock_session():
    session = AsyncMock()
    session.add = MagicMock()
    session.add_all = MagicMock()
    session.delete = MagicMock()
    session.refresh = AsyncMock()
    return session

@pytest.fixture
def scheduling_service(mock_session):
    return SchedulingService(session=mock_session)

@pytest.mark.asyncio
async def test_solve_no_items(scheduling_service, mock_session):
    """Test solve khi không có booking items nào cần gán."""
    # 1. Setup mock DataExtractor
    with patch("src.modules.scheduling_engine.service.DataExtractor") as MockExtractor:
        mock_extractor_inst = MockExtractor.return_value
        mock_problem = MagicMock()
        mock_problem.unassigned_items = [] # Trống
        mock_extractor_inst.extract_problem = AsyncMock(return_value=mock_problem)

        request = SolveRequest(target_date=date.today())

        # 2. Execute
        result = await scheduling_service.solve(request)

        # 3. Verify
        assert result.status == SolveStatus.FEASIBLE
        assert "Không có booking items cần gán" in result.message

@pytest.mark.asyncio
async def test_solve_no_staff(scheduling_service, mock_session):
    """Test solve khi không có nhân viên khả dụng."""
    with patch("src.modules.scheduling_engine.service.DataExtractor") as MockExtractor:
        mock_extractor_inst = MockExtractor.return_value
        mock_problem = MagicMock()
        mock_problem.unassigned_items = [1, 2]
        mock_problem.available_staff = [] # Trống
        mock_extractor_inst.extract_problem = AsyncMock(return_value=mock_problem)

        request = SolveRequest(target_date=date.today())

        result = await scheduling_service.solve(request)

        assert result.status == SolveStatus.INFEASIBLE
        assert "Không có nhân viên khả dụng" in result.message

@pytest.mark.asyncio
async def test_find_available_slots_success(scheduling_service, mock_session):
    """Test tìm kiếm slot trống thông minh."""
    service_id = uuid.uuid4()
    request = SlotSearchRequest(
        target_date=date.today(),
        service_id=service_id
    )

    # 1. Mock Service và DataExtractor
    mock_service = MagicMock()
    mock_service.id = service_id
    mock_service.skills = []
    mock_service.resource_requirements = []
    mock_service.duration = 60

    mock_result = MagicMock()
    mock_result.first.return_value = mock_service
    mock_session.exec.return_value = mock_result

    with patch("src.modules.scheduling_engine.service.DataExtractor") as MockExtractor, \
         patch("src.modules.operating_hours.service.OperatingHoursService") as MockHoursService, \
         patch("src.modules.scheduling_engine.service.FlexibleTimeSolver") as MockSolver:

        # Mock Problem Data
        mock_problem = MagicMock()
        mock_problem.available_staff = [1, 2]
        MockExtractor.return_value.extract_problem = AsyncMock(return_value=mock_problem)

        # Mock Operating Hours
        mock_hours = MagicMock()
        mock_hours.is_closed = False
        mock_period = MagicMock()
        mock_period.open_time = time(8, 0)
        mock_period.close_time = time(20, 0)
        mock_period.is_closed = False
        mock_hours.periods = [mock_period]
        MockHoursService.return_value.get_hours_for_date = AsyncMock(return_value=mock_hours)

        # Mock Solver Result
        now = datetime.now()
        MockSolver.return_value.find_optimal_slots.return_value = [
            SlotOption(
                start_time=now,
                end_time=now + timedelta(minutes=60),
                staff=StaffSuggestionInfo(id=uuid.uuid4(), name="Test Staff"),
                resources=[],
                score=100
            )
        ]

        # 2. Execute
        result = await scheduling_service.find_available_slots(request)

        # 3. Verify
        assert result.total_found > 0
        assert "Tìm kiếm thành công" in result.message
        MockSolver.return_value.find_optimal_slots.assert_called_once()
