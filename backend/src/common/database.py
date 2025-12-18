"""
Common Module - Database Configuration

Quản lý kết nối Database, Async Engine và cơ chế RLS Context Injection.
"""

from typing import AsyncGenerator, Annotated
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends
from src.app.config import settings
from src.common.auth_core import get_token_payload
import json


# Cấu hình QueuePool: pool_size=2 (tối ưu cho Supabase Free Tier), timeout=30s
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.ECHO_SQL,
    future=True,
    pool_size=2,
    max_overflow=0,
    pool_timeout=30,
    pool_pre_ping=True,
    connect_args={"statement_cache_size": 0}
)

# Async Session Factory
async_session_factory = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_db_session(
    token_payload: Annotated[dict, Depends(get_token_payload)]
) -> AsyncGenerator[AsyncSession, None]:
    """
    Cung cấp DB session với RLS context (request.jwt.claims) đã được inject.

    Logic:
    1. Chuyển role sang 'authenticated' (quyền hạn chế).
    2. Inject thông tin user vào cấu hình Postgres.

    Args:
        token_payload (dict): Payload từ JWT token (chứa claims).

    Yields:
        AsyncSession: Session database an toàn.
    """
    # Import local để tránh circular dependency (nếu cần thiết trong tương lai)

    async with async_session_factory() as session:
        try:
            # 1. Chuyển role sang 'authenticated' (quyền hạn chế)
            await session.exec(text("SET LOCAL role TO 'authenticated';"))

            # 2. Inject thông tin user vào cấu hình Postgres
            # Supabase sử dụng request.jwt.claims để kiểm tra policies
            claims_json = json.dumps(token_payload)
            await session.exec(
                text("SELECT set_config('request.jwt.claims', :claims, true)"),
                params={"claims": claims_json}
            )

            yield session
        finally:
            await session.close()

