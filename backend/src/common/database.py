from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from src.app.config import settings



# Sử dụng QueuePool để quản lý kết nối hiệu quả, tránh mở quá nhiều kết nối cùng lúc
# Giới hạn pool_size=2 để phù hợp với giới hạn của Supabase (Free Tier thường là 60-100, nhưng an toàn là 10-20 cho mỗi instance)
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.ECHO_SQL, # Đặt False khi chạy production
    future=True,
    pool_size=2, # Giảm xuống mức tối thiểu để tránh lỗi MaxClients
    max_overflow=0,
    pool_timeout=30, # Tăng thời gian chờ kết nối lên 30s
    pool_pre_ping=True,
    connect_args={
        "statement_cache_size": 0, # Tắt prepared statements để tương thích với Supabase Transaction Mode (Port 6543)
    }
)

# Tạo Async Session Factory
async_session_factory = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

