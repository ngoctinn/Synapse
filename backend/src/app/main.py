from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.common.database import engine
from src.app.config import settings
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
    notifications
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": "Hệ thống đang bận"}
    )

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend Synapse đang hoạt động"}

# Đăng ký routers
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(services.router, prefix=settings.API_V1_STR)
app.include_router(staff.router, prefix=settings.API_V1_STR)
app.include_router(resources.router, prefix=settings.API_V1_STR)
app.include_router(schedules.router, prefix=settings.API_V1_STR)
app.include_router(bookings.router, prefix=settings.API_V1_STR)
app.include_router(customers.router, prefix=settings.API_V1_STR)
app.include_router(scheduling_engine.router, prefix=settings.API_V1_STR)
app.include_router(customer_treatments.router, prefix=settings.API_V1_STR)
app.include_router(billing.router, prefix=settings.API_V1_STR)
app.include_router(operating_hours.router, prefix=settings.API_V1_STR)
app.include_router(promotions.router, prefix=settings.API_V1_STR)
app.include_router(waitlist.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Chào mừng đến với Synapse API"}
