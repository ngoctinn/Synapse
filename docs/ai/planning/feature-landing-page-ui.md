---
title: Planning - Landing Page UI
status: Draft
---

# Landing Page UI Planning

## 1. Task Breakdown
- [x] **Setup**: Tạo file component `header.tsx` và `footer.tsx`.
- [x] **Header Implementation**:
    - [x] UI cơ bản (Logo, Nav).
    - [x] Responsive Mobile Menu.
    - [x] Auth State Logic (Guest/User view).
- [x] **Footer Implementation**:
    - [x] Grid Layout.
    - [x] Links & Icons.
- [x] **Integration**:
    - [x] Thêm Header/Footer vào `frontend/src/app/page.tsx`.
- [x] **Refinement**:
    - [x] Styling polish (spacing, colors).

## 2. Dependencies
- `shadcn/ui` components: Button, Sheet, DropdownMenu, Avatar.
- Auth state (giả lập hoặc tích hợp thật).

## 3. Effort Estimates
- Header: 2h
- Footer: 1h
- Integration & Polish: 1h
- **Total**: ~4h

## 4. Execution Order
1.  Footer (đơn giản hơn, làm trước).
2.  Header (phức tạp hơn do logic Auth và Mobile).
3.  Integration.

## 5. Risks & Mitigation
- **Risk**: Auth state chưa sẵn sàng.
- **Mitigation**: Mock trạng thái `isLoggedIn = true/false` để phát triển UI trước.
