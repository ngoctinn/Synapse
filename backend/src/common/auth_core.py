from typing import Annotated, Any
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.app.config import settings

security = HTTPBearer(auto_error=False)

def get_token_payload(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)]
) -> dict[str, Any]:
    """Giải mã và xác thực JWT token. Yêu cầu bắt buộc có token."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Yêu cầu xác thực tài khoản",
        )
    return _decode_token(credentials.credentials)

def get_token_payload_optional(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)]
) -> dict[str, Any] | None:
    """Giải mã và xác thực JWT token. Trả về None nếu không có token."""
    if not credentials:
        return None
    try:
        return _decode_token(credentials.credentials)
    except HTTPException:
        return None

def _decode_token(token: str) -> dict[str, Any]:
    """Helper để giải mã JWT."""
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            audience=settings.JWT_AUDIENCE,
            leeway=60
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token đã hết hạn. Vui lòng đăng nhập lại.",
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Không thể xác thực thông tin đăng nhập",
        )

def check_is_manager(token_payload: dict[str, Any]) -> None:
    """Kiểm tra xem user có quyền Quản lý (Manager) không."""
    # Ưu tiên lấy role từ top-level (nếu có custom claims)
    role = token_payload.get("role")

    # Nếu role là 'authenticated' (mặc định của Supabase), kiểm tra trong user_metadata
    if role == "authenticated":
        user_metadata = token_payload.get("user_metadata", {})
        role = user_metadata.get("role")

    if role != "manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện hành động này",
        )
