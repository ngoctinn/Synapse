# Sơ đồ Ca Sử dụng Hệ thống Synapse

Tài liệu này trình bày sơ đồ ca sử dụng (Use Case Diagram) tổng quát và các sơ đồ phân rã theo từng phân hệ chức năng.

---

## 1. Sơ đồ Ca Sử dụng Tổng quát

Sơ đồ này thể hiện cái nhìn toàn cảnh về các tác nhân và nhóm chức năng chính của hệ thống.

```mermaid
graph TB
    %% === ACTORS ===
    KH((Khách hàng))
    LT((Lễ tân))
    KTV((Kỹ thuật viên))
    QTV((Quản trị viên))

    %% === USE CASE PACKAGES ===
    subgraph HT_XacThuc [Phân hệ Xác thực]
        UC_Auth[Quản lý Tài khoản<br>& Xác thực]
    end

    subgraph HT_KhachHang [Phân hệ Khách hàng]
        UC_DatLich[Đặt lịch hẹn<br>Trực tuyến]
        UC_QuanLyLich[Quản lý<br>Lịch hẹn Cá nhân]
        UC_TuVan[Nhận Tư vấn<br>Trực tuyến]
    end

    subgraph HT_NhanVien [Phân hệ Nhân viên]
        UC_QuanLyLichHen[Quản lý<br>Lịch hẹn Spa]
        UC_ChamsocKH[Chăm sóc<br>Khách hàng]
        UC_PhucVu[Thực hiện<br>Dịch vụ]
    end

    subgraph HT_QuanTri [Phân hệ Quản trị]
        UC_CauHinh[Cấu hình<br>Hệ thống]
    end

    %% === RELATIONSHIPS ===
    KH --> UC_Auth
    KH --> UC_DatLich
    KH --> UC_QuanLyLich
    KH --> UC_TuVan

    LT --> UC_Auth
    LT --> UC_QuanLyLichHen
    LT --> UC_ChamsocKH
    LT --> UC_TuVan

    KTV --> UC_Auth
    KTV --> UC_PhucVu

    QTV --> UC_Auth
    QTV --> UC_CauHinh

    %% === STYLING ===
    classDef actor fill:#fff,stroke:#333,stroke-width:2px
    classDef usecase fill:#e3f2fd,stroke:#1976d2,stroke-width:1px,rx:10
    classDef package fill:#f5f5f5,stroke:#666,stroke-width:1px

    class KH,LT,KTV,QTV actor
    class UC_Auth,UC_DatLich,UC_QuanLyLich,UC_TuVan,UC_QuanLyLichHen,UC_ChamsocKH,UC_PhucVu,UC_CauHinh usecase
```

**Hình 3.1: Sơ đồ ca sử dụng tổng quát hệ thống Synapse**

---

## 2. Sơ đồ Phân rã: Phân hệ Xác thực

```mermaid
graph LR
    %% === ACTORS ===
    ND((Người dùng))

    %% === USE CASES ===
    subgraph PhanHe_XacThuc [Phân hệ Xác thực]
        A1_1([A1.1 Đăng ký<br>tài khoản])
        A1_2([A1.2 Đăng nhập])
        A1_3([A1.3 Khôi phục<br>mật khẩu])
        A1_4([A1.4 Cập nhật<br>thông tin cá nhân])
        A1_5([A1.5 Đăng xuất])
    end

    %% === RELATIONSHIPS ===
    ND --> A1_1
    ND --> A1_2
    ND --> A1_3
    ND --> A1_4
    ND --> A1_5

    %% === INCLUDE/EXTEND ===
    A1_1 -.->|include| XacThucEmail[Xác thực<br>thư điện tử]
    A1_3 -.->|include| GuiEmail[Gửi liên kết<br>đặt lại]

    %% === STYLING ===
    classDef actor fill:#fff,stroke:#333,stroke-width:2px
    classDef usecase fill:#e8f5e9,stroke:#388e3c,stroke-width:1px,rx:15
    classDef include fill:#fff3e0,stroke:#f57c00,stroke-width:1px,rx:15

    class ND actor
    class A1_1,A1_2,A1_3,A1_4,A1_5 usecase
    class XacThucEmail,GuiEmail include
```

**Hình 3.2: Sơ đồ ca sử dụng phân hệ Xác thực**

| Mã | Tên ca sử dụng | Mô tả ngắn |
|----|----------------|------------|
| A1.1 | Đăng ký tài khoản | Tạo tài khoản mới cho khách hàng |
| A1.2 | Đăng nhập | Xác thực để truy cập hệ thống |
| A1.3 | Khôi phục mật khẩu | Đặt lại mật khẩu qua thư điện tử |
| A1.4 | Cập nhật thông tin cá nhân | Chỉnh sửa hồ sơ người dùng |
| A1.5 | Đăng xuất | Kết thúc phiên làm việc |

---

## 3. Sơ đồ Phân rã: Phân hệ Khách hàng

