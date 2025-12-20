"""
Bookings Module - API Endpoints

Hệ thống quản lý lịch hẹn (Bookings) - Trái tim của vận hành Spa. Cho phép quản lý toàn bộ vòng đời của một dịch vụ:
Từ lúc Đặt lịch -> Xác nhận -> Check-in -> Thực hiện -> Hoàn thành.
"""

import uuid
from datetime import date
from fastapi import APIRouter, Depends, status, Query, HTTPException

from .service import BookingService
from .models import BookingStatus
from .schemas import (
    BookingCreate,
    BookingUpdate,
    BookingRead,
    BookingItemCreate,
    BookingItemUpdate,
    BookingItemRead,
    BookingCancel,
    BookingCheckIn,
    BookingComplete,
    ConflictCheckRequest,
    ConflictCheckResponse,
    TreatmentNoteCreate,
    TreatmentNoteRead,
)
from .conflict_checker import ConflictChecker
from src.common.database import get_db_session
from src.common.auth_core import get_token_payload
from sqlmodel.ext.asyncio.session import AsyncSession

router = APIRouter(prefix="/bookings", tags=["Bookings"])


# ============================================================================
# BOOKINGS CRUD
# ============================================================================

@router.get("", response_model=list[BookingRead])
async def list_bookings(
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    status_filter: BookingStatus | None = Query(None, alias="status"),
    customer_id: uuid.UUID | None = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    service: BookingService = Depends()
) -> list[BookingRead]:
    """
    **Lấy danh sách các lịch hẹn (Bookings).**

    Truy vấn toàn bộ các lịch hẹn trong hệ thống. Hỗ trợ lọc theo khoảng thời gian, trạng thái và khách hàng cụ thể.

    ### Logic Flow:
    1. Áp dụng các bộ lọc ngày: `date_from` (từ ngày), `date_to` (đến ngày).
    2. Lọc theo trạng thái hồ sơ (Vd: `PENDING`, `CONFIRMED`).
    3. Trả về danh sách kèm metadata phân trang.

    ### Tham số đầu vào (Query):
    - **status**: Trạng thái cần lọc.
    - **customer_id**: ID của khách hàng cụ thể.
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


@router.post("", response_model=BookingRead, status_code=status.HTTP_201_CREATED)
async def create_booking(
    data: BookingCreate,
    service: BookingService = Depends()
) -> BookingRead:
    """
    **Tạo lịch đặt chỗ mới.**

    Khởi tạo một đơn đặt lịch tổng thể (có thể bao gồm nhiều dịch vụ bên trong).

    ### Logic Flow:
    1. Tiếp nhận thông tin khách hàng và ghi chú chung.
    2. Khởi tạo trạng thái mặc định là `PENDING`.
    3. Tạo bản ghi Booking chính trong Database.

    ### Chú ý:
    - Sau khi tạo Booking, bạn cần sử dụng endpoint `add_item` để thêm các dịch vụ cụ thể vào lịch hẹn này.
    """
    return await service.create(data)


@router.get("/{booking_id}", response_model=BookingRead)
async def get_booking(
    booking_id: uuid.UUID,
    service: BookingService = Depends()
) -> BookingRead:
    """
    **Xem chi tiết thông tin lịch hẹn.**

    Truy vấn toàn bộ dữ liệu của một Booking, bao gồm cả các hạng mục dịch vụ (Items) đi kèm.
    """
    booking = await service.get_by_id(booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    return booking


@router.patch("/{booking_id}", response_model=BookingRead)
async def update_booking(
    booking_id: uuid.UUID,
    data: BookingUpdate,
    service: BookingService = Depends()
) -> BookingRead:
    """
    **Cập nhật thông tin chung của Booking.**

    Cho phép chỉnh sửa các thông tin như Ghi chú (Note) hoặc ID Khách hàng.
    Lưu ý: Để đổi giờ hoặc KTV cho dịch vụ, hãy sử dụng phần Update Booking Item.
    """
    return await service.update(booking_id, data)


# ============================================================================
# BOOKING ITEMS
# ============================================================================

@router.post(
    "/{booking_id}/items",
    response_model=BookingItemRead,
    status_code=status.HTTP_201_CREATED
)
async def add_booking_item(
    booking_id: uuid.UUID,
    data: BookingItemCreate,
    service: BookingService = Depends()
) -> BookingItemRead:
    """
    **Thêm dịch vụ vào lịch đặt chỗ.**

    Đăng ký một suất sử dụng dịch vụ spa cụ thể trong một lứa Booking.

    ### Logic Flow:
    1. Kiểm tra sự tồn tại của Booking chính.
    2. Tiếp nhận ID Dịch vụ, giờ bắt đầu (`start_time`), và KTV/Phòng (nếu có).
    3. Ghi lại Snapshot về giá và tên dịch vụ tại thời điểm đặt để tránh bị ảnh hưởng bởi thay đổi giá tương lai.
    4. Cập nhật ID nhân viên và tài nguyên thực hiện.
    """
    return await service.add_item(booking_id, data)


@router.patch(
    "/{booking_id}/items/{item_id}",
    response_model=BookingItemRead
)
async def update_booking_item(
    booking_id: uuid.UUID,
    item_id: uuid.UUID,
    data: BookingItemUpdate,
    service: BookingService = Depends()
) -> BookingItemRead:
    """
    **Cập nhật chi tiết một hạng mục dịch vụ.**

    Thay đổi các thiết lập về thời gian, gán Kỹ thuật viên cụ thể hoặc chỉ định Phòng thực hiện cho một dịch vụ.

    ### Logic Flow:
    1. Xác thực ID của Booking và Item.
    2. Cập nhật các trường thông tin được cung cấp.
    3. Tự động tính toán lại thời gian kết thúc (`end_time`) dựa trên thời lượng chuẩn của dịch vụ.

    ### Lỗi có thể xảy ra:
    - `400 Bad Request`: Nếu thời gian mới bị xung đột với các lịch đã có.
    """
    return await service.update_item(booking_id, item_id, data)


@router.delete(
    "/{booking_id}/items/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_booking_item(
    booking_id: uuid.UUID,
    item_id: uuid.UUID,
    service: BookingService = Depends()
) -> None:
    """
    **Xóa một dịch vụ khỏi lịch hẹn.**

    Loại bỏ một hạng mục dịch vụ đã đặt. Không thể xóa nếu Booking đã ở trạng thái `COMPLETED`.
    """
    await service.delete_item(booking_id, item_id)


# ============================================================================
# STATUS TRANSITIONS
# ============================================================================

@router.patch("/{booking_id}/confirm", response_model=BookingRead)
async def confirm_booking(
    booking_id: uuid.UUID,
    service: BookingService = Depends()
) -> BookingRead:
    """
    **Xác nhận lịch đặt chỗ.**

    Chuyển trạng thái từ `PENDING` sang `CONFIRMED`. Đánh dấu rằng lễ tân đã liên lạc và chốt lịch với khách.
    """
    return await service.confirm(booking_id)


@router.patch("/{booking_id}/check-in", response_model=BookingRead)
async def check_in_booking(
    booking_id: uuid.UUID,
    data: BookingCheckIn | None = None,
    service: BookingService = Depends()
) -> BookingRead:
    """
    **Ghi nhận khách hàng đã đến (Check-in).**

    Thực hiện Check-in khi khách bước vào cơ sở. Trạng thái Booking sẽ chuyển sang `CHECKED_IN`.

    ### Tham số:
    - **check_in_time**: Thời gian thực tế khách đến (mặc định là [Now]).
    """
    check_in_time = data.check_in_time if data else None
    return await service.check_in(booking_id, check_in_time)


@router.patch("/{booking_id}/complete", response_model=BookingRead)
async def complete_booking(
    booking_id: uuid.UUID,
    data: BookingComplete | None = None,
    service: BookingService = Depends()
) -> BookingRead:
    """
    **Hoàn thành lịch hẹn.**

    Đánh dấu dịch vụ đã thực hiện xong. Chuyển trạng thái sang `COMPLETED`.

    ### Chú ý:
    - Đây là bước cuối cùng trong luồng nghiệp vụ trước khi thanh toán.
    """
    actual_end_time = data.actual_end_time if data else None
    return await service.complete(booking_id, actual_end_time)


@router.patch("/{booking_id}/cancel", response_model=BookingRead)
async def cancel_booking(
    booking_id: uuid.UUID,
    data: BookingCancel,
    service: BookingService = Depends()
) -> BookingRead:
    """
    **Hủy lịch đặt chỗ.**

    Chuyển trạng thái sang `CANCELLED`. Yêu cầu cung cấp lý do hủy để phục vụ thống kê.

    ### Tham số đầu vào:
    - **cancel_reason**: Lý do hủy lịch.
    """
    return await service.cancel(booking_id, data.cancel_reason)


@router.patch("/{booking_id}/no-show", response_model=BookingRead)
async def no_show_booking(
    booking_id: uuid.UUID,
    service: BookingService = Depends()
) -> BookingRead:
    """
    **Đánh dấu khách hàng bỏ hẹn (No-show).**

    Sử dụng khi khách đã được xác nhận nhưng không đến và không thông báo trước.
    """
    return await service.no_show(booking_id)


# ============================================================================
# CONFLICT CHECK APIs
# ============================================================================

@router.post("/check-conflicts", response_model=ConflictCheckResponse)
async def check_conflicts(
    data: ConflictCheckRequest,
    session: AsyncSession = Depends(get_db_session)
) -> ConflictCheckResponse:
    """
    **Kiểm tra xung đột tài nguyên/nhân sự.**

    Công cụ hỗ trợ lễ tân kiểm tra nhanh xem một khung giờ dự định đặt có bị trùng lịch với KTV hoặc Phòng nào không.

    ### Logic Flow:
    1. Kiểm tra lịch làm việc của KTV (`StaffSchedule`).
    2. Kiểm tra các `BookingItems` khác có chồng lấn thời gian hay không.
    3. Trả về danh sách các Item gây xung đột (nếu có).

    ### Tham số đầu vào:
    - **staff_id / resource_id**: Tài nguyên cần kiểm tra.
    - **start_time / end_time**: Khung giờ dự kiến.
    """
    checker = ConflictChecker(session)
    conflicts = await checker.check_all_conflicts(
        staff_id=data.staff_id,
        resource_ids=data.resource_ids,
        start_time=data.start_time,
        end_time=data.end_time,
        exclude_item_id=data.exclude_item_id,
        check_schedule=data.check_schedule
    )

    return ConflictCheckResponse(
        has_conflict=len(conflicts) > 0,
        conflicts=[c.model_dump() for c in conflicts]
    )


@router.get("/staff/{staff_id}/bookings", response_model=list[BookingItemRead])
async def get_staff_bookings(
    staff_id: uuid.UUID,
    work_date: date = Query(...),
    session: AsyncSession = Depends(get_db_session)
) -> list[BookingItemRead]:
    """
    **Lấy lịch làm việc chi tiết của một Kỹ thuật viên.**

    Truy vấn toàn bộ các hạng mục dịch vụ mà KTV này được phân công trong một ngày cụ thể.
    """
    checker = ConflictChecker(session)
    items = await checker.get_staff_bookings_on_date(staff_id, work_date)
    return items


@router.get("/resource/{resource_id}/bookings", response_model=list[BookingItemRead])
async def get_resource_bookings(
    resource_id: uuid.UUID,
    work_date: date = Query(...),
    session: AsyncSession = Depends(get_db_session)
) -> list[BookingItemRead]:
    """
    **Lấy lịch sử dụng của một Phòng/Máy.**

    Xem xem một tài nguyên vật lý đang bận vào những khung giờ nào trong ngày để sắp xếp lịch mới.
    """
    checker = ConflictChecker(session)
    items = await checker.get_resource_bookings_on_date(resource_id, work_date)
    return items


# ============================================================================
# TREATMENT NOTES
# ============================================================================

@router.post("/{booking_id}/notes", response_model=TreatmentNoteRead)
async def add_treatment_note(
    booking_id: uuid.UUID,
    data: TreatmentNoteCreate,
    service: BookingService = Depends(),
    token_payload: dict = Depends(get_token_payload)
) -> TreatmentNoteRead:
    """
    **Ghi chú chuyên môn sau buổi hẹn**

    Kỹ thuật viên ghi lại tình trạng da/tóc, phản ứng của khách sau dịch vụ
    để phục vụ tốt hơn cho các lần tiếp theo.

    ### Tham số:
    - **content**: Nội dung ghi chú (tối đa 1000 ký tự)
    - **note_type**: Loại ghi chú (PROFESSIONAL/GENERAL, mặc định PROFESSIONAL)

    ### Lưu ý:
    - Chỉ staff mới có thể tạo ghi chú
    - RLS đảm bảo staff chỉ thấy notes của họ
    """
    staff_id = uuid.UUID(token_payload["sub"])

    return await service.add_note(
        booking_id=booking_id,
        staff_id=staff_id,
        content=data.content,
        note_type=data.note_type
    )


@router.get("/{booking_id}/notes", response_model=list[TreatmentNoteRead])
async def get_booking_notes(
    booking_id: uuid.UUID,
    service: BookingService = Depends()
) -> list[TreatmentNoteRead]:
    """
    **Lấy danh sách ghi chú của booking**

    Hiển thị tất cả ghi chú chuyên môn đã được tạo cho booking này.
    """
    return await service.get_notes(booking_id)
