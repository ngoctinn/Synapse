[Layout Discrepancy] — Layout root padding and container width vary significantly. (Severity: HIGH)
Pages: appointments-page.tsx vs billing-page.tsx vs customers-page.tsx
Mô tả ngắn: Inconsistent `PageContent` usage: some use `fullWidth`, others default, leading to different padding/max-width.
Mẫu Style/chữ bị lặp/chồng lấn: `p-0 gap-0` (appointments/resources) vs `p-4` (billing/settings) on PageContent context.

[Component Mismatch] — Header Title typography inconsistencies. (Severity: MEDIUM)
Pages: appointments-page.tsx vs billing-page.tsx vs reviews-admin-page.tsx
Mô tả ngắn: `text-xl font-bold` (appointments/billing) vs `text-2xl font-bold` (dashboard - assumed) vs `text-lg` in others.
Mẫu Style/chữ bị lặp/chồng lấn: `text-xl font-bold tracking-tight`

[Component Mismatch] — FilterBar input spacing and sizing. (Severity: LOW)
Pages: appointments-page.tsx vs customers-page.tsx vs resources-page.tsx
Mô tả ngắn: Search inputs have hardcoded widths `w-full md:w-[250px]` vs `flex-1 max-w-[400px]` (reviews).
Mẫu Style/chữ bị lặp/chồng lấn: `h-9 bg-background w-full md:w-[250px]`

[Animation Mismatch] — Tab content entry animations. (Severity: LOW)
Pages: active in customers-page.tsx vs resources-page.tsx vs settings-page.tsx
Mô tả ngắn: Some tabs use `motion-safe:animate-in fade-in-50 slide-in-from-bottom-4`, others use none or different durations.
Mẫu Style/chữ bị lặp/chồng lấn: `motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-4 duration-300 ease-out`

[Layout Discrepancy] — SurfaceCard usage and internal padding. (Severity: MEDIUM)
Pages: resources-page.tsx vs settings-page.tsx vs billing-page.tsx
Mô tả ngắn: `SurfaceCard` sometimes wraps entire content (billing), sometime per tab (resources), with varied padding (`p-4` vs implicit).
Mẫu Style/chữ bị lặp/chồng lấn: `p-4` vs `p-8` vs default (no padding class)

[Typography Mismatch] — Section Headers within Cards. (Severity: LOW)
Pages: billing-page.tsx (Cards) vs settings-page.tsx (Tabs)
Mô tả ngắn: Card titles use `text-sm font-medium` vs page headers using `text-xl`.
Mẫu Style/chữ bị lặp/chồng lấn: `text-sm font-medium text-muted-foreground`

[ASSUMPTION] Missing: tailwind.config.ts (Found postcss.config.mjs, assuming standard Tailwind setup without custom config file access)