```mermaid
graph LR
    %% === ACTOR ===
    KH((Khách hàng))

    %% === USE CASES ===
    subgraph PhanHe_KhachHang [Phân hệ Khách hàng]
        subgraph Nhom_DichVu [Duyệt Dịch vụ]
            A2_1([A2.1 Xem danh sách<br>dịch vụ])
            A2_2([A2.2 Xem chi tiết<br>dịch vụ])
        end

        subgraph Nhom_DatLich [Đặt Lịch hẹn]
            A2_4([A2.4 Tìm khung giờ<br>khả dụng])
            A2_5([A2.5 Hoàn tất<br>đặt lịch hẹn])
            A2_6([A2.6 Tham gia<br>danh sách chờ])
        end

        subgraph Nhom_HoTro [Hỗ trợ]
            A2_7([A2.7 Nhận hỗ trợ qua<br>trò chuyện trực tuyến])
        end

        subgraph Nhom_QuanLy [Quản lý Lịch hẹn]
            A3_1([A3.1 Xem lịch sử<br>đặt lịch hẹn])
            A3_2([A3.2 Hủy lịch hẹn])
            A3_3([A3.3 Nhận thông báo<br>nhắc lịch])
        end

        subgraph Nhom_LieuTrinh [Liệu trình]
            B1_7([B1.7 Theo dõi<br>tiến độ liệu trình])
        end
    end

    %% === RELATIONSHIPS ===
    KH --> A2_1
    KH --> A2_2
    KH --> A2_4
    KH --> A2_5
    KH --> A2_6
    KH --> A2_7
    KH --> A3_1
    KH --> A3_2
    KH --> A3_3
    KH --> B1_7

    %% === INCLUDE/EXTEND ===
    A2_4 -.->|include| ThuatToan[Thuật toán<br>tối ưu hóa]
    A2_5 -.->|extend| A2_6
    A3_2 -.->|include| KiemTraChinhSach[Kiểm tra<br>chính sách hủy]

    %% === STYLING ===
    classDef actor fill:#fff,stroke:#333,stroke-width:2px
    classDef usecase fill:#e3f2fd,stroke:#1976d2,stroke-width:1px,rx:15
    classDef include fill:#fff3e0,stroke:#f57c00,stroke-width:1px,rx:15

    class KH actor
    class A2_1,A2_2,A2_4,A2_5,A2_6,A2_7,A3_1,A3_2,A3_3,B1_7 usecase
    class ThuatToan,KiemTraChinhSach include
```

**Hình 3.3: Sơ đồ ca sử dụng phân hệ Khách hàng**

| Mã | Tên ca sử dụng | Mô tả ngắn |
|----|----------------|------------|
| A2.1 | Xem danh sách dịch vụ | Duyệt các dịch vụ Spa cung cấp |
| A2.2 | Xem chi tiết dịch vụ | Xem thông tin đầy đủ một dịch vụ |
| A2.4 | Tìm khung giờ khả dụng | Tìm giờ trống với thuật toán thông minh |
| A2.5 | Hoàn tất đặt lịch hẹn | Xác nhận và tạo lịch hẹn |
| A2.6 | Tham gia danh sách chờ | Đăng ký nhận thông báo khi có chỗ |
| A2.7 | Nhận hỗ trợ trò chuyện | Tư vấn trực tuyến với lễ tân |
| A3.1 | Xem lịch sử đặt lịch | Xem các lịch hẹn đã đặt |
| A3.2 | Hủy lịch hẹn | Hủy lịch theo chính sách |
| A3.3 | Nhận thông báo nhắc lịch | Nhận nhắc nhở trước giờ hẹn |
| B1.7 | Theo dõi tiến độ liệu trình | Xem số buổi còn lại của liệu trình |

---

## 4. Sơ đồ Phân rã: Phân hệ Lễ tân & Kỹ thuật viên

```mermaid
graph LR
    %% === ACTORS ===
    LT((Lễ tân))
    KTV((Kỹ thuật viên))

    %% === USE CASES - LỄ TÂN ===
    subgraph PhanHe_LeTan [Phân hệ Lễ tân]
        B1_1([B1.1 Xem lịch hẹn<br>tổng quan])
        B1_2([B1.2 Quản lý hồ sơ<br>khách hàng])
        B1_3([B1.3 Tạo lịch hẹn<br>thủ công])
        B1_4([B1.4 Xác nhận<br>khách đến])
        B1_5([B1.5 Xử lý<br>thanh toán])
        B1_6([B1.6 Phản hồi hỗ trợ<br>trò chuyện])
    end

    %% === USE CASES - KỸ THUẬT VIÊN ===
    subgraph PhanHe_KTV [Phân hệ Kỹ thuật viên]
        B2_1([B2.1 Xem lịch làm việc<br>cá nhân])
        B2_3([B2.3 Ghi chú chuyên môn<br>sau buổi hẹn])
    end

    %% === RELATIONSHIPS ===
    LT --> B1_1
    LT --> B1_2
    LT --> B1_3
    LT --> B1_4
    LT --> B1_5
    LT --> B1_6

    KTV --> B2_1
    KTV --> B2_3

    %% === INCLUDE/EXTEND ===
    B1_4 -.->|include| TruLieuTrinh[Trừ buổi<br>liệu trình]
    B1_3 -.->|include| KiemTraKhaDung[Kiểm tra<br>khả dụng]
    B1_5 -.->|include| TaoHoaDon[Tạo hóa đơn]

    %% === STYLING ===
    classDef actor fill:#fff,stroke:#333,stroke-width:2px
    classDef usecase fill:#fce4ec,stroke:#c2185b,stroke-width:1px,rx:15
    classDef usecase2 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:1px,rx:15
    classDef include fill:#fff3e0,stroke:#f57c00,stroke-width:1px,rx:15

    class LT,KTV actor
    class B1_1,B1_2,B1_3,B1_4,B1_5,B1_6 usecase
    class B2_1,B2_3 usecase2
    class TruLieuTrinh,KiemTraKhaDung,TaoHoaDon include
```

