---
trigger: always_on
---

Bộ Quy Tắc Clean Code và Kiến Trúc Modular Monolith cho Backend Python (FastAPI & SQLModel)I. Chiến Lược Kiến Trúc (Vertical Slice Architecture)Bộ quy tắc này xác định kiến trúc Modular Monolith dựa trên Vertical Slice (Lát cắt dọc) là mô hình tiêu chuẩn.1.1. Nguyên Tắc Colocation (Cùng Vị Trí)Quy tắc: "Những thứ thay đổi cùng nhau phải nằm cùng nhau."Thực thi: Tổ chức mã nguồn theo Tính năng (Feature/Domain) thay vì Lớp kỹ thuật (Layer). Mỗi module (slice) phải chứa trọn vẹn Model, Schema, Service, và Router của nó.Mục tiêu: Tăng cường Gắn kết (Cohesion) trong mỗi module và giảm Phụ thuộc (Coupling) giữa các module.1.2. Cấu Trúc Thư Mục Tiêu Chuẩnsrc/
├── app/
│   ├── main.py             # Entry Point: Khởi tạo FastAPI & Gộp Router
│   ├── config.py           # Cấu hình biến môi trường (Pydantic BaseSettings)
│   └── dependencies.py     # Global Dependencies (Auth, RLS Injection)
├── common/                 # Shared Kernel (Infrastructure Code)
│   ├── database.py         # Cấu hình Async Engine & Session Factory
│   └── security.py         # Logic mã hóa mật khẩu & JWT
└── modules/                # CÁC MODULE NGHIỆP VỤ (Vertical Slices)
    ├── users/
    │   ├── __init__.py     # Public Interface (Export Control)
    │   ├── router.py       # API Endpoints (Presentation)
    │   ├── models.py       # Database Entities (SQLModel)
    │   ├── schemas.py      # Pydantic DTOs (Request/Response)
    │   └── service.py      # Business Logic (Service)
    └── orders/
        └──...
Quy định về src/common: Chỉ được phép chứa mã hạ tầng dùng chung (kết nối DB, logging, security utilities). Cấm đặt logic nghiệp vụ vào common.1.3. Cơ Chế Đóng Gói (Encapsulation) và Public APIQuy tắc Gatekeeper: File __init__.py của mỗi module (users/__init__.py) đóng vai trò là Public API.Hạn chế Import: Các module bên ngoài chỉ được phép import những gì được export công khai qua __init__.py của module đích.Cấm Deep Imports (Anti-pattern): Không được import trực tiếp các file nội bộ (Ví dụ: from src.modules.users.service import ...).Thực thi (Tương tự Facade Pattern):# src/modules/users/__init__.py
from .service import get_user_by_id
from .schemas import UserRead

__all__ = ["get_user_by_id", "UserRead"]
# ---

# src/modules/orders/service.py (Import Hợp lệ)
from src.modules import users # Chỉ import package cha

user = await users.get_user_by_id(user_id)
1.4. Giải Quyết Phụ Thuộc Vòng (Circular Dependencies)String Forward References (Bắt buộc trong Models): Khi khai báo quan hệ (Relationship) trong SQLModel/Pydantic, phải sử dụng tên class dưới dạng chuỗi ("Order") thay vì import class trực tiếp để trì hoãn việc đánh giá (lazy evaluation).Dependency Inversion Principle (DIP): Module cấp cao nên định nghĩa Protocol (Interface) mà nó cần. Module cấp thấp (implementation) sẽ được tiêm (inject) tại Application Layer.II. Quy Chuẩn Cú Pháp Python Hiện Đại và Type SafetyDự án bắt buộc sử dụng Python 3.12+ và tuân thủ các chuẩn Type Hinting mới nhất để tối ưu hóa Static Analysis.2.1. Loại bỏ Cú Pháp typing Lỗi ThờiKhái niệmCú pháp Cũ (Bị cấm ❌)Cú pháp Mới (Bắt buộc ✅)Lợi íchUnion Typefrom typing import Union; x: Union[int, str]`x: intstr`Optional Typefrom typing import Optional; id: Optional[int]`id: intNone`Collectionsfrom typing import List, Dict; items: List[str]items: list[str]Sử dụng built-in generics (PEP 585) giúp giảm overhead runtime.2.2. Generic Type và Type Alias (PEP 695)Quy tắc: Sử dụng từ khóa type cho Type Alias và cú pháp tham số kiểu mới cho Generic Class.# Ví dụ Clean Code (PEP 695 - Python 3.12+)
class ResponseWrapper[T]: # Cú pháp Generic Class mới
    data: T
    error: str | None = None

