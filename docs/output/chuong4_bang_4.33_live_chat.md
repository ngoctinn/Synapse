# BẢNG 4.33 - KIỂM THỬ CHỨC NĂNG LIVE CHAT (A2.7 & B1.6)

**Use Cases**:
- **A2.7** - Nhận hỗ trợ qua trò chuyện trực tuyến (Khách hàng)
- **B1.6** - Phản hồi hỗ trợ qua live chat (Lễ tân)

**Mức độ ưu tiên**: 🔴 HIGH
**Mục đích**: Chứng minh live chat hoạt động ổn định (connection, message delivery, read status)

---

## Bảng 4.33: Kiểm thử chức năng Live Chat

| Mã TC | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả |
|-------|----------|----------------|-----------------|------------------|---------|
| **CHAT_01** | Khách hàng gửi tin nhắn | **1.** KH đăng nhập<br>**2.** Nhấn icon Chat<br>**3.** Gửi "Tôi muốn đặt lịch" | **Message**: "Tôi muốn đặt lịch" | **✓** Chat session được tạo (Status: OPEN)<br>**✓** Message hiển thị trong chat box<br>**✓** Realtime sync thành công | **Pass** ✅ |
| **CHAT_02** | Lễ tân nhận thông báo | **1.** KH gửi tin nhắn (như TC01)<br>**2.** Lễ tân đang online | N/A | **✓** Lễ tân thấy badge số lượng tin nhắn mới<br>**✓** Thông báo realtime xuất hiện<br>**✓** Âm thanh thông báo (nếu bật) | **Pass** ✅ |
| **CHAT_03** | Lễ tân phản hồi | **1.** Lễ tân mở chat session<br>**2.** Gõ "Dạ, em giúp anh đặt lịch ạ"<br>**3.** Gửi | **Message**: "Dạ, em giúp anh đặt lịch ạ" | **✓** KH nhận tin nhắn realtime<br>**✓** Timestamp hiển thị đúng<br>**✓** Avatar Lễ tân hiển thị<br>**✓** Tin nhắn xuất hiện ngay lập tức | **Pass** ✅ |
| **CHAT_04** | Đánh dấu đã đọc | **1.** KH đọc tin nhắn từ Lễ tân | N/A | **✓** Icon "đã đọc" (2 tích xanh) xuất hiện<br>**✓** `is_read = TRUE` trong DB<br>**✓** Lễ tân thấy trạng thái "Đã xem" | **Pass** ✅ |
| **CHAT_05** | Đóng chat session | **1.** Lễ tân nhấn "Đóng hội thoại"<br>**2.** Xác nhận | **Session ID**: #123 | **✓** Status → CLOSED<br>**✓** KH không gửi tin nhắn mới được<br>**✓** Lịch sử chat vẫn lưu trữ<br>**✓** KH có thể mở session mới | **Pass** ✅ |
| **CHAT_06** | Xử lý mất kết nối | **1.** KH gửi tin nhắn<br>**2.** Ngắt mạng 5s<br>**3.** Kết nối lại | **Simulate**: Network offline → online | **✓** Tin nhắn tự động gửi lại khi reconnect<br>**✓** Không bị mất message<br>**✓** Thông báo "Đang kết nối lại..." hiển thị<br>**✓** Queue mechanism hoạt động | **Pass** ✅ |

---

## Kết luận

**Tổng số test cases**: 6
**Tỷ lệ Pass**: 6/6 (100%)
**Đánh giá**:
- ✅ Khách hàng gửi tin nhắn thành công, session được tạo (CHAT_01)
- ✅ Real-time notification hoạt động chính xác cho Lễ tân (CHAT_02)
- ✅ Lễ tân phản hồi tin nhắn thành công, hiển thị đầy đủ metadata (CHAT_03)
- ✅ Read status tracking chính xác (CHAT_04)
- ✅ Session lifecycle được quản lý đúng (CHAT_05)
- ✅ Resilience: Xử lý mất kết nối mạng tốt, không mất dữ liệu (CHAT_06)

**Công nghệ kiểm tra**:
- **Real-time engine**: Supabase Realtime (WebSocket-based)
- **Message persistence**: PostgreSQL
- **Connectivity testing**: Manual network simulation (DevTools → Offline)

**Traceability**:
- **UC Spec**:
  - Bảng 3.11 (A2.7 - Nhận hỗ trợ qua trò chuyện trực tuyến)
  - Bảng 3.23 (B1.6 - Phản hồi hỗ trợ qua live chat)
- **Sequence Diagram**:
  - Biểu đồ 3.62 (Nhận hỗ trợ qua trò chuyện trực tuyến)
  - Biểu đồ 3.73 (Phản hồi hỗ trợ qua trò chuyện trực tuyến)
- **Test Case**: Bảng 4.33 ✅ (Bổ sung)

**Ghi chú quan trọng**:
- Live chat sử dụng managed service (Supabase Realtime), đã được kiểm chứng về độ ổn định
- Test coverage bao gồm cả negative scenarios (mất kết nối)
- Đảm bảo không có message loss thông qua queue mechanism

**Kết luận**: Chức năng Live Chat đã được kiểm chứng đầy đủ về mặt connection stability, message delivery, và user experience trong cả điều kiện bình thường và bất thường.

---

**Vị trí chèn vào khóa luận**: Chương 4, Section 4.3.2.2 (Kiểm thử chức năng Khách hàng - Phân hệ A2 & B1)
