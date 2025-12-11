---
phase: testing
title: Kế hoạch Kiểm thử Giao diện Quản lý Lịch hẹn
description: Các trường hợp kiểm thử, kịch bản E2E, và checklist kiểm tra
feature: appointment-management-ui
status: draft
created: 2024-12-11
---

# Kế hoạch Kiểm thử: Giao diện Quản lý Lịch hẹn

## 📋 Tổng quan

**Phạm vi**: Kiểm thử toàn bộ chức năng Frontend của module Appointments
**Loại test**: Unit Tests, Integration Tests, E2E Tests, Manual Testing
**Công cụ**: Jest/Vitest, React Testing Library, Playwright (E2E)

---

## 🧪 Unit Tests

### UT-1: Hooks

#### UT-1.1: useCalendarState

```typescript
describe("useCalendarState", () => {
  it("khởi tạo với view mặc định là 'week'", () => {
    const { result } = renderHook(() => useCalendarState())
    expect(result.current.view).toBe("week")
  })

  it("setView thay đổi view đúng", () => {
    const { result } = renderHook(() => useCalendarState())
    act(() => {
      result.current.setView("month")
    })
    expect(result.current.view).toBe("month")
  })

  it("goNext tăng ngày theo view hiện tại", () => {
    const { result } = renderHook(() => useCalendarState(new Date("2024-12-11")))
    act(() => {
      result.current.goNext()
    })
    // Với week view, nên là tuần tiếp theo
    expect(result.current.date.getDate()).toBe(18)
  })

  it("goPrev giảm ngày theo view hiện tại", () => {
    const { result } = renderHook(() => useCalendarState(new Date("2024-12-11")))
    act(() => {
      result.current.goPrev()
    })
    expect(result.current.date.getDate()).toBe(4)
  })

  it("goToday reset về ngày hiện tại", () => {
    const { result } = renderHook(() => useCalendarState(new Date("2024-01-01")))
    act(() => {
      result.current.goToday()
    })
    const today = new Date()
    expect(result.current.date.toDateString()).toBe(today.toDateString())
  })

  it("dateRange tính đúng cho week view", () => {
    const { result } = renderHook(() => useCalendarState(new Date("2024-12-11")))
    expect(result.current.dateRange.start.getDay()).toBe(1) // Thứ 2
    expect(result.current.dateRange.end.getDay()).toBe(0) // Chủ nhật
  })
})
```

#### UT-1.2: useConflictDetection

```typescript
describe("useConflictDetection", () => {
  const existingEvents = [
    { id: "1", start: new Date("2024-12-11T09:00"), end: new Date("2024-12-11T10:00"), staffId: "staff-1" },
    { id: "2", start: new Date("2024-12-11T14:00"), end: new Date("2024-12-11T15:00"), staffId: "staff-1" },
  ]

  it("phát hiện xung đột khi overlap hoàn toàn", () => {
    const { result } = renderHook(() => useConflictDetection(existingEvents))
    const conflict = result.current.checkConflict({
      staffId: "staff-1",
      start: new Date("2024-12-11T09:00"),
      end: new Date("2024-12-11T10:00"),
    })
    expect(conflict).not.toBeNull()
    expect(conflict?.type).toBe("overlap")
  })

  it("phát hiện xung đột khi overlap một phần", () => {
    const { result } = renderHook(() => useConflictDetection(existingEvents))
    const conflict = result.current.checkConflict({
      staffId: "staff-1",
      start: new Date("2024-12-11T09:30"),
      end: new Date("2024-12-11T10:30"),
    })
    expect(conflict).not.toBeNull()
  })

  it("không phát hiện xung đột cho thời gian rỗng", () => {
    const { result } = renderHook(() => useConflictDetection(existingEvents))
    const conflict = result.current.checkConflict({
      staffId: "staff-1",
      start: new Date("2024-12-11T11:00"),
      end: new Date("2024-12-11T12:00"),
    })
    expect(conflict).toBeNull()
  })

  it("không phát hiện xung đột cho staff khác", () => {
    const { result } = renderHook(() => useConflictDetection(existingEvents))
    const conflict = result.current.checkConflict({
      staffId: "staff-2",
      start: new Date("2024-12-11T09:00"),
      end: new Date("2024-12-11T10:00"),
    })
    expect(conflict).toBeNull()
  })
})
```

### UT-2: Utilities

#### UT-2.1: date-utils