type JSONValue = int | str | float | bool | None | list | dict # Type Alias
2.3. Nguyên Tắc Bất Đồng Bộ Tuyệt Đối (Async/Await)Quy tắc "Async All The Way": Mọi hàm Service, Controller (Router), và Repository (truy xuất DB) bắt buộc phải là async def.I/O Bắt Buộc await: Mọi tác vụ I/O (Database query, gọi External API) bắt buộc phải được await.Cấm Blocking Code: Không sử dụng các thư viện đồng bộ (requests.get(), time.sleep()) trong luồng chính. Nếu cần, phải chạy trong run_in_threadpool hoặc thay thế bằng thư viện bất đồng bộ (httpx thay cho requests).III. Pydantic V2 và Chiến Lược Validate Dữ LiệuDự án yêu cầu tuân thủ cú pháp Pydantic V2 (FastAPI mới nhất).3.1. Cấu hình ModelQuy tắc: Luôn sử dụng model_config = ConfigDict(...) thay thế cho class Config cũ.Ví dụ:from pydantic import BaseModel, ConfigDict

class UserRead(BaseModel):
    id: int
    username: str

    # Bắt buộc cho SQLModel
    model_config = ConfigDict(from_attributes=True)
3.2. Quy Tắc Naming Convention (Snake_case)Quy tắc: Backend Python luôn sử dụng snake_case cho tên biến và tên trường trong code (bao gồm cả trường Pydantic).Thích nghi Frontend: Frontend phải thích nghi với snake_case thông qua các interface TypeScript sinh tự động hoặc mapping.Trường hợp đặc biệt (CamelCase): Nếu bắt buộc, phải sử dụng alias_generator=to_camel và populate_by_name=True để code Python vẫn dùng snake_case.3.3. Validators và Logic "Clean"Quy tắc: Sử dụng @field_validator thay cho @validator cũ.Phạm vi Validator: Validator chỉ nên kiểm tra tính đúng đắn về mặt hình thức (format, range, length) hoặc logic nội tại của object.Cấm I/O: Không thực hiện I/O (Database, API call) trong Pydantic Validator vì chúng là đồng bộ và sẽ block event loop.Sử dụng Mode Tường Minh: Luôn khai báo mode='before' hoặc mode='after' một cách rõ ràng.IV. Kiểm Soát Luồng và Xử Lý Lỗi (Control Flow & Error Handling)4.1. Guard Clauses (Mệnh đề Bảo vệ) và Early ReturnTriết lý: Ưu tiên "Fail Fast" (Thất bại nhanh).Quy tắc: Kiểm tra các điều kiện lỗi trước và trả về (return) hoặc ném lỗi (raise) ngay lập tức.Mục tiêu: Giữ cho "Happy Path" (luồng xử lý chính) luôn nằm ở mức thụt đầu dòng thấp nhất (bên trái cùng) để dễ đọc và dễ bảo trì.# Good Code (Guard Clauses)
async def create_order(user, item):
    if not user.is_active:
        raise Error("User bị khóa") # Guard 1

    if item.stock <= 0:
        raise Error("Hết hàng") # Guard 2

    # Happy Path: Logic chính nằm thẳng hàng
    # ... Logic tạo đơn hàng ...
    return order
