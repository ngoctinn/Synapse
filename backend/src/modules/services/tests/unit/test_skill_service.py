"""
Unit Tests for SkillService
"""

import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from sqlalchemy.exc import IntegrityError
from src.modules.services.skill_service import SkillService
from src.modules.services.exceptions import SkillNotFoundError, SkillAlreadyExistsError
from src.modules.services.schemas import SkillCreate

@pytest.fixture
def mock_session():
    session = AsyncMock()
    session.add = MagicMock()
    session.add_all = MagicMock()
    session.delete = MagicMock()
    session.refresh = AsyncMock()
    return session

@pytest.fixture
def skill_service(mock_session):
    return SkillService(session=mock_session)

@pytest.mark.asyncio
async def test_create_skill_success(skill_service, mock_session):
    """Test tạo kỹ năng thành công."""
    skill_in = SkillCreate(name="Facial Care", code="SK_FACIAL", description="Skill description")

    result = await skill_service.create_skill(skill_in)

    assert result.name == "Facial Care"
    assert result.code == "SK_FACIAL"
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()

@pytest.mark.asyncio
async def test_create_skill_already_exists(skill_service, mock_session):
    """Test tạo kỹ năng thất bại do trùng mã code."""
    skill_in = SkillCreate(name="Duplicate", code="SK_EXISTING")

    # Giả lập lỗi IntegrityError khi commit
    mock_session.commit.side_effect = IntegrityError(None, None, "unique constraint")

    with pytest.raises(SkillAlreadyExistsError):
        await skill_service.create_skill(skill_in)

    assert mock_session.rollback.called

@pytest.mark.asyncio
async def test_delete_skill_not_found(skill_service, mock_session):
    """Test xóa kỹ năng không tồn tại."""
    skill_id = uuid.uuid4()
    mock_session.get.return_value = None

    with pytest.raises(SkillNotFoundError):
        await skill_service.delete_skill(skill_id)