```typescript
describe("date-utils", () => {
  describe("getTimeSlots", () => {
    it("sinh đúng số slots cho khoảng 8h-21h với interval 15 phút", () => {
      const slots = getTimeSlots(8, 21, 15)
      expect(slots.length).toBe(52) // (21-8) * 4
    })

    it("sinh đúng số slots với interval 30 phút", () => {
      const slots = getTimeSlots(8, 21, 30)
      expect(slots.length).toBe(26)
    })
  })

  describe("formatTimeRange", () => {
    it("format đúng khoảng thời gian", () => {
      const start = new Date("2024-12-11T09:00")
      const end = new Date("2024-12-11T10:30")
      expect(formatTimeRange(start, end)).toBe("09:00 - 10:30")
    })
  })

  describe("getEventPosition", () => {
    it("tính đúng top và height cho event", () => {
      const event = {
        start: new Date("2024-12-11T09:00"),
        end: new Date("2024-12-11T10:00"),
      }
      const position = getEventPosition(event, 8, 60) // startHour=8, heightPerHour=60
      expect(position.top).toBe(60) // (9-8) * 60
      expect(position.height).toBe(60) // 1 hour * 60
    })
  })
})
```

#### UT-2.2: conflict-utils

```typescript
describe("conflict-utils", () => {
  describe("doEventsOverlap", () => {
    it("trả về true khi overlap", () => {
      const a = { start: new Date("2024-12-11T09:00"), end: new Date("2024-12-11T10:00") }
      const b = { start: new Date("2024-12-11T09:30"), end: new Date("2024-12-11T10:30") }
      expect(doEventsOverlap(a, b)).toBe(true)
    })

    it("trả về false khi không overlap", () => {
      const a = { start: new Date("2024-12-11T09:00"), end: new Date("2024-12-11T10:00") }
      const b = { start: new Date("2024-12-11T10:00"), end: new Date("2024-12-11T11:00") }
      expect(doEventsOverlap(a, b)).toBe(false) // Edge-to-edge không phải overlap
    })
  })

  describe("groupOverlappingEvents", () => {
    it("group đúng các events chồng chéo", () => {
      const events = [
        { id: "1", start: new Date("2024-12-11T09:00"), end: new Date("2024-12-11T10:00") },
        { id: "2", start: new Date("2024-12-11T09:30"), end: new Date("2024-12-11T10:30") },
        { id: "3", start: new Date("2024-12-11T11:00"), end: new Date("2024-12-11T12:00") },
      ]
      const groups = groupOverlappingEvents(events)
      expect(groups.length).toBe(2)
      expect(groups[0].length).toBe(2) // event 1 & 2
      expect(groups[1].length).toBe(1) // event 3
    })
  })
})
```

### UT-3: Components

#### UT-3.1: EventCard

```typescript
describe("EventCard", () => {
  const mockEvent: CalendarEvent = {
    id: "1",
    title: "Nguyễn Văn A - Massage",
    start: new Date("2024-12-11T09:00"),
    end: new Date("2024-12-11T10:00"),
    color: "#4CAF50",
    status: "confirmed",
    staffId: "staff-1",
    isRecurring: false,
    appointment: {} as Appointment,
  }

  it("render title và time đúng", () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText("Nguyễn Văn A - Massage")).toBeInTheDocument()
    expect(screen.getByText("09:00 - 10:00")).toBeInTheDocument()
  })

  it("áp dụng đúng background color từ service", () => {
    render(<EventCard event={mockEvent} />)
    const card = screen.getByRole("button")
    expect(card).toHaveStyle({ backgroundColor: "#4CAF50" })
  })

  it("hiển thị icon recurring cho event lặp lại", () => {
    render(<EventCard event={{ ...mockEvent, isRecurring: true }} />)
    expect(screen.getByTestId("recurring-icon")).toBeInTheDocument()
  })

  it("gọi onClick khi click", async () => {
    const handleClick = jest.fn()
    render(<EventCard event={mockEvent} onClick={handleClick} />)
    await userEvent.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("áp dụng dragging styles khi isDragging=true", () => {
    render(<EventCard event={mockEvent} isDragging />)
    const card = screen.getByRole("button")
    expect(card).toHaveClass("opacity-50")
  })
})
```

#### UT-3.2: ViewSwitcher

