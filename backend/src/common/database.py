from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from src.app.config import settings

from sqlalchemy.pool import NullPool

# Tạo Async Engine
# Sử dụng NullPool để tránh lỗi "Max clients reached" khi chạy uvicorn --reload (Hot Reload)
# NullPool sẽ đóng kết nối ngay sau khi sử dụng, không giữ lại trong pool.
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True, # Đặt False khi chạy production
    future=True,
    poolclass=NullPool,
    # pool_size=5, # Đã thay bằng NullPool
    # max_overflow=0,
    # pool_pre_ping=True
)

# Tạo Async Session Factory
async_session_factory = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

