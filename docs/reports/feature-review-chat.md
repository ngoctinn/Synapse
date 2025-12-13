# BÁO CÁO ĐÁNH GIÁ CHẤT LƯỢNG TÍNH NĂNG

## Thông tin chung
- **Module:** `frontend/src/features/chat`
- **Ngày đánh giá:** 2025-12-13
- **Người đánh giá:** AI Review Agent
- **Phạm vi:** Chat/Messaging UI (Client-side only, Mock data)

---

## MỤC LỤC

1. [Tổng quan Module](#1-tổng-quan-module)
2. [Phân tích Kiến trúc (Architecture)](#2-phân-tích-kiến-trúc-architecture)
3. [Vấn đề về Code Quality](#3-vấn-đề-về-code-quality)
4. [Vấn đề về UX/Accessibility](#4-vấn-đề-về-uxaccessibility)
5. [Vấn đề về Performance](#5-vấn-đề-về-performance)
6. [Tổng hợp và Khuyến nghị](#6-tổng-hợp-và-khuyến-nghị)

---

## 1. Tổng quan Module

### Cấu trúc file
```
chat/
├── components/
│   ├── chat-container.tsx    (62 dòng - 2.2KB)
│   ├── chat-layout.tsx       (17 dòng - 466B)
│   ├── chat-sidebar.tsx      (93 dòng - 4.4KB)
│   ├── chat-window.tsx       (111 dòng - 5.1KB)
│   ├── message-bubble.tsx    (48 dòng - 1.7KB)
│   └── message-input.tsx     (75 dòng - 2.7KB)
├── data/
│   └── mock-data.ts          (106 dòng - 3.0KB)
├── types.ts                   (29 dòng - 600B)
└── index.ts                   (10 dòng)
```

### Chức năng
- **ChatContainer**: Component chính quản lý state và layout.
- **ChatSidebar**: Danh sách conversations với search và unread badges.
- **ChatWindow**: Cửa sổ chat chính với header, messages, và input.
- **MessageBubble**: Component hiển thị từng tin nhắn.
- **MessageInput**: Textarea với emoji picker và send button.
- **Mock data**: 2 conversations mẫu với messages.

**Lưu ý:** Module này là **UI-only**, không có server actions hoặc API calls thực tế.

---

## 2. Phân tích Kiến trúc (Architecture)

### ✅ Điểm mạnh
| Tiêu chí | Đánh giá |
|----------|----------|
| Component Composition | Tách biệt rõ ràng: Container → Layout → Sidebar/Window → Bubble/Input |
| Type Safety | Types đầy đủ cho Message, Conversation, ChatUser |
| Responsive Design | Mobile-first với conditional rendering (`hidden md:flex`) |
| State Management | Local state đơn giản với useState, phù hợp cho mock data |

### ⚠️ Điểm cần cải thiện

| ID | Vị trí | Mô tả | Mức độ |
|----|--------|-------|--------|
| ARCH-01 | `chat-container.tsx:12` | **State structure** | `messages` state là `Record<string, Message[]>` nhưng không sync với `MOCK_CONVERSATIONS`. Khi thêm message mới, `lastMessage` trong conversation không được update. | **Trung bình** |
| ARCH-02 | `chat-layout.tsx:7` | **Unused prop** | `defaultLayout` prop được định nghĩa nhưng không được sử dụng. | **Nhẹ** |
| ARCH-03 | Module | **No real-time integration** | Module chỉ có mock data, không có WebSocket hoặc polling logic. Cần document rõ đây là prototype. | **Nhẹ** |

---

## 3. Vấn đề về Code Quality

### 🟠 Mức độ Trung bình

| ID | File:Line | Vấn đề | Chi tiết |
|----|-----------|--------|----------|
| CQ-01 | `chat-sidebar.tsx:65` | **Hardcoded senderId check** | `conv.lastMessage.senderId === 'me'` - hardcode string 'me' thay vì dùng constant hoặc prop. |
| CQ-02 | `chat-window.tsx:23-31` | **Complex scroll logic** | Logic scroll sử dụng `querySelector('[data-radix-scroll-area-viewport]')` - fragile và phụ thuộc vào implementation detail của Radix. |
| CQ-03 | `message-bubble.tsx:40` | **Incomplete status display** | Chỉ hiển thị status 'read', không xử lý 'sent' và 'delivered'. |

**Trích dẫn code (CQ-01):**
```tsx
// chat-sidebar.tsx:65
{conv.lastMessage.senderId === 'me' ? 'Bạn: ' : ''}
// ← Hardcoded 'me', nên dùng currentUserId prop
```

**Trích dẫn code (CQ-02):**
```tsx
// chat-window.tsx:26-28
const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
if (scrollContainer) {
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
}
// ← Phụ thuộc vào internal structure của Radix ScrollArea
```

### 🟢 Mức độ Nhẹ

| ID | File:Line | Vấn đề | Chi tiết |
|----|-----------|--------|----------|
| CQ-04 | `mock-data.ts:33,48` | **Inconsistent spacing** | `tags:['VIP', 'Spa']` thiếu space sau dấu `:`. |
| CQ-05 | `chat-container.tsx:39` | **Custom animation class** | `animate-pulse-horizontal` không có trong Tailwind mặc định, cần define trong globals.css. |
| CQ-06 | `message-input.tsx:48` | **Verbose comment** | Comment "Clean style to merge with parent" có thể rút gọn hoặc loại bỏ. |

---

## 4. Vấn đề về UX/Accessibility

### 🟠 Mức độ Trung bình

| ID | File:Line | Vấn đề | Chi tiết |
|----|-----------|--------|----------|
| UX-01 | `chat-window.tsx:77-85` | **Non-functional buttons** | Buttons "Gọi điện", "Video call", "Xem thêm" không có onClick handlers. Chỉ có `aria-label` nhưng không làm gì. |
| UX-02 | `chat-sidebar.tsx:23-26` | **Non-functional search** | Input search không có onChange handler. Chỉ là UI placeholder. |
| UX-03 | `message-input.tsx:35-37` | **Non-functional attach button** | Button "Đính kèm file" không có onClick handler. |
| UX-04 | `message-input.tsx:53-55` | **Non-functional emoji button** | Button emoji không có onClick handler. |
| UX-05 | `chat-container.tsx:14` | **No conversation found handling** | Nếu `selectedId` không tồn tại trong `MOCK_CONVERSATIONS`, sẽ render empty window mà không có error message. |

**Trích dẫn code (UX-01):**
```tsx
// chat-window.tsx:77-85
<Button variant="ghost" size="icon" aria-label="Gọi điện">
  <Phone className="w-4 h-4" />
</Button>
// ← Không có onClick, button không làm gì
```

### 🟢 Mức độ Nhẹ

| ID | File:Line | Vấn đề | Chi tiết |
|----|-----------|--------|----------|
| UX-06 | `chat-window.tsx:73` | **Hardcoded text** | "Khách hàng Thân thiết" - nên dựa vào membership level hoặc data thực tế. |
| UX-07 | `message-input.tsx:26-29` | **Enter key behavior** | Shift+Enter để xuống dòng là UX tốt, nhưng không có hint cho user. |
| UX-08 | `chat-sidebar.tsx:81-83` | **Unread badge animation** | `animate-scale-in` class không có trong Tailwind mặc định. |

---

## 5. Vấn đề về Performance

### 🟢 Mức độ Nhẹ

| ID | File:Line | Vấn đề | Chi tiết |
|----|-----------|--------|----------|
| PERF-01 | `chat-window.tsx:24-31` | **useEffect dependency** | useEffect chạy mỗi khi `messages` thay đổi, có thể tối ưu bằng cách chỉ scroll khi có message mới (check length). |
| PERF-02 | `chat-sidebar.tsx:31-87` | **No virtualization** | Danh sách conversations không dùng virtualization. Với 100+ conversations sẽ lag. |

**Đề xuất cho PERF-01:**
```tsx
// chat-window.tsx
const prevLengthRef = useRef(messages.length);
useEffect(() => {
  if (messages.length > prevLengthRef.current) {
    // Only scroll when new message added
    scrollToBottom();
  }
  prevLengthRef.current = messages.length;
}, [messages]);
```

---

## 6. Tổng hợp và Khuyến nghị

### Bảng tổng hợp theo mức độ

| Mức độ | Số lượng | IDs |
|--------|----------|-----|
| 🔴 Nghiêm trọng | 0 | - |
| 🟠 Trung bình | 8 | ARCH-01, CQ-01, CQ-02, CQ-03, UX-01, UX-02, UX-03, UX-04, UX-05 |
| 🟢 Nhẹ | 9 | ARCH-02, ARCH-03, CQ-04, CQ-05, CQ-06, UX-06, UX-07, UX-08, PERF-01, PERF-02 |

### Khuyến nghị ưu tiên

#### 1. 🟠 Sớm: Sync conversation lastMessage với messages state
```tsx
// chat-container.tsx
const handleSendMessage = (content: string) => {
  if (!selectedId) return;

  const newMessage: Message = { /* ... */ };

  setMessages(prev => ({
    ...prev,
    [selectedId]: [...(prev[selectedId] || []), newMessage]
  }));

  // Update conversation lastMessage
  const convIndex = MOCK_CONVERSATIONS.findIndex(c => c.id === selectedId);
  if (convIndex !== -1) {
    MOCK_CONVERSATIONS[convIndex].lastMessage = newMessage;
    MOCK_CONVERSATIONS[convIndex].updatedAt = new Date().toISOString();
  }
};
```

#### 2. 🟠 Sớm: Replace hardcoded 'me' with prop
```diff
// chat-sidebar.tsx
- {conv.lastMessage.senderId === 'me' ? 'Bạn: ' : ''}
+ {conv.lastMessage.senderId === currentUserId ? 'Bạn: ' : ''}
```

#### 3. 🟠 Sớm: Add onClick handlers hoặc disable buttons
```tsx
// chat-window.tsx
<Button variant="ghost" size="icon" aria-label="Gọi điện" disabled>
  <Phone className="w-4 h-4" />
</Button>
// Hoặc thêm onClick={() => showToast.info("Tính năng đang phát triển")}
```

#### 4. 🟠 Sớm: Implement search functionality
```tsx
// chat-sidebar.tsx
const [searchQuery, setSearchQuery] = useState("");
const filteredConversations = conversations.filter(c =>
  c.user.name.toLowerCase().includes(searchQuery.toLowerCase())
);

<Input
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  startContent={<Search className="w-4 h-4" />}
  placeholder="Tìm kiếm khách hàng..."
/>
```

#### 5. 🟢 Khi rảnh: Add message status indicators
```tsx
// message-bubble.tsx:38-42
{isMe && (
  <span className="ml-1">
    {message.status === 'sent' && '✓'}
    {message.status === 'delivered' && '✓✓'}
    {message.status === 'read' && '✓✓ Đã xem'}
  </span>
)}
```

#### 6. 🟢 Khi rảnh: Add virtualization for long lists
Sử dụng `react-window` hoặc `@tanstack/react-virtual` cho danh sách conversations.

---

### Điểm chất lượng tổng thể

| Tiêu chí | Điểm (1-10) |
|----------|-------------|
| Kiến trúc | 8/10 |
| Code Quality | 7/10 |
| UX/Accessibility | 6/10 |
| Performance | 8/10 |
| **Trung bình** | **7.25/10** |

### Ghi chú đặc biệt
- **Module này là UI prototype** - không có backend integration.
- **Tất cả buttons chức năng (call, video, attach, emoji)** đều chưa được implement.
- **Search và filter** chưa hoạt động.
- Cần document rõ scope: "Chat UI mockup for design review" để tránh confusion.

---

*Báo cáo được tạo tự động. Vui lòng review và xác nhận trước khi thực hiện các thay đổi.*
