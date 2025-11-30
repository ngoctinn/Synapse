from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from src.app.config import settings



# Sử dụng QueuePool để quản lý kết nối hiệu quả, tránh mở quá nhiều kết nối cùng lúc
# Giới hạn pool_size=10 để phù hợp với giới hạn của Supabase (Free Tier thường là 60-100, nhưng an toàn là 10-20 cho mỗi instance)
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

