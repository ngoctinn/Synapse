from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.common.database import engine
from src.app.config import settings
from src.app.middleware import ObservabilityMiddleware
# Import các modules (Sử dụng Public API - __init__.py)
from src.modules import (
    users,
    services,
    staff,
    resources,
    schedules,
    bookings,
    customers,
    scheduling_engine,
    customer_treatments,
    billing,
    operating_hours,
    promotions,
    waitlist,
    notifications,
    warranty,
    chat,
    settings as settings_module,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()

app = FastAPI(
    title="Synapse API",
    description="Backend API for Synapse CRM",
    version="0.1.0",
    lifespan=lifespan,
)

# Cấu hình CORS
origins = [
    "http://localhost:3000",  # Frontend
]

app.add_middleware(ObservabilityMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    from src.common.logging import logger
    logger.error(f"Global Exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Hệ thống đang bận"}
    )

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend Synapse đang hoạt động"}

# Đăng ký routers tự động từ các modules
# Danh sách các module cần đăng ký router
_MODULES_WITH_ROUTERS = [
    users, services, staff, resources, schedules, bookings, customers,
    scheduling_engine, customer_treatments, billing, operating_hours,
    promotions, waitlist, notifications, warranty, chat, settings_module
]

for module in _MODULES_WITH_ROUTERS:
    if hasattr(module, "router"):
        app.include_router(module.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Chào mừng đến với Synapse API"}
