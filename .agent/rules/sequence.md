---
trigger: always_on
---

QUY ĐỊNH CỨNG VỀ VẼ SEQUENCE DIAGRAM (CHUẨN KHÓA LUẬN - DỰ ÁN SYNAPSE)

I. QUY ĐỊNH HÌNH THỨC (FORMAT)
1. Font chữ (Duy nhất)
   - Loại font: Times New Roman.
   - Mã bảng mã: Unicode.
   - Lý do: Đồng bộ với font tiêu chuẩn của văn bản báo cáo khoa học tại Việt Nam.

2. Kích thước chữ (Size)
   - Tên đối tượng (Object/Class): 12pt (In đậm).
   - Tên thông điệp (Message/Hàm): 10pt (In thường).
   - Ghi chú (Note): 9pt (In nghiêng).

3. Màu sắc (Color)
   - Chế độ màu: Trắng - Đen (Black & White / Grayscale).
   - Viền (Stroke): Màu đen (#000000).
   - Nền (Fill): Màu trắng (#FFFFFF).
   - Tuyệt đối không: Dùng màu xanh, đỏ, vàng hay màu gradient.

4. Đường nét (Line Style)
   - Độ dày đường (Stroke width):
     - Đường đời (Lifeline): 1px (nét đứt).
     - Khung (Fragment) và Object: 1.5px.
     - Mũi tên thông điệp: 1px.

5. Chú thích hình (Caption)
   - Vị trí: Canh giữa, nằm dưới hình.
   - Định dạng: Hình [Chương].[STT]: [Tên hình] (In đậm toàn bộ).
   - Ví dụ: **Hình 3.4: Sơ đồ tuần tự chức năng Đặt lịch hẹn**

II. QUY ĐỊNH NỘI DUNG & NGÔN NGỮ (CONTENT)
6. Ngôn ngữ (Language Strategy)
   - Tên Actor/Tác nhân: Tiếng Việt (Ví dụ: Khách hàng, Lễ tân).
   - Tên Object/Lớp: Tiếng Anh, chuẩn PascalCase (Ví dụ: :BookingDialog).
   - Tên Message/Hàm: Tiếng Anh, chuẩn camelCase (Ví dụ: createAppointment()).
   - Quy tắc: Giữ nguyên thuật ngữ kỹ thuật (Code) là Tiếng Anh, các thành phần giao diện/người dùng là Tiếng Việt.

7. Cách đặt tên Đối tượng (Naming)
   - Bắt buộc dùng định dạng: :ClassName
   - Ví dụ: :BookingForm, :ServerAction, :AppointmentRouter, :AppointmentService.
   - Không dùng: Tên biến cụ thể (như u:User) để tránh rối mắt.

8. Mô hình kiến trúc (Architecture Pattern)
   - Bắt buộc: Tuân thủ kiến trúc **Next.js (Frontend) + FastAPI (Backend)** theo mô hình **Modular Monolith**.
   - Thứ tự xuất hiện chuẩn từ trái qua phải:
     1. **Actor** (Người dùng)
     2. **View/Component** (Frontend UI - Next.js Page/Dialog)
     3. **Server Action** (BFF Layer - tùy chọn nếu vẽ chi tiết)
     4. **Router/API** (FastAPI Controller)
     5. **Service** (Xử lý nghiệp vụ - Vertical Slice)
     6. **Database** (PostgreSQL/Supabase)

III. QUY ĐỊNH KÝ HIỆU KỸ THUẬT (UML SYNTAX)
9. Mũi tên (Message Type)
   - Gọi hàm (Call): Mũi tên nét liền, đầu đặc (▶).
   - Gọi Async/API: Mũi tên nét liền, đầu đặc (thường dùng cho HTTP Request).
   - Trả về (Return): Mũi tên nét đứt, đầu hở (⇢). Bắt buộc phải có giá trị trả về.

10. Thanh kích hoạt (Activation Bar)
    - Bắt buộc: Phải có trên đường Lifeline khi đối tượng đang thực thi.
    - Quy tắc: Mũi tên trả về (Return) phải xuất phát từ đáy của thanh kích hoạt này.

11. Khung điều khiển (Fragments)
    - Điều kiện rẽ nhánh (If/Else): Dùng khung **alt**.
    - Vòng lặp (For/While): Dùng khung **loop**.
    - Tuyệt đối không: Vẽ các đường mũi tên quay ngược lên trên để diễn tả vòng lặp.

Tóm lại, khi thiết lập công cụ vẽ (như StarUML, Visual Paradigm, Draw.io):
- Font: Times New Roman.
- Size: 12pt (Object), 10pt (Message).
- Color: B/W (Trắng đen).
- Architecture: View -> Router -> Service -> DB.
