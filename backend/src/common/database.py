from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from src.app.config import settings

# Tạo Async Engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True, # Đặt False khi chạy production
    future=True,
    pool_size=5,
    max_overflow=0,
    pool_pre_ping=True
)

# Tạo Async Session Factory
async_session_factory = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

