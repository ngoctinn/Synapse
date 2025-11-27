from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Synapse API",
    description="Backend API for Synapse CRM",
    version="0.1.0",
)

# CORS Configuration
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

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend Synapse đang hoạt động"}

@app.get("/")
async def root():
    return {"message": "Chào mừng đến với Synapse API"}