```typescript
describe("ViewSwitcher", () => {
  it("render tất cả view options", () => {
    render(<ViewSwitcher value="week" onChange={jest.fn()} />)
    expect(screen.getByText("Ngày")).toBeInTheDocument()
    expect(screen.getByText("Tuần")).toBeInTheDocument()
    expect(screen.getByText("Tháng")).toBeInTheDocument()
    expect(screen.getByText("Danh sách")).toBeInTheDocument()
    expect(screen.getByText("Timeline")).toBeInTheDocument()
  })

  it("gọi onChange khi switch view", async () => {
    const handleChange = jest.fn()
    render(<ViewSwitcher value="week" onChange={handleChange} />)
    await userEvent.click(screen.getByText("Tháng"))
    expect(handleChange).toHaveBeenCalledWith("month")
  })

  it("highlight active view", () => {
    render(<ViewSwitcher value="week" onChange={jest.fn()} />)
    expect(screen.getByText("Tuần")).toHaveAttribute("data-state", "active")
  })
})
```

---

## 🔗 Integration Tests

### IT-1: Calendar Flow

```typescript
describe("Calendar Integration", () => {
  it("chuyển view và cập nhật lịch đúng", async () => {
    render(<CalendarView />)

    // Default week view
    expect(screen.getByTestId("week-view")).toBeInTheDocument()

    // Switch to month
    await userEvent.click(screen.getByText("Tháng"))
    expect(screen.getByTestId("month-view")).toBeInTheDocument()

    // Navigate next month
    await userEvent.click(screen.getByLabelText("Tháng sau"))
    expect(screen.getByText("Tháng 1, 2025")).toBeInTheDocument()
  })

  it("filter cập nhật hiển thị events", async () => {
    render(<AppointmentsPage />)

    // Mở filter
    await userEvent.click(screen.getByText("Bộ lọc"))

    // Chọn KTV
    await userEvent.click(screen.getByText("Nguyễn Thảo"))

    // Verify chỉ events của KTV đó hiển thị
    const events = screen.getAllByTestId("event-card")
    events.forEach(event => {
      expect(event).toHaveAttribute("data-staff", "nguyen-thao")
    })
  })
})
```

### IT-2: Drag & Drop Flow

```typescript
describe("Drag & Drop Integration", () => {
  it("di chuyển event và cập nhật thời gian", async () => {
    const mockUpdateEvent = jest.fn()
    render(<CalendarView onEventUpdate={mockUpdateEvent} />)

    const event = screen.getByText("Nguyễn Văn A - Massage")
    const dropZone = screen.getByTestId("slot-10-00")

    // Drag and drop
    fireEvent.dragStart(event)
    fireEvent.dragOver(dropZone)
    fireEvent.drop(dropZone)

    expect(mockUpdateEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        startTime: expect.any(Date),
        endTime: expect.any(Date),
      })
    )
  })

  it("hiển thị ghost và overlay khi dragging", async () => {
    render(<CalendarView />)

    const event = screen.getByText("Nguyễn Văn A - Massage")

    fireEvent.dragStart(event)

    // Ghost tại vị trí gốc
    expect(screen.getByTestId("event-ghost")).toHaveClass("opacity-30")

    // Overlay theo cursor
    expect(screen.getByTestId("drag-overlay")).toBeInTheDocument()
  })

  it("ngăn drop vào vùng cấm", async () => {
    const mockUpdateEvent = jest.fn()
    render(<CalendarView onEventUpdate={mockUpdateEvent} />)

    const event = screen.getByText("Nguyễn Văn A - Massage")
    const restrictedZone = screen.getByTestId("slot-past") // Ngày đã qua

    fireEvent.dragStart(event)
    fireEvent.dragOver(restrictedZone)

    // Cursor "not-allowed"
    expect(restrictedZone).toHaveClass("cursor-not-allowed")

    fireEvent.drop(restrictedZone)

    // Không gọi update
    expect(mockUpdateEvent).not.toHaveBeenCalled()
  })
})
```

### IT-3: Form & Sheet Flow