**Hình 3.4: Sơ đồ ca sử dụng phân hệ Lễ tân và Kỹ thuật viên**

### Phân hệ Lễ tân

| Mã | Tên ca sử dụng | Mô tả ngắn |
|----|----------------|------------|
| B1.1 | Xem lịch hẹn tổng quan | Theo dõi toàn bộ lịch hẹn Spa |
| B1.2 | Quản lý hồ sơ khách hàng | Tìm kiếm, xem, cập nhật hồ sơ |
| B1.3 | Tạo lịch hẹn thủ công | Đặt lịch cho khách tại quầy |
| B1.4 | Xác nhận khách đến | Ghi nhận khách có mặt, trừ liệu trình |
| B1.5 | Xử lý thanh toán | Thu phí và tạo hóa đơn |
| B1.6 | Phản hồi hỗ trợ trò chuyện | Phản hồi khách qua trò chuyện |

### Phân hệ Kỹ thuật viên

| Mã | Tên ca sử dụng | Mô tả ngắn |
|----|----------------|------------|
| B2.1 | Xem lịch làm việc cá nhân | Xem khách hàng được phân công |
| B2.3 | Ghi chú chuyên môn | Ghi lại tình trạng khách hàng |

---

## 5. Sơ đồ Phân rã: Phân hệ Quản trị viên

```mermaid
graph LR
    %% === ACTOR ===
    QTV((Quản trị viên))

    %% === USE CASES ===
    subgraph PhanHe_QuanTri [Phân hệ Quản trị viên]
        subgraph Nhom_NhanSu [Quản lý Nhân sự]
            C4([C4 Cấu hình lịch<br>làm việc nhân viên])
        end

        subgraph Nhom_DichVu [Quản lý Dịch vụ]
            C5([C5 Quản lý danh mục<br>dịch vụ])
        end

        subgraph Nhom_TaiNguyen [Quản lý Tài nguyên]
            C7([C7 Quản lý<br>tài nguyên])
        end
    end

    %% === RELATIONSHIPS ===
    QTV --> C4
    QTV --> C5
    QTV --> C7

    %% === INCLUDE/EXTEND ===
    C4 -.->|include| KiemTraRangBuoc[Kiểm tra<br>ràng buộc lịch]
    C7 -.->|extend| BaoTriTaiNguyen[Đánh dấu<br>bảo trì]

    %% === STYLING ===
    classDef actor fill:#fff,stroke:#333,stroke-width:2px
    classDef usecase fill:#fff8e1,stroke:#ffa000,stroke-width:1px,rx:15
    classDef include fill:#e0f7fa,stroke:#00838f,stroke-width:1px,rx:15

    class QTV actor
    class C4,C5,C7 usecase
    class KiemTraRangBuoc,BaoTriTaiNguyen include
```

**Hình 3.5: Sơ đồ ca sử dụng phân hệ Quản trị viên**

| Mã | Tên ca sử dụng | Mô tả ngắn |
|----|----------------|------------|
| C4 | Cấu hình lịch làm việc | Phân ca và ngày nghỉ nhân viên |
| C5 | Quản lý danh mục dịch vụ | Thêm, sửa, vô hiệu hóa dịch vụ |
| C7 | Quản lý tài nguyên | Quản lý phòng, giường, thiết bị |

---

## 6. Tổng hợp Ca Sử dụng theo Tác nhân

| Tác nhân | Số ca sử dụng | Mã ca sử dụng |
|----------|---------------|---------------|
| Khách hàng | 10 | A2.1-2, A2.4-7, A3.1-3, B1.7 |
| Lễ tân | 6 | B1.1-6 |
| Kỹ thuật viên | 2 | B2.1, B2.3 |
| Quản trị viên | 3 | C4, C5, C7 |
| **Tổng cộng** | **21** | *(không tính Xác thực)* |

> **Ghi chú:** Các ca sử dụng A1.1-A1.5 (Phân hệ Xác thực) được sử dụng chung cho tất cả tác nhân.

---

*Lưu ý: Các sơ đồ được vẽ bằng Mermaid và tuân thủ ký hiệu UML tiêu chuẩn cho sơ đồ ca sử dụng.*
