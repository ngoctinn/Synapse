"""
Schedules Module - API Endpoints (Router)

Tuân thủ Backend Rules:
- Docstring Markdown cho Swagger UI (Tiếng Việt)
- Service as Dependency
- Response models rõ ràng
"""

import uuid
from datetime import date
from fastapi import APIRouter, Depends, status, Query

from .service import ShiftService, StaffScheduleService
from .models import ScheduleStatus
from .schemas import (
    ShiftCreate,
    ShiftUpdate,
    ShiftRead,
    StaffScheduleCreate,
    StaffScheduleBulkCreate,
    StaffScheduleUpdate,
    StaffScheduleRead,
    StaffAvailability,
)

router = APIRouter(tags=["Lịch Làm Việc"])


# ============================================================================
# SHIFTS ENDPOINTS
# ============================================================================

@router.get(
    "/shifts",
    response_model=list[ShiftRead],
    summary="Lấy danh sách ca làm việc"
)
async def list_shifts(
    service: ShiftService = Depends()
) -> list[ShiftRead]:
    """
    Lấy tất cả ca làm việc đã định nghĩa.

    **Ví dụ ca làm việc:**
    - Ca sáng: 08:00 - 12:00
    - Ca chiều: 13:00 - 17:00
    - Ca tối: 18:00 - 21:00
    """
    return await service.get_all()


@router.post(
    "/shifts",
    response_model=ShiftRead,
    status_code=status.HTTP_201_CREATED,
    summary="Tạo ca làm việc mới"
)
async def create_shift(
    data: ShiftCreate,
    service: ShiftService = Depends()
) -> ShiftRead:
    """
    Tạo ca làm việc mới.

    **Các trường bắt buộc:**
    - `name`: Tên ca (VD: "Ca sáng")
    - `start_time`: Giờ bắt đầu (format: "HH:MM")
    - `end_time`: Giờ kết thúc (format: "HH:MM")

    **Ràng buộc:**
    - Giờ kết thúc phải sau giờ bắt đầu
    """
    return await service.create(data)


@router.get(
    "/shifts/{shift_id}",
    response_model=ShiftRead,
    summary="Lấy chi tiết ca làm việc"
)
async def get_shift(
    shift_id: uuid.UUID,
    service: ShiftService = Depends()
) -> ShiftRead:
    """
    Lấy thông tin chi tiết một ca làm việc.

    **Lỗi có thể xảy ra:**
    - `404`: Không tìm thấy ca làm việc
    """
    from fastapi import HTTPException
    shift = await service.get_by_id(shift_id)
    if not shift:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy ca làm việc"
        )
    return shift


@router.patch(
    "/shifts/{shift_id}",
    response_model=ShiftRead,
    summary="Cập nhật ca làm việc"
)
async def update_shift(
    shift_id: uuid.UUID,
    data: ShiftUpdate,
    service: ShiftService = Depends()
) -> ShiftRead:
    """
    Cập nhật thông tin ca làm việc.

    **Lưu ý:** Chỉ cần gửi các trường muốn thay đổi.
    """
    return await service.update(shift_id, data)


@router.delete(
    "/shifts/{shift_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa ca làm việc"
)
async def delete_shift(
    shift_id: uuid.UUID,
    service: ShiftService = Depends()
) -> None:
    """
    Xóa ca làm việc.

    **Cảnh báo:** Xóa ca sẽ xóa tất cả lịch phân công liên quan.
    """
    await service.delete(shift_id)


# ============================================================================
# STAFF SCHEDULES ENDPOINTS
# ============================================================================

@router.get(
    "/schedules",
    response_model=list[StaffScheduleRead],
    summary="Lấy danh sách lịch làm việc"
)
async def list_schedules(
    staff_id: uuid.UUID | None = Query(None, description="Lọc theo KTV"),
    date_from: date | None = Query(None, description="Từ ngày"),
    date_to: date | None = Query(None, description="Đến ngày"),
    status_filter: ScheduleStatus | None = Query(None, description="Trạng thái"),
    service: StaffScheduleService = Depends()
) -> list[StaffScheduleRead]:
    """
    Lấy danh sách lịch làm việc với các bộ lọc.

    **Query Parameters:**
    - `staff_id`: Lọc theo ID nhân viên
    - `date_from`: Lọc từ ngày
    - `date_to`: Lọc đến ngày
    - `status`: DRAFT hoặc PUBLISHED
    """
    return await service.get_all(
        staff_id=staff_id,
        date_from=date_from,
        date_to=date_to,
        status_filter=status_filter
    )


