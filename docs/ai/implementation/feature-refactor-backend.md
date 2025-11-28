---
phase: implementation
title: Hướng dẫn Triển khai Refactor Backend
description: Hướng dẫn chi tiết về mã nguồn cho việc refactor
---

# Hướng dẫn Triển khai

## Cấu trúc Mã
**Mã được tổ chức như thế nào?**

```
src/
├── app/
│   ├── dependencies.py  # [NEW] RLS Injection
│   └── main.py          # [MOD] Exception Handler
├── common/
│   ├── database.py      # [MOD] Async Engine only
│   └── security.py      # [MOD] Auth logic
└── modules/
    └── users/
        ├── service.py   # [NEW] Business Logic
        ├── router.py    # [MOD] Controller
        ├── models.py    # [MOD] Fix datetime
        └── schemas.py   # [MOD] ConfigDict
```

## Ghi chú Triển khai
**Các chi tiết kỹ thuật chính cần nhớ:**

### RLS Injection (`src/app/dependencies.py`)
```python
async def get_db_session(
    user_claims: dict = Depends(get_current_user_claims)
) -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            await session.exec(text("SET LOCAL role TO 'authenticated';"))
            # Inject claims...
            yield session
        finally:
            await session.close()
```

### Service Pattern (`src/modules/users/service.py`)
```python
class UserService:
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def get_profile(self, user_id: uuid.UUID) -> User:
        # Logic...
```

### Exception Handler (`src/app/main.py`)
```python
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": "Hệ thống đang bận", "details": str(exc)}
    )
```

## Điểm Tích hợp
**Các mảnh ghép kết nối như thế nào?**

- Router nhận `UserService` từ Dependency Injection system của FastAPI.
- `UserService` nhận `AsyncSession` từ `get_db_session`.
