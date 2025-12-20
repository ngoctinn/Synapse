"""
Operating Hours Module - API Endpoints

Quản lý giờ hoạt động Spa và các ngày nghỉ lễ/đặc biệt.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Query

from .service import OperatingHoursService, ExceptionDateService
from .schemas import (
    WeekOperatingHoursRead,
    WeekOperatingHoursUpdate,
    DayOperatingHours,
    ExceptionDateCreate,
    ExceptionDateUpdate,
    ExceptionDateRead,
    ExceptionDateListResponse,
)
from .exceptions import (
    ExceptionDateNotFound,
    DuplicateExceptionDate,
    InvalidOperatingHours,
)


router = APIRouter(prefix="/operating-hours", tags=["Operating Hours"])


# ============================================================================
# REGULAR OPERATING HOURS ENDPOINTS
# ============================================================================

@router.get("", response_model=WeekOperatingHoursRead)
async def get_week_operating_hours(
    service: OperatingHoursService = Depends()
):
    """
    **Lấy giờ hoạt động toàn bộ tuần.**

    Trả về danh sách 7 ngày với các ca hoạt động tương ứng.
    Mỗi ngày có thể có nhiều ca (VD: Sáng 8h-12h, Chiều 14h-20h).
    """
    return await service.get_week_hours()


@router.put("", response_model=WeekOperatingHoursRead)
async def update_week_operating_hours(
    data: WeekOperatingHoursUpdate,
    service: OperatingHoursService = Depends()
):
    """
    **Cập nhật giờ hoạt động toàn bộ tuần.**

    Thay thế toàn bộ cấu hình giờ hoạt động hiện có.

    ### Lưu ý:
    - Giờ mở cửa phải trước giờ đóng cửa.
    - Có thể đánh dấu ngày nghỉ bằng `is_closed: true`.
    - Hỗ trợ nhiều ca trong ngày (VD: Nghỉ trưa).
    """
    try:
        return await service.update_week_hours(data)
    except InvalidOperatingHours as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e.detail
        )


@router.get("/day/{day_of_week}", response_model=DayOperatingHours)
async def get_day_operating_hours(
    day_of_week: int,
    service: OperatingHoursService = Depends()
):
    """
    **Lấy giờ hoạt động của một ngày cụ thể.**

    ### Tham số:
    - **day_of_week**: Số từ 1-7 (1=Thứ Hai, 7=Chủ Nhật).
    """
    if day_of_week < 1 or day_of_week > 7:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="day_of_week phải từ 1 đến 7 (1=Thứ Hai, 7=Chủ Nhật)"
        )
    return await service.get_day_hours(day_of_week)


# ============================================================================
# EXCEPTION DATES ENDPOINTS
# ============================================================================

@router.get("/exceptions", response_model=ExceptionDateListResponse)
async def list_exception_dates(
    year: int | None = Query(None, description="Lọc theo năm"),
    service: ExceptionDateService = Depends()
):
    """
    **Lấy danh sách các ngày nghỉ lễ và ngày đặc biệt.**

    ### Tham số lọc:
    - **year**: Chỉ lấy các ngày trong năm chỉ định.
    """
    return await service.get_all(year=year)


@router.post(
    "/exceptions",
    response_model=ExceptionDateRead,
    status_code=status.HTTP_201_CREATED
)
async def create_exception_date(
    data: ExceptionDateCreate,
    service: ExceptionDateService = Depends()
):
    """
    **Thêm ngày nghỉ lễ hoặc ngày hoạt động đặc biệt.**

    ### Loại ngày (`type`):
    - **HOLIDAY**: Ngày lễ (nghỉ cả ngày).
    - **MAINTENANCE**: Ngày bảo trì.
    - **CUSTOM**: Giờ hoạt động đặc biệt.

    ### Lưu ý:
    - Nếu `is_closed: false`, cần cung cấp `open_time` và `close_time`.
    """
    try:
        return await service.create(data)
    except DuplicateExceptionDate as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e.detail
        )
    except InvalidOperatingHours as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e.detail
        )


@router.get("/exceptions/{exception_id}", response_model=ExceptionDateRead)
async def get_exception_date(
    exception_id: uuid.UUID,
    service: ExceptionDateService = Depends()
):
    """
    **Xem chi tiết một ngày ngoại lệ.**
    """
    try:
        return await service.get_by_id(exception_id)
    except ExceptionDateNotFound as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.detail
        )


@router.put("/exceptions/{exception_id}", response_model=ExceptionDateRead)
async def update_exception_date(
    exception_id: uuid.UUID,
    data: ExceptionDateUpdate,
    service: ExceptionDateService = Depends()
):
    """
    **Cập nhật thông tin ngày ngoại lệ.**
    """
    try:
        return await service.update(exception_id, data)
    except ExceptionDateNotFound as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.detail
        )


@router.delete(
    "/exceptions/{exception_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_exception_date(
    exception_id: uuid.UUID,
    service: ExceptionDateService = Depends()
):
    """
    **Xóa ngày ngoại lệ.**

    Xóa vĩnh viễn ngày nghỉ lễ hoặc ngày đặc biệt khỏi hệ thống.
    """
    try:
        await service.delete(exception_id)
    except ExceptionDateNotFound as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.detail
        )
