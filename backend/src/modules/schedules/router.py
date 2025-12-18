"""
Schedules Module - API Endpoints

Quản lý ca làm việc (Shifts) và phân công lịch trình hàng ngày/hàng tuần cho nhân viên.
Đảm bảo nhân viên có đủ thời gian làm việc để phục vụ khách hàng.
"""

import uuid
from datetime import date
from fastapi import APIRouter, Depends, status, Query, HTTPException

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

router = APIRouter(prefix="/schedules", tags=["Schedules"])


# ============================================================================
# SHIFTS ENDPOINTS
# ============================================================================

@router.get("/shifts", response_model=list[ShiftRead])
async def list_shifts(
    service: ShiftService = Depends()
) -> list[ShiftRead]:
    """
    **Lấy danh sách các ca làm việc định nghĩa sẵn.**

    Truy vấn cấu hình các ca làm việc mẫu (Vd: Ca sáng: 08:00 - 12:00, Ca chiều: 13:00 - 17:00).
    """
    return await service.get_all()


@router.post("/shifts", response_model=ShiftRead, status_code=status.HTTP_201_CREATED)
async def create_shift(
    data: ShiftCreate,
    service: ShiftService = Depends()
) -> ShiftRead:
    """
    **Tạo định nghĩa ca làm nghiệp vụ mới.**

    Thiết lập tên ca, khung giờ bắt đầu và kết thúc chuẩn.

    ### Logic Flow:
    1. Nhận thông tin `name`, `start_time`, `end_time`.
    2. Lưu cấu hình vào Database.
    """
    return await service.create(data)


@router.get("/shifts/{shift_id}", response_model=ShiftRead)
async def get_shift(
    shift_id: uuid.UUID,
    service: ShiftService = Depends()
) -> ShiftRead:
    """
    **Xem chi tiết cấu hình ca.**
    """
    shift = await service.get_by_id(shift_id)
    if not shift:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shift not found"
        )
    return shift


@router.patch("/shifts/{shift_id}", response_model=ShiftRead)
async def update_shift(
    shift_id: uuid.UUID,
    data: ShiftUpdate,
    service: ShiftService = Depends()
) -> ShiftRead:
    """
    **Chỉnh sửa khung giờ ca làm việc.**
    """
    return await service.update(shift_id, data)


@router.delete("/shifts/{shift_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_shift(
    shift_id: uuid.UUID,
    service: ShiftService = Depends()
) -> None:
    """
    **Xóa định nghĩa ca.**
    """
    await service.delete(shift_id)


# ============================================================================
# STAFF SCHEDULES ENDPOINTS
# ============================================================================

@router.get("", response_model=list[StaffScheduleRead])
async def list_schedules(
    staff_id: uuid.UUID | None = Query(None),
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    status_filter: ScheduleStatus | None = Query(None),
    service: StaffScheduleService = Depends()
) -> list[StaffScheduleRead]:
    """
    **Truy vấn lịch phân ca của nhân viên.**

    Lấy danh sách các bản phân ca thực tế cho nhân viên trong một khoảng thời gian.

    ### Query Filters:
    - **staff_id**: Xem lịch của một người cụ thể.
    - **date_from / date_to**: Lọc theo khoảng ngày.
    - **status**: Lọc theo trạng thái (Vd: `DRAFT`, `PUBLISHED`).
    """
    return await service.get_all(
        staff_id=staff_id,
        date_from=date_from,
        date_to=date_to,
        status_filter=status_filter
    )


@router.post("", response_model=StaffScheduleRead, status_code=status.HTTP_201_CREATED)
async def create_schedule(
    data: StaffScheduleCreate,
    service: StaffScheduleService = Depends()
) -> StaffScheduleRead:
    """
    **Phân công ca làm việc cho nhân viên.**

    Gán một ca làm việc cụ thể (`shift_id`) cho một nhân viên vào một ngày xác định.

    ### Logic Flow:
    1. Kiểm tra tồn tại của Staff và Shift.
    2. Kiểm tra trùng lặp lịch trong cùng một ngày.
    3. Lưu bản ghi với trạng thái mặc định là `DRAFT`.
    """
    return await service.create(data)


@router.post("/bulk", response_model=list[StaffScheduleRead], status_code=status.HTTP_201_CREATED)
async def bulk_create_schedules(
    data: StaffScheduleBulkCreate,
    service: StaffScheduleService = Depends()
) -> list[StaffScheduleRead]:
    """
    **Phân ca hàng loạt.**

    Cho phép tạo lịch làm việc cho nhiều nhân viên hoặc nhiều ngày trong một request duy nhất.
    Thường dùng cho việc lập kế hoạch tuần hoặc tháng.
    """
    return await service.bulk_create(data)


@router.get("/{schedule_id}", response_model=StaffScheduleRead)
async def get_schedule(
    schedule_id: uuid.UUID,
    service: StaffScheduleService = Depends()
) -> StaffScheduleRead:
    """
    **Xem chi tiết một bản ghi phân ca.**
    """
    schedule = await service.get_by_id(schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )
    return schedule


@router.patch("/{schedule_id}", response_model=StaffScheduleRead)
async def update_schedule(
    schedule_id: uuid.UUID,
    data: StaffScheduleUpdate,
    service: StaffScheduleService = Depends()
) -> StaffScheduleRead:
    """
    **Điều chỉnh lịch phân ca.**
    """
    return await service.update(schedule_id, data)


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_schedule(
    schedule_id: uuid.UUID,
    service: StaffScheduleService = Depends()
) -> None:
    """
    **Hủy bỏ một bản phân ca.**
    """
    await service.delete(schedule_id)


@router.patch("/{schedule_id}/publish", response_model=StaffScheduleRead)
async def publish_schedule(
    schedule_id: uuid.UUID,
    service: StaffScheduleService = Depends()
) -> StaffScheduleRead:
    """
    **Công bố lịch làm việc.**

    Chuyển trạng thái lịch từ `DRAFT` sang `PUBLISHED`.
    Sau bước này, lịch làm việc mới chính thức có hiệu lực và nhân viên có thể xem được.
    """
    return await service.publish(schedule_id)


# ============================================================================
# AVAILABILITY QUERY ENDPOINTS
# ============================================================================

@router.get("/staff/{staff_id}/availability", response_model=StaffAvailability)
async def get_staff_availability(
    staff_id: uuid.UUID,
    work_date: date = Query(...),
    service: StaffScheduleService = Depends()
) -> StaffAvailability:
    """
    **Kiểm tra khung giờ rảnh thực tế của nhân viên.**

    Truy vấn xem trong một ngày cụ thể, nhân viên có lịch làm việc không và khung giờ chính xác là bao nhiêu.
    Dữ liệu này cực kỳ quan trọng cho hệ thống Booking để hiển thị các Slot trống.

    ### Logic Flow:
    1. Lấy tất cả các ca `PUBLISHED` của Staff trong ngày.
    2. Gộp các khoảng thời gian (nếu có nhiều ca).
    3. Trả về object chứa danh sách các khoảng `TimeRange`.
    """
    return await service.get_staff_availability(staff_id, work_date)


@router.get("/by-date/{work_date}", response_model=list[StaffScheduleRead])
async def get_schedules_by_date(
    work_date: date,
    service: StaffScheduleService = Depends()
) -> list[StaffScheduleRead]:
    """
    **Lấy toàn bộ danh sách phân ca trong một ngày.**

    Dùng để hiển thị bảng điều phối (Dispatching Board) cho toàn bộ trung tâm trong một ngày.
    """
    return await service.get_schedules_by_date(work_date)