```typescript
describe("Appointment Form Integration", () => {
  it("tạo appointment mới với dữ liệu hợp lệ", async () => {
    const mockCreate = jest.fn().mockResolvedValue({ success: true })
    render(<AppointmentSheet mode="create" onSubmit={mockCreate} />)

    // Điền form
    await userEvent.type(screen.getByLabelText("Khách hàng"), "Nguyễn Văn A")
    await userEvent.click(screen.getByText("Nguyễn Văn A - 0912345678"))

    await userEvent.click(screen.getByLabelText("Dịch vụ"))
    await userEvent.click(screen.getByText("Massage toàn thân"))

    await userEvent.click(screen.getByLabelText("Kỹ thuật viên"))
    await userEvent.click(screen.getByText("Trần Thị B"))

    // Submit
    await userEvent.click(screen.getByText("Tạo lịch hẹn"))

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: expect.any(String),
        serviceIds: expect.arrayContaining(["service-1"]),
        staffId: "staff-2",
      })
    )
  })

  it("hiển thị lỗi validation", async () => {
    render(<AppointmentSheet mode="create" />)

    // Submit không điền gì
    await userEvent.click(screen.getByText("Tạo lịch hẹn"))

    expect(screen.getByText("Vui lòng chọn khách hàng")).toBeInTheDocument()
    expect(screen.getByText("Vui lòng chọn dịch vụ")).toBeInTheDocument()
  })

  it("hiển thị cảnh báo xung đột", async () => {
    // Mock existing appointment at 09:00-10:00
    render(<AppointmentSheet mode="create" existingEvents={mockEvents} />)

    await userEvent.click(screen.getByLabelText("Kỹ thuật viên"))
    await userEvent.click(screen.getByText("Nguyễn Thảo")) // KTV đã có hẹn 09:00

    await userEvent.type(screen.getByLabelText("Giờ bắt đầu"), "09:30")

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Xung đột: Nguyễn Thảo đã có hẹn lúc 09:00-10:00"
    )
  })
})
```

---

## 🎭 E2E Tests (Playwright)

### E2E-1: Full CRUD Flow

```typescript
test.describe("Appointments CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/appointments")
  })

  test("Tạo, xem, sửa, xóa lịch hẹn", async ({ page }) => {
    // CREATE
    await page.click("[data-testid='create-appointment-btn']")
    await page.fill("[name='customer']", "Nguyễn Văn Test")
    await page.click("text=Nguyễn Văn Test")
    await page.click("[name='service']")
    await page.click("text=Massage cơ bản")
    await page.click("[name='staff']")
    await page.click("text=Trần Linh")
    await page.fill("[name='date']", "2024-12-15")
    await page.fill("[name='time']", "10:00")
    await page.click("button:has-text('Tạo lịch hẹn')")

    await expect(page.locator("text=Tạo lịch hẹn thành công")).toBeVisible()

    // READ
    await expect(page.locator("[data-testid='event-card']:has-text('Nguyễn Văn Test')")).toBeVisible()

    // UPDATE
    await page.click("[data-testid='event-card']:has-text('Nguyễn Văn Test')")
    await page.click("button:has-text('Chỉnh sửa')")
    await page.fill("[name='time']", "14:00")
    await page.click("button:has-text('Cập nhật')")

    await expect(page.locator("text=Cập nhật thành công")).toBeVisible()
    await expect(page.locator("[data-testid='event-card']:has-text('14:00')")).toBeVisible()

    // DELETE
    await page.click("[data-testid='event-card']:has-text('Nguyễn Văn Test')")
    await page.click("button:has-text('Xóa')")
    await page.click("button:has-text('Xác nhận xóa')")

    await expect(page.locator("text=Đã xóa lịch hẹn")).toBeVisible()
    await expect(page.locator("[data-testid='event-card']:has-text('Nguyễn Văn Test')")).not.toBeVisible()
  })
})
```

### E2E-2: Drag & Drop

```typescript
test.describe("Drag & Drop", () => {
  test("Di chuyển lịch hẹn bằng kéo thả", async ({ page }) => {
    await page.goto("/admin/appointments")

    const event = page.locator("[data-testid='event-card']:first-child")
    const dropZone = page.locator("[data-testid='slot-11-00']")

    const eventBox = await event.boundingBox()
    const dropBox = await dropZone.boundingBox()

    await page.mouse.move(eventBox!.x + 50, eventBox!.y + 20)
    await page.mouse.down()
    await page.mouse.move(dropBox!.x + 50, dropBox!.y + 20, { steps: 10 })
    await page.mouse.up()

    await expect(page.locator("text=Cập nhật thời gian thành công")).toBeVisible()
  })
})
```

### E2E-3: Responsive

```typescript
test.describe("Mobile Responsive", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }) // iPhone X
  })

  test("Hiển thị Agenda View mặc định trên mobile", async ({ page }) => {
    await page.goto("/admin/appointments")

    await expect(page.locator("[data-testid='agenda-view']")).toBeVisible()
    await expect(page.locator("[data-testid='week-view']")).not.toBeVisible()
  })

  test("Swipe để xóa lịch hẹn", async ({ page }) => {
    await page.goto("/admin/appointments")

    const item = page.locator("[data-testid='agenda-item']:first-child")
    const box = await item.boundingBox()

    // Swipe left
    await page.mouse.move(box!.x + box!.width - 20, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + 20, box!.y + box!.height / 2, { steps: 10 })
    await page.mouse.up()

    await expect(page.locator("button:has-text('Xóa')")).toBeVisible()
  })
})
```

