# BÁO CÁO TỔNG HỢP ENDPOINTS BACKEND SYNAPSE

## 1. Tổng Quan

| Metric | Giá trị |
|--------|---------|
| Tổng số Modules | **16** |
| Tổng số Endpoints | **67+** |
| Framework | FastAPI |

---

## 2. Danh Sách Modules và Endpoints

### 2.1. Users (`/users`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/me` | Lấy thông tin user hiện tại |
| PUT | `/me` | Cập nhật user hiện tại |
| GET | `/` | Danh sách users (Admin) |
| GET | `/{user_id}` | Chi tiết user |
| PUT | `/{user_id}` | Cập nhật user |
| DELETE | `/{user_id}` | Xóa user |

### 2.2. Staff (`/staff`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/invite` | Mời nhân viên |
| GET | `/` | Danh sách nhân viên |
| GET | `/{user_id}` | Chi tiết nhân viên |
| POST | `/` | Tạo nhân viên |
| PUT | `/{user_id}` | Cập nhật nhân viên |
| DELETE | `/{user_id}` | Xóa nhân viên |
| PUT | `/{user_id}/skills` | Cập nhật skills |

### 2.3. Services (`/services`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/skills` | Danh sách skills |
| POST | `/skills` | Tạo skill |
| PUT | `/skills/{skill_id}` | Cập nhật skill |
| DELETE | `/skills/{skill_id}` | Xóa skill |
| GET | `/` | Danh sách dịch vụ |
| GET | `/{service_id}` | Chi tiết dịch vụ |
| POST | `/` | Tạo dịch vụ |
| PUT | `/{service_id}` | Cập nhật dịch vụ |
| DELETE | `/{service_id}` | Xóa dịch vụ |

### 2.4. Bookings (`/bookings`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Danh sách bookings |
| POST | `/` | Tạo booking |
| GET | `/{booking_id}` | Chi tiết booking |
| PATCH | `/{booking_id}` | Cập nhật booking |
| POST | `/{booking_id}/confirm` | Xác nhận |
| POST | `/{booking_id}/cancel` | Hủy |
| POST | `/{booking_id}/complete` | Hoàn thành |
| POST | `/{booking_id}/no-show` | Đánh dấu No-Show |

### 2.5. Scheduling Engine (`/scheduling`) ⭐
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/solve` | Giải bài toán lập lịch |
| POST | `/evaluate` | Đánh giá lịch |
| POST | `/compare` | So sánh manual vs AI |
| GET | `/suggestions/{booking_id}` | Gợi ý phân công |
| GET | `/conflicts` | Kiểm tra xung đột |
| POST | `/reschedule` | Tái lập lịch |
| **POST** | **`/find-slots`** | **Tìm slot tối ưu (OR-Tools)** |
| GET | `/health` | Kiểm tra OR-Tools |

### 2.6. Schedules (`/schedules`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/shifts` | Danh sách ca |
| POST | `/shifts` | Tạo ca |
| GET | `/shifts/{shift_id}` | Chi tiết ca |
| PATCH | `/shifts/{shift_id}` | Cập nhật ca |
| DELETE | `/shifts/{shift_id}` | Xóa ca |
| GET | `/` | Lịch làm việc |
| POST | `/` | Tạo lịch |
| POST | `/bulk` | Tạo hàng loạt |
| GET | `/{schedule_id}` | Chi tiết lịch |
| PATCH | `/{schedule_id}` | Cập nhật lịch |
| DELETE | `/{schedule_id}` | Xóa lịch |
| PATCH | `/{schedule_id}/publish` | Công bố lịch |

### 2.7. Resources (`/resources`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/groups` | Danh sách nhóm |
| POST | `/groups` | Tạo nhóm |
| GET | `/` | Danh sách tài nguyên |
| POST | `/` | Tạo tài nguyên |
| PATCH | `/{resource_id}` | Cập nhật |
| DELETE | `/{resource_id}` | Xóa |

### 2.8. Operating Hours (`/operating-hours`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/week` | Giờ hoạt động tuần |
| PUT | `/week` | Cập nhật giờ tuần |
| GET | `/day/{date}` | Giờ ngày cụ thể |
| GET | `/exceptions` | Ngày ngoại lệ |
| POST | `/exceptions` | Tạo ngày nghỉ |

### 2.9. Customers (`/customers`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Danh sách khách hàng |
| GET | `/{customer_id}` | Chi tiết khách |
| POST | `/` | Tạo khách hàng |
| PUT | `/{customer_id}` | Cập nhật |

### 2.10. Customer Treatments (`/treatments`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Liệu trình đã mua |
| GET | `/{treatment_id}` | Chi tiết liệu trình |
| POST | `/` | Tạo liệu trình |

### 2.11. Billing (`/billing`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/invoices` | Danh sách hóa đơn |
| GET | `/invoices/{invoice_id}` | Chi tiết hóa đơn |
| POST | `/payments` | Thanh toán |

### 2.12. Promotions (`/promotions`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Danh sách khuyến mãi |
| POST | `/` | Tạo khuyến mãi |
| GET | `/{promotion_id}` | Chi tiết |
| PUT | `/{promotion_id}` | Cập nhật |
| DELETE | `/{promotion_id}` | Xóa |

### 2.13. Warranty Tickets (`/warranty-tickets`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Danh sách bảo hành |
| POST | `/` | Tạo yêu cầu bảo hành |
| GET | `/{id}` | Chi tiết |
| PATCH | `/{id}` | Cập nhật trạng thái |

### 2.14. Waitlist (`/waitlist`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Danh sách chờ |
| POST | `/` | Thêm vào danh sách chờ |
| PATCH | `/{id}` | Cập nhật |
| DELETE | `/{id}` | Xóa |

### 2.15. Notifications (`/notifications`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Danh sách thông báo |
| PATCH | `/{id}/read` | Đánh dấu đã đọc |

### 2.16. Chat (`/chat`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/conversations` | Danh sách cuộc trò chuyện |
| POST | `/messages` | Gửi tin nhắn |

---

## 3. Ràng Buộc Tích Hợp

| Module | Tích hợp với |
|--------|--------------|
| scheduling_engine | operating_hours, staff, services, resources, bookings |
| bookings | customer_treatments, billing, scheduling_engine |
| warranty | customer_treatments |

---

## 4. Kết Luận

**Backend Synapse có 16 modules với 67+ endpoints**, đầy đủ chức năng cho CRM Spa:
- ✅ Quản lý Users, Staff, Customers
- ✅ Quản lý Services, Skills
- ✅ Đặt lịch Bookings
- ✅ **Scheduling Engine với OR-Tools CP-SAT**
- ✅ Operating Hours từ Database
- ✅ Billing, Promotions, Warranty
