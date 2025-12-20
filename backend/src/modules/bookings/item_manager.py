"""
Booking Item Manager - Business Logic for Items
"""
import uuid
import json
from datetime import datetime, timezone
from decimal import Decimal
from fastapi import HTTPException, status
from sqlmodel import select, text
from sqlmodel.ext.asyncio.session import AsyncSession

from .models import Booking, BookingItem, BookingStatus
from .schemas import BookingItemCreate, BookingItemUpdate
from src.modules.services import Service

class BookingItemManager:
    """Quản lý các logic liên quan đến Booking Items."""

    def __init__(self, session: AsyncSession, conflict_checker, treatment_service):
        self.session = session
        self.conflict_checker = conflict_checker
        self.treatment_service = treatment_service

    async def add_item(self, booking: Booking, data: BookingItemCreate) -> BookingItem:
        """Thêm dịch vụ vào booking."""
        if booking.status not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Chỉ có thể thêm dịch vụ khi lịch hẹn ở trạng thái PENDING hoặc CONFIRMED"
            )

        # 1. Kiểm tra service
        service = await self.session.get(Service, data.service_id)
        if not service:
            raise HTTPException(status_code=404, detail="Không tìm thấy dịch vụ")

        # 2. Kiểm tra xung đột (Nếu có staff hoặc resources)
        if data.staff_id or data.resource_ids:
            conflicts = await self.conflict_checker.check_all_conflicts(
                staff_id=data.staff_id,
                resource_ids=data.resource_ids,
                start_time=data.start_time,
                end_time=data.end_time
            )
            if conflicts:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=conflicts[0].message
                )

        # 3. Kiểm tra liệu trình nếu có
        if data.treatment_id:
             await self.treatment_service.validate_availability(
                data.treatment_id, booking.customer_id
            )

        # 4. Tạo item
        item = BookingItem(
            booking_id=booking.id,
            service_id=data.service_id,
            staff_id=data.staff_id,
            treatment_id=data.treatment_id,
            service_name_snapshot=service.name,
            start_time=data.start_time,
            end_time=data.end_time,
            original_price=Decimal(str(service.price))
        )
        self.session.add(item)
        await self.session.flush()

        # 5. Gán resources
        if data.resource_ids:
            from .models import BookingItemResource
            for rid in data.resource_ids:
                bir = BookingItemResource(booking_item_id=item.id, resource_id=rid)
                self.session.add(bir)

        # 6. Cập nhật booking tổng quát
        booking.total_price += item.original_price
        if item.start_time < booking.start_time:
            booking.start_time = item.start_time
        if item.end_time > booking.end_time:
            booking.end_time = item.end_time
        booking.updated_at = datetime.now(timezone.utc)

        return item

    async def update_item(self, booking: Booking, item: BookingItem, data: BookingItemUpdate) -> BookingItem:
        """Cập nhật item."""
        if booking.status not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Không thể cập nhật ở trạng thái này"
            )

        update_data = data.model_dump(exclude_unset=True)

        # New values for conflict checking
        new_staff_id = update_data.get("staff_id", item.staff_id)
        should_update_resources = "resource_ids" in update_data

        if should_update_resources:
            new_resource_ids = update_data.get("resource_ids")
        else:
            # Fetch current resource IDs
            from .models import BookingItemResource
            res_links = await self.session.exec(select(BookingItemResource).where(BookingItemResource.booking_item_id == item.id))
            new_resource_ids = [r.resource_id for r in res_links.all()]

        new_start = update_data.get("start_time", item.start_time)
        new_end = update_data.get("end_time", item.end_time)

        # Validate treatment
        if "treatment_id" in update_data:
            new_tid = update_data["treatment_id"]
            if new_tid and new_tid != item.treatment_id:
                await self.treatment_service.validate_availability(new_tid, booking.customer_id)

        # Check conflicts
        conflicts = await self.conflict_checker.check_all_conflicts(
            staff_id=new_staff_id,
            resource_ids=new_resource_ids,
            start_time=new_start,
            end_time=new_end,
            exclude_item_id=item.id
        )
        if conflicts:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=conflicts[0].message)

        # Apply basic updates
        for key, value in update_data.items():
            if key != "resource_ids":
                setattr(item, key, value)

        # Update resources if needed
        if should_update_resources:
            from .models import BookingItemResource
            await self.session.exec(text("DELETE FROM booking_item_resources WHERE booking_item_id = :iid"), {"iid": item.id})
            if new_resource_ids:
                for rid in new_resource_ids:
                    self.session.add(BookingItemResource(booking_item_id=item.id, resource_id=rid))

        return item

    async def delete_item(self, booking: Booking, item: BookingItem) -> bool:
        """Xóa item."""
        if booking.status not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Không thể xóa ở trạng thái này"
            )

        booking.total_price -= item.original_price
        booking.updated_at = datetime.now(timezone.utc)

        await self.session.delete(item)
        return True
