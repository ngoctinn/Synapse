import asyncio
import os
import sys
from alembic.config import Config
from alembic import command

# Add current directory to sys.path
sys.path.append(os.getcwd())

def run_upgrade():
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")

if __name__ == "__main__":
    run_upgrade()
