"""
Customers Module - Service Layer
"""
import uuid
from datetime import datetime, timezone
from sqlmodel import select, col, or_, func
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends

from src.common.database import get_db_session
from .models import Customer
from .schemas import CustomerCreate, CustomerUpdate, CustomerFilter, CustomerListResponse
from .exceptions import CustomerNotFound, CustomerAlreadyExists

class CustomerService:
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_all(self, filter_params: CustomerFilter, page: int = 1, limit: int = 10) -> CustomerListResponse:
        # Base query: ignore deleted items
        query = select(Customer).where(Customer.deleted_at is None)

        # Filtering
        if filter_params.search:
            search_term = f"%{filter_params.search}%"
            query = query.where(
                or_(
                    col(Customer.full_name).ilike(search_term),
                    col(Customer.email).ilike(search_term),
                    col(Customer.phone_number).ilike(search_term),
                )
            )

        if filter_params.membership_tier:
            query = query.where(Customer.membership_tier == filter_params.membership_tier)

        # Count query
        count_query = select(func.count()).select_from(Customer).where(Customer.deleted_at is None)

        if filter_params.search:
             search_term = f"%{filter_params.search}%"
             count_query = count_query.where(
                or_(
                    col(Customer.full_name).ilike(search_term),
                    col(Customer.email).ilike(search_term),
                    col(Customer.phone_number).ilike(search_term),
                )
            )
        if filter_params.membership_tier:
            count_query = count_query.where(Customer.membership_tier == filter_params.membership_tier)

        total = (await self.session.exec(count_query)).one()

        # Pagination
        query = query.order_by(col(Customer.created_at).desc())
        query = query.offset((page - 1) * limit).limit(limit)

        result = await self.session.exec(query)
        customers = result.all()

        return CustomerListResponse(
            data=list(customers),
            total=total,
            page=page,
            limit=limit
        )

    async def get_by_id(self, customer_id: uuid.UUID) -> Customer:
        query = select(Customer).where(Customer.id == customer_id, Customer.deleted_at is None)
        result = await self.session.exec(query)
        customer = result.first()
        if not customer:
            raise CustomerNotFound(f"Customer with ID {customer_id} not found")
        return customer

    async def get_by_phone(self, phone: str) -> Customer | None:
        query = select(Customer).where(Customer.phone_number == phone, Customer.deleted_at is None)
        result = await self.session.exec(query)
        return result.first()

    async def get_by_user_id(self, user_id: uuid.UUID) -> Customer | None:
        """Tìm profile khách hàng dựa trên user_id đăng nhập."""
        query = select(Customer).where(Customer.user_id == user_id, Customer.deleted_at is None)
        result = await self.session.exec(query)
        return result.first()

    async def create(self, data: CustomerCreate) -> Customer:
        # Check duplicate phone
        existing = await self.get_by_phone(data.phone_number)
        if existing:
            raise CustomerAlreadyExists(f"Customer with phone {data.phone_number} already exists")

        customer = Customer.model_validate(data)
        self.session.add(customer)
        await self.session.commit()
        await self.session.refresh(customer)
        return customer

    async def update(self, customer_id: uuid.UUID, data: CustomerUpdate) -> Customer:
        customer = await self.get_by_id(customer_id)

        # Check duplicate phone if updating phone
        if data.phone_number and data.phone_number != customer.phone_number:
            existing = await self.get_by_phone(data.phone_number)
            if existing:
                 raise CustomerAlreadyExists(f"Customer with phone {data.phone_number} already exists")

        customer_data = data.model_dump(exclude_unset=True)
        for key, value in customer_data.items():
            setattr(customer, key, value)

        customer.updated_at = datetime.now(timezone.utc)

        self.session.add(customer)
        await self.session.commit()
        await self.session.refresh(customer)
        return customer

    async def link_account(self, customer_id: uuid.UUID, user_id: uuid.UUID) -> Customer:
        customer = await self.get_by_id(customer_id)

        # Check integrity: user_id unique
        query = select(Customer).where(Customer.user_id == user_id, Customer.deleted_at is None)
        existing = (await self.session.exec(query)).first()
        if existing and existing.id != customer_id:
             raise CustomerAlreadyExists(f"User ID {user_id} is already linked to another customer")

        customer.user_id = user_id
        customer.updated_at = datetime.now(timezone.utc)

        self.session.add(customer)
        await self.session.commit()
        await self.session.refresh(customer)
        return customer

    async def delete(self, customer_id: uuid.UUID) -> None:
        customer = await self.get_by_id(customer_id)
        # Soft delete
        customer.deleted_at = datetime.now(timezone.utc)
        self.session.add(customer)
        await self.session.commit()

    async def sync_or_create_from_user(
        self,
        user_id: uuid.UUID,
        phone_number: str,
        full_name: str | None = None,
        email: str | None = None
    ) -> Customer:
        """
        Đồng bộ hoặc tạo mới Customer profile từ App User.

        Logic:
        - Nếu SĐT đã tồn tại (khách vãng lai) → Link user_id vào customer đó
        - Nếu SĐT mới → Tạo Customer mới với user_id

        Args:
            user_id: ID của User trong bảng users
            phone_number: Số điện thoại để match/tạo Customer
            full_name: Tên hiển thị (lấy từ User nếu có)
            email: Email (lấy từ User nếu có)

        Returns:
            Customer: Record Customer đã được link hoặc tạo mới
        """
        existing = await self.get_by_phone(phone_number)

        if existing:
            # Khách vãng lai đã có trong CRM → Link account nếu chưa có user_id
            if not existing.user_id:
                existing.user_id = user_id
                existing.updated_at = datetime.now(timezone.utc)
                self.session.add(existing)
                await self.session.commit()
                await self.session.refresh(existing)
            return existing

        # Khách mới → Tạo Customer profile
        customer = Customer(
            phone_number=phone_number,
            full_name=full_name or "Khách App",
            email=email,
            user_id=user_id
        )
        self.session.add(customer)
        await self.session.commit()
        await self.session.refresh(customer)
        return customer
