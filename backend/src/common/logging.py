"""
Shared Kernel - Structured Logging Utilities
"""
import logging
import json
import uuid
import time
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
    """Cấu hình logging cho ứng dụng."""
    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())

    logger = logging.getLogger("synapse")
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)
    # Loại bỏ propagation để tránh double log nếu root logger cũng có handler
    logger.propagate = False
    return logger

# Khởi tạo logger chính
logger = setup_logging()
