"""
Application Layer - Middleware
"""
import uuid
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from src.common.logging import logger, request_id_ctx_var

class ObservabilityMiddleware(BaseHTTPMiddleware):
    """Middleware xử lý Request ID và Logging hiệu năng."""

    async def dispatch(self, request: Request, call_next):
        # 1. Tạo hoặc lấy Request ID từ Header
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

        # 2. Tokenize vào context var cho luồng này
        token = request_id_ctx_var.set(request_id)

        start_time = time.time()

        try:
            response = await call_next(request)
            process_time = time.time() - start_time

            # 3. Log thông tin request thành công
            logger.info(
                f"{request.method} {request.url.path} - {response.status_code}",
                extra={
                    "extra_info": {
                        "method": request.method,
                        "path": request.url.path,
                        "status_code": response.status_code,
                        "duration": round(process_time, 4),
                        "client_ip": request.client.host if request.client else "unknown"
                    }
                }
            )

            # 4. Đính kèm Request ID vào Response Header để client dễ debug
            response.headers["X-Request-ID"] = request_id
            return response

        except Exception as e:
            process_time = time.time() - start_time
            logger.error(
                f"Request failed: {request.method} {request.url.path}",
                extra={
                    "extra_info": {
                        "method": request.method,
                        "path": request.url.path,
                        "duration": round(process_time, 4),
                        "error": str(e)
                    }
                },
                exc_info=True
            )
            raise e
        finally:
            # Revert context var
            request_id_ctx_var.reset(token)
