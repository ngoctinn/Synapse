"""
Integration Tests for Scheduling Engine Module
"""

import pytest
import uuid
from datetime import date, datetime, time, timezone
from httpx import AsyncClient
from unittest.mock import MagicMock, patch, AsyncMock
from src.modules.scheduling_engine.models import SolveStatus

@pytest.mark.asyncio
async def test_scheduling_health(client: AsyncClient):
    """Test health check OR-Tools."""
    response = await client.get("/api/v1/scheduling/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

@pytest.mark.asyncio
async def test_find_slots_no_service(client: AsyncClient, mock_admin_auth, mock_session):
    """Test tìm slot với service không tồn tại."""
    mock_result = MagicMock()
    mock_result.first.return_value = None
    mock_session.exec.return_value = mock_result

    search_data = {
        "service_id": str(uuid.uuid4()),
        "target_date": str(date.today())
    }
    response = await client.post("/api/v1/scheduling/find-slots", json=search_data)
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_evaluate_schedule(client: AsyncClient, mock_admin_auth, mock_session):
    """Test đánh giá chất lượng lịch."""
    with patch("src.modules.scheduling_engine.service.ScheduleEvaluator") as MockEval:
        eval_instance = MockEval.return_value
        # Dùng AsyncMock cho hàm async
        eval_instance.evaluate_current_schedule = AsyncMock(return_value={
            "staff_utilization": 0.5,
            "resource_utilization": 0.4,
            "preference_satisfaction": 1.0,
            "max_staff_load_minutes": 120,
            "min_staff_load_minutes": 60,
            "avg_staff_load_minutes": 90,
            "total_idle_minutes": 300,
            "jain_fairness_index": 0.95
        })

        eval_data = {"target_date": str(date.today())}
        response = await client.post("/api/v1/scheduling/evaluate", json=eval_data)

        assert response.status_code == 200
        assert response.json()["staff_utilization"] == 0.5

@pytest.mark.asyncio
async def test_solve_no_items(client: AsyncClient, mock_admin_auth, mock_session):
    """Test gọi solve khi không có booking nào cần gán."""
    with patch("src.modules.scheduling_engine.service.DataExtractor") as MockExtractor:
        extractor_instance = MockExtractor.return_value
        mock_problem = MagicMock()
        mock_problem.unassigned_items = []
        # Dùng AsyncMock cho hàm async
        extractor_instance.extract_problem = AsyncMock(return_value=mock_problem)

        solve_data = {"target_date": str(date.today())}
        response = await client.post("/api/v1/scheduling/solve", json=solve_data)

        assert response.status_code == 200
        assert response.json()["status"] == SolveStatus.FEASIBLE
        assert "không có booking" in response.json()["message"].lower()
