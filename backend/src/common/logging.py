"""
Shared Kernel - Structured Logging Utilities
"""
import logging
import json
from datetime import datetime, timezone
from contextvars import ContextVar

# Biến context để lưu request_id xuyên suốt luồng xử lý của 1 request
request_id_ctx_var: ContextVar[str] = ContextVar("request_id", default="")

class JSONFormatter(logging.Formatter):
    """Formatter chuyển log thành định dạng JSON để dễ dàng thu thập (ELK, Seq, v.v.)"""
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "request_id": request_id_ctx_var.get(),
        }
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)

        # Thêm các extra fields nếu có
        if hasattr(record, "extra_info"):
            log_entry.update(record.extra_info)

        return json.dumps(log_entry, ensure_ascii=False)

def setup_logging():
    """Cấu hình logging cho ứng dụng.

    Áp dụng JSONFormatter cho Root Logger để đảm bảo toàn bộ hệ thống
    (bao gồm uvicorn, sqlalchemy, httpx) đều xuất log JSON.
    """
    json_handler = logging.StreamHandler()
    json_handler.setFormatter(JSONFormatter())

    # Cấu hình Root Logger để bắt mọi log từ thư viện bên ngoài
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    # Xóa các handler cũ (nếu có) để tránh duplicate
    root_logger.handlers.clear()
    root_logger.addHandler(json_handler)

    # Giảm bớt log từ các thư viện quá verbose
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)

    # Tạo và trả về logger riêng cho application code
    app_logger = logging.getLogger("synapse")
    app_logger.setLevel(logging.INFO)
    return app_logger

# Khởi tạo logger chính
logger = setup_logging()
