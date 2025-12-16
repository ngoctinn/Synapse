"""
Bookings Module - API Endpoints (Router)

🔥 API QUAN TRỌNG NHẤT CỦA HỆ THỐNG ĐẶT LỊCH

Tuân thủ Backend Rules:
- Docstring Markdown cho Swagger UI (Tiếng Việt)
- Service as Dependency
- Response models rõ ràng
"""

import uuid
from datetime import date, datetime
from fastapi import APIRouter, Depends, status, Query

from .service import BookingService
from .models import BookingStatus
from .schemas import (
    BookingCreate,
    BookingUpdate,
    BookingRead,
    BookingListItem,
    BookingItemCreate,
    BookingItemUpdate,
    BookingItemRead,
    BookingCancel,
    BookingCheckIn,
    BookingComplete,
    ConflictCheckRequest,
    ConflictCheckResponse,
)
from .conflict_checker import ConflictChecker
from src.common.database import get_db_session
from sqlmodel.ext.asyncio.session import AsyncSession

router = APIRouter(prefix="/bookings", tags=["Lịch Hẹn"])


# ============================================================================
# BOOKINGS CRUD
# ============================================================================

@router.get(
    "",
    response_model=list[BookingRead],
    summary="Lấy danh sách lịch hẹn"
)
async def list_bookings(
    date_from: date | None = Query(None, description="Từ ngày"),
    date_to: date | None = Query(None, description="Đến ngày"),
    status_filter: BookingStatus | None = Query(None, alias="status", description="Trạng thái"),
    customer_id: uuid.UUID | None = Query(None, description="Lọc theo khách hàng"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    service: BookingService = Depends()
) -> list[BookingRead]:
    """
    Lấy danh sách lịch hẹn với các bộ lọc.

    **Query Parameters:**
    - `date_from`: Lọc từ ngày
    - `date_to`: Lọc đến ngày
    - `status`: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW
    - `customer_id`: Lọc theo khách hàng
    """
    bookings, _ = await service.get_all(
        date_from=date_from,
        date_to=date_to,
        status_filter=status_filter,
        customer_id=customer_id,
        limit=limit,
        offset=offset
    )
    return bookings


@router.post(
    "",
    response_model=BookingRead,
    status_code=status.HTTP_201_CREATED,
    summary="Tạo lịch hẹn mới"
)
async def create_booking(
    data: BookingCreate,
    service: BookingService = Depends()
) -> BookingRead:
    """
    Tạo lịch hẹn mới với các dịch vụ.

    **Flow:**
    1. Booking được tạo với status = PENDING
    2. Có thể gán staff/resource ngay hoặc sau
    3. Nếu gán ngay → kiểm tra xung đột

    **Request Body:**
    - `customer_id`: ID khách hàng (optional)
    - `items`: Danh sách dịch vụ (bắt buộc ít nhất 1)
      - `service_id`: ID dịch vụ
      - `start_time`: Thời gian bắt đầu
      - `end_time`: Thời gian kết thúc
      - `staff_id`: ID KTV (optional)
      - `resource_id`: ID phòng (optional)

    **Lỗi có thể xảy ra:**
    - `400`: Dịch vụ không tồn tại
    - `409`: Xung đột lịch (KTV hoặc Phòng)
    """
    return await service.create(data)


@router.get(
    "/{booking_id}",
    response_model=BookingRead,
    summary="Lấy chi tiết lịch hẹn"
)
async def get_booking(
    booking_id: uuid.UUID,
    service: BookingService = Depends()
) -> BookingRead:
    """
    Lấy thông tin chi tiết lịch hẹn bao gồm tất cả items.
    """
    from fastapi import HTTPException
    booking = await service.get_by_id(booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy lịch hẹn"
        )
    return booking


@router.patch(
    "/{booking_id}",
    response_model=BookingRead,
    summary="Cập nhật lịch hẹn"
)
async def update_booking(
    booking_id: uuid.UUID,
    data: BookingUpdate,
    service: BookingService = Depends()
) -> BookingRead:
    """Cập nhật thông tin lịch hẹn (notes, customer_id)."""
    return await service.update(booking_id, data)


# ============================================================================
# BOOKING ITEMS
# ============================================================================

@router.post(
    "/{booking_id}/items",
    response_model=BookingItemRead,
    status_code=status.HTTP_201_CREATED,
    summary="Thêm dịch vụ vào lịch hẹn"
)
async def add_booking_item(
    booking_id: uuid.UUID,
    data: BookingItemCreate,
    service: BookingService = Depends()
) -> BookingItemRead:
    """
    Thêm dịch vụ vào lịch hẹn.

    **Lưu ý:** Nếu gán staff/resource, sẽ kiểm tra xung đột.

    **Lỗi có thể xảy ra:**
    - `404`: Lịch hẹn không tồn tại
    - `409`: Xung đột lịch
    """
    return await service.add_item(booking_id, data)


@router.patch(
    "/{booking_id}/items/{item_id}",
    response_model=BookingItemRead,
    summary="Cập nhật dịch vụ (gán KTV/Phòng)"
)
async def update_booking_item(
    booking_id: uuid.UUID,
    item_id: uuid.UUID,
    data: BookingItemUpdate,
    service: BookingService = Depends()
) -> BookingItemRead:
    """
    Cập nhật dịch vụ trong lịch hẹn.

    ⚡ **ĐÂY LÀ THAO TÁC QUAN TRỌNG**

    Sử dụng để:
    - Gán KTV cho dịch vụ
    - Gán Phòng/Máy cho dịch vụ
    - Thay đổi thời gian

    **Lỗi có thể xảy ra:**
    - `409`: Xung đột lịch (KTV đang bận hoặc Phòng đang dùng)
    """
    return await service.update_item(booking_id, item_id, data)


@router.delete(
    "/{booking_id}/items/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa dịch vụ khỏi lịch hẹn"
)
async def delete_booking_item(
    booking_id: uuid.UUID,
    item_id: uuid.UUID,
    service: BookingService = Depends()
) -> None:
    """Xóa dịch vụ khỏi lịch hẹn."""
    await service.delete_item(booking_id, item_id)


# ============================================================================
# STATUS TRANSITIONS
# ============================================================================

@router.patch(
    "/{booking_id}/confirm",
    response_model=BookingRead,
    summary="Xác nhận lịch hẹn"
)
async def confirm_booking(
    booking_id: uuid.UUID,
    service: BookingService = Depends()
) -> BookingRead:
    """
    Xác nhận lịch hẹn: **PENDING → CONFIRMED**

    Sau khi xác nhận, khách hàng sẽ nhận được thông báo.
    """
    return await service.confirm(booking_id)


@router.patch(
    "/{booking_id}/check-in",
    response_model=BookingRead,
    summary="Check-in khách hàng"
)
async def check_in_booking(
    booking_id: uuid.UUID,
    data: BookingCheckIn | None = None,
    service: BookingService = Depends()
) -> BookingRead:
    """
    Check-in khách hàng: **CONFIRMED → IN_PROGRESS**

    Ghi nhận thời điểm khách đến.
    """
    check_in_time = data.check_in_time if data else None
    return await service.check_in(booking_id, check_in_time)


@router.patch(
    "/{booking_id}/complete",
    response_model=BookingRead,
    summary="Hoàn thành lịch hẹn"
)
async def complete_booking(
    booking_id: uuid.UUID,
    data: BookingComplete | None = None,
    service: BookingService = Depends()
) -> BookingRead:
    """
    Hoàn thành lịch hẹn: **IN_PROGRESS → COMPLETED**

    Ghi nhận thời điểm kết thúc thực tế.
    """
    actual_end_time = data.actual_end_time if data else None
    return await service.complete(booking_id, actual_end_time)


@router.patch(
    "/{booking_id}/cancel",
    response_model=BookingRead,
    summary="Hủy lịch hẹn"
)
async def cancel_booking(
    booking_id: uuid.UUID,
    data: BookingCancel,
    service: BookingService = Depends()
) -> BookingRead:
    """
    Hủy lịch hẹn: **→ CANCELLED**

    **Bắt buộc:** Phải cung cấp lý do hủy.
    """
    return await service.cancel(booking_id, data.cancel_reason)


@router.patch(
    "/{booking_id}/no-show",
    response_model=BookingRead,
    summary="Đánh dấu khách không đến"
)
async def no_show_booking(
    booking_id: uuid.UUID,
    service: BookingService = Depends()
) -> BookingRead:
    """
    Đánh dấu khách không đến: **CONFIRMED → NO_SHOW**
    """
    return await service.no_show(booking_id)


# ============================================================================
# CONFLICT CHECK APIs
# ============================================================================

@router.post(
    "/check-conflicts",
    response_model=ConflictCheckResponse,
    summary="Kiểm tra xung đột lịch"
)
async def check_conflicts(
    data: ConflictCheckRequest,
    session: AsyncSession = Depends(get_db_session)
) -> ConflictCheckResponse:
    """
    Kiểm tra xung đột trước khi gán KTV/Phòng.

    ⚡ **SỬ DỤNG TRƯỚC KHI GÁN ĐỂ TRÁNH LỖI**

    **Request Body:**
    - `staff_id`: ID KTV cần kiểm tra
    - `resource_id`: ID Phòng cần kiểm tra
    - `start_time`: Thời gian bắt đầu
    - `end_time`: Thời gian kết thúc
    - `exclude_item_id`: Bỏ qua item này (khi update)
    - `check_schedule`: Có kiểm tra ca làm việc không

    **Response:**
    - `has_conflict`: true nếu có xung đột
    - `conflicts`: Chi tiết các xung đột
    """
    checker = ConflictChecker(session)
    conflicts = await checker.check_all_conflicts(
        staff_id=data.staff_id,
        resource_id=data.resource_id,
        start_time=data.start_time,
        end_time=data.end_time,
        exclude_item_id=data.exclude_item_id,
        check_schedule=data.check_schedule
    )

    return ConflictCheckResponse(
        has_conflict=len(conflicts) > 0,
        conflicts=[c.model_dump() for c in conflicts]
    )


@router.get(
    "/staff/{staff_id}/bookings",
    response_model=list[BookingItemRead],
    summary="Lấy lịch booking của KTV trong ngày"
)
async def get_staff_bookings(
    staff_id: uuid.UUID,
    work_date: date = Query(..., description="Ngày cần kiểm tra"),
    session: AsyncSession = Depends(get_db_session)
) -> list[BookingItemRead]:
    """
    Lấy tất cả booking items của KTV trong ngày.

    **Use case:** Xem lịch làm việc thực tế của KTV.
    """
    checker = ConflictChecker(session)
    items = await checker.get_staff_bookings_on_date(staff_id, work_date)
    return items


@router.get(
    "/resource/{resource_id}/bookings",
    response_model=list[BookingItemRead],
    summary="Lấy lịch booking của Phòng trong ngày"
)
async def get_resource_bookings(
    resource_id: uuid.UUID,
    work_date: date = Query(..., description="Ngày cần kiểm tra"),
    session: AsyncSession = Depends(get_db_session)
) -> list[BookingItemRead]:
    """
    Lấy tất cả booking items của Phòng/Máy trong ngày.

    **Use case:** Xem lịch sử dụng phòng.
    """
    checker = ConflictChecker(session)
    items = await checker.get_resource_bookings_on_date(resource_id, work_date)
    return items
