
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, computed_field

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Synapse CRM"

    # CORS
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []

    # Database
    ECHO_SQL: bool = False
    DATABASE_URL: str

    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_JWT_SECRET: str
    SUPABASE_SERVICE_ROLE_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore"
    )

settings = Settings()