---

## ✅ Manual Testing Checklist

### MT-1: Calendar Views

- [ ] **Day View**
  - [ ] Hiển thị đúng giờ từ 08:00-21:00
  - [ ] Events align đúng với time slots
  - [ ] Overlapping events hiển thị side-by-side
  - [ ] Current time indicator hiển thị đúng
  - [ ] Click empty slot mở form với thời gian điền sẵn

- [ ] **Week View**
  - [ ] Hiển thị đúng 7 ngày
  - [ ] Ngày hôm nay được highlight
  - [ ] Navigate prev/next hoạt động
  - [ ] Scroll dọc mượt

- [ ] **Month View**
  - [ ] Hiển thị đúng 5-6 tuần
  - [ ] "+X more" hiển thị khi quá nhiều events
  - [ ] Click ngày mở Day View hoặc Popover
  - [ ] Ngày ngoài tháng bị mờ

- [ ] **Agenda View**
  - [ ] List view theo ngày
  - [ ] Sticky date headers
  - [ ] Empty state cho ngày rỗng

- [ ] **Timeline View**
  - [ ] Sticky left column (staff names)
  - [ ] Sticky top header (time ruler)
  - [ ] Zoom in/out hoạt động
  - [ ] Horizontal scroll mượt

### MT-2: Drag & Drop

- [ ] Nhấn giữ event -> "nổi lên" (shadow increase)
- [ ] Ghost tại vị trí gốc (opacity 30%)
- [ ] Tooltip hiển thị thời gian mới khi kéo
- [ ] Snap to 15-minute grid
- [ ] Drop zone highlight
- [ ] Restricted zones (past, break time) có cursor "not-allowed"
- [ ] Release -> Cập nhật thời gian
- [ ] Optimistic update (UI thay đổi ngay)
- [ ] Rollback nếu API lỗi

### MT-3: Forms & Sheets

- [ ] Click event -> Side Panel mở
- [ ] Xem chi tiết đầy đủ
- [ ] Nút Sửa -> Mode Edit
- [ ] Form validation hoạt động
- [ ] Conflict warning hiển thị đúng
- [ ] Submit thành công -> Toast + Refresh

### MT-4: Filters & Metrics

- [ ] Filter by KTV hoạt động
- [ ] Filter by Service hoạt động
- [ ] Filter by Status hoạt động
- [ ] Applied chips hiển thị đúng
- [ ] Clear all xóa tất cả filter
- [ ] Metrics cards hiển thị số liệu đúng

### MT-5: Mobile Experience

- [ ] Agenda view là default
- [ ] Swipe actions hoạt động
- [ ] Bottom sheet thay vì side panel
- [ ] Touch targets đủ lớn (44px)
- [ ] No horizontal scroll không mong muốn

### MT-6: Accessibility

- [ ] Tab navigation hoạt động
- [ ] Arrow keys di chuyển giữa events
- [ ] Enter mở chi tiết
- [ ] Escape đóng sheet
- [ ] Screen reader đọc được events
- [ ] Color contrast >= 4.5:1

---

## 📊 Coverage Goals

| Category | Target |
|----------|--------|
| Unit Tests (Hooks) | 90% |
| Unit Tests (Utils) | 95% |
| Unit Tests (Components) | 80% |
| Integration Tests | 70% |
| E2E Tests | Key flows covered |

---

## 🐛 Bug Report Template

```markdown
### Bug Description
[Mô tả ngắn gọn lỗi]

### Steps to Reproduce
1. Đi tới...
2. Click vào...
3. Quan sát...

### Expected Behavior
[Hành vi mong đợi]

### Actual Behavior
[Hành vi thực tế]

### Screenshots/Videos
[Đính kèm nếu có]

### Environment
- Browser: Chrome 120
- OS: Windows 11
- Screen size: 1920x1080
```

---

## ✅ Test Execution Log

| Date | Tester | Tests Passed | Tests Failed | Notes |
|------|--------|--------------|--------------|-------|
| - | - | - | - | Chưa bắt đầu |

---

**Sau khi triển khai xong, chạy `/writing-test` để tạo test files cụ thể.**
