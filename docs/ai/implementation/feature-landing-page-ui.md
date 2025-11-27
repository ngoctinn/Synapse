---
title: Implementation - Landing Page UI
status: Draft
---

# Landing Page UI Implementation Notes

## 1. Component Structure
```tsx
// frontend/src/shared/ui/custom/header.tsx
export function Header() {
  // ... logic check auth
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        {/* Nav */}
        {/* Actions */}
      </div>
    </header>
  )
}
```

## 2. Key Libraries
- `lucide-react`: Icons.
- `next/link`: Navigation.
- `shadcn/ui`: Button, Sheet, DropdownMenu.

## 3. Edge Cases
- Tên người dùng quá dài -> Truncate.
- Mobile menu hiển thị quá nhiều item -> Scroll.
