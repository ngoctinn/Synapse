import asyncio
import sys
import os

# Add current directory to path to find src
sys.path.append(os.getcwd())

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from src.app.config import settings

async def check_connection():
    # Mask password for safety in logs
    safe_url = settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else "..."
    print(f"Testing connection to: ...@{safe_url}")

    try:
        engine = create_async_engine(settings.DATABASE_URL, echo=False)
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            print("Connection successful!")
            print(f"Result: {result.scalar()}")
    except Exception as e:
        print(f"Connection failed: {e}")
        # import traceback
        # traceback.print_exc()

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(check_connection())
