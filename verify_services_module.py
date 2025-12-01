import sys
import os

# Add backend to sys.path
sys.path.append(os.path.abspath("backend"))

# Mock env vars
os.environ["SUPABASE_URL"] = "https://example.supabase.co"
os.environ["SUPABASE_KEY"] = "mock_key"
os.environ["SUPABASE_SERVICE_ROLE_KEY"] = "mock_service_role_key"
os.environ["DATABASE_URL"] = "postgresql+asyncpg://user:pass@localhost/db"
os.environ["SECRET_KEY"] = "mock_secret"
os.environ["ALGORITHM"] = "HS256"
os.environ["SUPABASE_JWT_SECRET"] = "mock_jwt_secret"


try:
    from src.modules.services.router import router
    from src.modules.services.service import ServiceManagementService
    from src.modules.services.exceptions import ServiceError
    print("Verification Successful: Module imported correctly.")
except Exception as e:
    print(f"Verification Failed: {e}")
    sys.exit(1)
