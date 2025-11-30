from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Synapse API",
    description="Backend API for Synapse CRM",
    version="0.1.0",
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
        content={"message": "Hệ thống đang bận", "details": str(exc)}
    )

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend Synapse đang hoạt động"}

from src.app.config import settings
from src.modules.users.router import router as users_router
from src.modules.services.router import router as services_router

app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(services_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Chào mừng đến với Synapse API"}