@router.post(
    "/schedules",
    response_model=StaffScheduleRead,
    status_code=status.HTTP_201_CREATED,
    summary="Tạo lịch làm việc"
)
async def create_schedule(
    data: StaffScheduleCreate,
    service: StaffScheduleService = Depends()
) -> StaffScheduleRead:
    """
    Phân công ca làm việc cho KTV trong ngày.

    **Các trường bắt buộc:**
    - `staff_id`: ID nhân viên
    - `shift_id`: ID ca làm việc
    - `work_date`: Ngày làm việc

    **Lỗi có thể xảy ra:**
    - `409`: KTV đã được phân công ca này trong ngày
    """
    return await service.create(data)


@router.post(
    "/schedules/bulk",
    response_model=list[StaffScheduleRead],
    status_code=status.HTTP_201_CREATED,
    summary="Tạo nhiều lịch làm việc"
)
async def bulk_create_schedules(
    data: StaffScheduleBulkCreate,
    service: StaffScheduleService = Depends()
) -> list[StaffScheduleRead]:
    """
    Tạo lịch làm việc cho nhiều KTV và/hoặc nhiều ngày cùng lúc.

    **Ví dụ:** Phân công 3 KTV làm ca Sáng trong tuần tới.

    **Lưu ý:** Các bản ghi trùng sẽ bị bỏ qua.
    """
    return await service.bulk_create(data)


@router.get(
    "/schedules/{schedule_id}",
    response_model=StaffScheduleRead,
    summary="Lấy chi tiết lịch làm việc"
)
async def get_schedule(
    schedule_id: uuid.UUID,
    service: StaffScheduleService = Depends()
) -> StaffScheduleRead:
    """Lấy thông tin chi tiết một lịch làm việc."""
    from fastapi import HTTPException
    schedule = await service.get_by_id(schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy lịch làm việc"
        )
    return schedule


@router.patch(
    "/schedules/{schedule_id}",
    response_model=StaffScheduleRead,
    summary="Cập nhật lịch làm việc"
)
async def update_schedule(
    schedule_id: uuid.UUID,
    data: StaffScheduleUpdate,
    service: StaffScheduleService = Depends()
) -> StaffScheduleRead:
    """Cập nhật thông tin lịch làm việc."""
    return await service.update(schedule_id, data)


@router.delete(
    "/schedules/{schedule_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa lịch làm việc"
)
async def delete_schedule(
    schedule_id: uuid.UUID,
    service: StaffScheduleService = Depends()
) -> None:
    """Xóa lịch làm việc."""
    await service.delete(schedule_id)


@router.patch(
    "/schedules/{schedule_id}/publish",
    response_model=StaffScheduleRead,
    summary="Công bố lịch làm việc"
)
async def publish_schedule(
    schedule_id: uuid.UUID,
    service: StaffScheduleService = Depends()
) -> StaffScheduleRead:
    """
    Công bố lịch làm việc (DRAFT → PUBLISHED).

    **Sau khi công bố:**
    - KTV có thể nhìn thấy lịch
    - Lịch được sử dụng trong hệ thống đặt hẹn
    """
    return await service.publish(schedule_id)


# ============================================================================
# AVAILABILITY QUERY ENDPOINTS
# ============================================================================

@router.get(
    "/staff/{staff_id}/availability",
    response_model=StaffAvailability,
    summary="Lấy khung giờ làm việc của KTV"
)
async def get_staff_availability(
    staff_id: uuid.UUID,
    work_date: date = Query(..., description="Ngày cần kiểm tra"),
    service: StaffScheduleService = Depends()
) -> StaffAvailability:
    """
    Lấy khung giờ làm việc của KTV trong ngày cụ thể.

    **Đây là API core cho hệ thống lập lịch** - trả lời câu hỏi:
    *"KTV này làm việc lúc nào trong ngày X?"*

    **Response bao gồm:**
    - Danh sách các khung giờ (time_slots)
    - Tổng số giờ làm việc

    **Lưu ý:** Chỉ trả về lịch đã PUBLISHED.
    """
    return await service.get_staff_availability(staff_id, work_date)


@router.get(
    "/schedules/by-date/{work_date}",
    response_model=list[StaffScheduleRead],
    summary="Lấy lịch làm việc theo ngày"
)
async def get_schedules_by_date(
    work_date: date,
    service: StaffScheduleService = Depends()
) -> list[StaffScheduleRead]:
    """
    Lấy tất cả lịch làm việc trong ngày.

    **Use case:** Xem overview ai làm việc trong ngày.
    """
    return await service.get_schedules_by_date(work_date)
