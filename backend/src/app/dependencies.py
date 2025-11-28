import json
from typing import AsyncGenerator, Annotated
from fastapi import Depends
from sqlalchemy import text
from sqlmodel.ext.asyncio.session import AsyncSession
from src.common.database import async_session_factory
from src.common.auth_core import get_token_payload

async def get_db_session(
    token_payload: Annotated[dict, Depends(get_token_payload)]
) -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency cung cấp database session với RLS context đã được inject.
    Đảm bảo mọi truy vấn trong session này đều bị giới hạn phạm vi theo người dùng đã xác thực.
    """
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