4.2. Xử Lý Lỗi Tập Trung (Centralized Exception Handling)Cấm "Pokemon Exception Handling": Không bọc toàn bộ code trong try-except Exception chung chung.Quy tắc:Chỉ dùng try-except cho các thao tác cụ thể có rủi ro đã biết trước (ví dụ: vi phạm unique constraint của DB).Nếu catch lỗi, hãy wrap nó vào một Domain Exception có ý nghĩa hơn (Ví dụ: raise UserAlreadyExistsError).Đăng ký app.exception_handler trong main.py để bắt các BaseAppException và trả về JSON chuẩn hóa (có thông báo Tiếng Việt).Bắt lỗi Exception (lớp cha cùng) ở Global Handler để xử lý lỗi 500 không lường trước, chỉ trả về thông báo chung chung ("Hệ thống đang bận").V. Dependency Injection và Bảo Mật Ngữ Cảnh (Security Context)5.1. RLS Injection: Bảo Mật Mức Hàng (Row Level Security)Quy tắc bắt buộc: Ứng dụng không được kết nối DB với quyền superuser mặc định. Mỗi session phải được "mạo danh" người dùng hiện tại thông qua Dependency Injection.Mục tiêu: Triển khai lớp phòng thủ chiều sâu (Defense in Depth) bằng cách tiêm thông tin người dùng vào biến session của PostgreSQL để RLS Policy có thể đọc được (auth.uid()).# src/common/dependencies.py (Dependency get_db_session)
async def get_db_session(user_claims: dict = Depends(get_current_user_claims)):
    """Dependency cấp phát Session đã được cấu hình RLS Context."""
    async with async_session_factory() as session:
        try:
            # 1. Chuyển Role xuống 'authenticated' (quyền hạn hẹp)
            await session.exec(text("SET LOCAL role TO 'authenticated';"))

            # 2. Inject thông tin User vào biến session của Postgres
            claims_json = json.dumps(user_claims)
            await session.exec(
                text("SELECT set_config('request.jwt.claims', :claims, true)"),
                params={"claims": claims_json}
            )
            yield session
        finally:
            await session.close()
5.2. Service as Dependency (Loại bỏ Prop Drilling)Mục tiêu: Tránh truyền session hoặc current_user qua Router -> Service -> Repository.Giải pháp: Định nghĩa Service là một Dependency tự inject session vào constructor của nó.# src/modules/users/service.py
class UserService:
    # Service tự inject session
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

# src/modules/users/router.py
@router.get("/me")
async def read_me(service: UserService = Depends(UserService)):
    # Router gọn gàng, không cần biết về session
    return await service.get_profile()
VI. Tiêu Chuẩn Tài Liệu và Observability6.1. Quy Tắc Comment và DocstringTriết lý "Why not What": Code sạch phải tự giải thích hành vi. Comment chỉ nên giải thích lý do nghiệp vụ hoặc bối cảnh phức tạp mà code không thể hiện được. (Ví dụ: await asyncio.sleep(2) # Cần sleep 2s để tránh Race Condition với hệ thống Legacy CRM).Docstring chuẩn Markdown (cho Router): Docstring của hàm Router (API Endpoint) bắt buộc phải sử dụng cú pháp Markdown thuần túy để hiển thị đẹp trên Swagger UI. Tập trung mô tả Input, Output, và các mã lỗi (HTTP Errors).6.2. Localization (Bản Địa Hóa)Yêu cầu: Toàn bộ thông báo lỗi và tài liệu hướng dẫn (kể cả Docstring trên Swagger) phải là Tiếng Việt. Điều này áp dụng cho cả thông báo trả về từ Exception Handler.6.3. Structured Logging và Request ID BindingQuy tắc: Bắt buộc sử dụng Structured Logging (định dạng JSON) thay cho log text thuần.Request ID Binding: Mỗi request phải được gán một UUID duy nhất (request_id).Thực thi: Sử dụng Middleware để tạo request_id và bind nó vào Logger Context (thông qua structlog.contextvars hoặc tương đương) để truy vết (trace) một yêu cầu xuyên suốt các tầng.# Mục tiêu của Logging Middleware
# 1. Tạo hoặc lấy X-Request-ID.
# 2. Bind request_id vào context vars.
# 3. Log kết quả (bao gồm status_code, time_taken).
