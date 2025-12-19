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
        query = select(Customer).where(Customer.deleted_at == None)

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
        count_query = select(func.count()).select_from(Customer).where(Customer.deleted_at == None)

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
        query = select(Customer).where(Customer.id == customer_id, Customer.deleted_at == None)
        result = await self.session.exec(query)
        customer = result.first()
        if not customer:
            raise CustomerNotFound(f"Customer with ID {customer_id} not found")
        return customer

    async def get_by_phone(self, phone: str) -> Customer | None:
        query = select(Customer).where(Customer.phone_number == phone, Customer.deleted_at == None)
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
        query = select(Customer).where(Customer.user_id == user_id, Customer.deleted_at == None)
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
