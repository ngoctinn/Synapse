#!/bin/bash

# Màu sắc cho log
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Khởi động Synapse Development Environment...${NC}"

# Hàm cleanup để tắt các process con khi script bị dừng (Ctrl+C)
cleanup() {
    echo -e "\n${BLUE}🛑 Đang dừng các services...${NC}"
    kill $(jobs -p) 2>/dev/null
}
trap cleanup EXIT SIGINT

# 1. Chạy Backend
(
    echo -e "${GREEN}[Backend] 🛠️  Checking environment...${NC}"
    cd backend

    # Tạo venv nếu chưa có
    if [ ! -d "venv" ]; then
        echo -e "${GREEN}[Backend] Creating venv...${NC}"
        python -m venv venv
    fi

    source venv/Scripts/activate

    # Cài đặt dependencies (tự động bỏ qua nếu đã thỏa mãn)
    # echo -e "${GREEN}[Backend] Installing dependencies...${NC}"
    # pip install -q -r requirements.txt

    echo -e "${GREEN}[Backend] ▶️  Starting Uvicorn...${NC}"
    uvicorn src.app.main:app --reload
) &

# 2. Chạy Frontend
(
    echo -e "${GREEN}[Frontend] 🛠️  Checking environment...${NC}"
    cd frontend

    # Cài đặt dependencies (tự động bỏ qua nếu đã thỏa mãn)
    # echo -e "${GREEN}[Frontend] Installing dependencies...${NC}"
    # pnpm i --silent

    echo -e "${GREEN}[Frontend] ▶️  Starting Next.js...${NC}"
    pnpm dev
) &

# Chờ cả 2 process chạy
wait
