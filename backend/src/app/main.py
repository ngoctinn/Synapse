from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager
from src.common.database import engine

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

# Import và đăng ký routers
from src.app.config import settings
from src.modules.users.router import router as users_router
from src.modules.services.router import router as services_router
from src.modules.staff.router import router as staff_router
from src.modules.resources.router import router as resources_router
from src.modules.schedules.router import router as schedules_router
from src.modules.bookings.router import router as bookings_router
from src.modules.scheduling.router import router as scheduling_router

app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(services_router, prefix=settings.API_V1_STR)
app.include_router(staff_router, prefix=settings.API_V1_STR)
app.include_router(resources_router, prefix=settings.API_V1_STR)
app.include_router(schedules_router, prefix=settings.API_V1_STR)
app.include_router(bookings_router, prefix=settings.API_V1_STR)
app.include_router(scheduling_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Chào mừng đến với Synapse API"}
