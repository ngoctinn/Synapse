# Form Components Migration Guide

## Overview

This refactor harmonizes form components (`Input`, `Select`, `Textarea`, `Label`) to use a consistent design token system centered around **40px** default height and **16px** base font size.

## Breaking Changes

### 1. Default Height Change

- **Old**: Inconsistent (mixed 36px/40px/44px).
- **New**: **40px** (`h-10`) is the strict default.
- **Action**: Check custom layouts where 40px might break alignment. Use `size="sm"` for 32px if needed.

### 2. Font Size Standardization

- **Old**: `text-sm` (14px) universal.
- **New**: `text-base` (16px) is default for Inputs to prevent iOS zoom.
- **Action**: No action needed mostly, but be aware inputs will look slightly larger.

### 3. Prop Updates

- `Input`, `SelectTrigger` now accept updated `size` prop:
  - `default` -> 40px
  - `sm` -> 32px
  - `lg` -> 48px

### 4. Layout Stability

- `FormMessage` now has `min-h-[20px]`.
- **Impact**: Forms without errors will now have extra whitespace below inputs if they relied on `FormMessage` collapsing to 0 height.
- **Action**: If tight packing is required, adjust wrapping or custom styling, but note this stability is an accessibility feature.

### 5. Custom Fields Updates

- **`NumberInput`**: Default height changed from **56px** (`h-14`) to standard **40px**. Font size now defaults to `text-base`.
- **`TagInput`**: Minimum height changed from **56px** to **40px** (`min-h-10`).
- **`DatePicker` / `Combobox`**: Updated trigger font size to `text-base` (mobile) / `text-sm` (desktop) to prevent zoom.

## Migration Steps

1.  **Search & Replace**:
    - Search for manual height classes on inputs `h-[...]` and replace with `size` prop if possible.
2.  **Verify Selects**:
    - Ensure `SelectTrigger` isn't manually styled with conflicting heights.
3.  **Check Mobile**:
    - Verify inputs on iOS do not zoom when focused.

## Example

```diff
- <Input className="h-9 text-sm" />
+ <Input size="sm" /> {/* 32px height, 12px text (or use regular for 16px text) */}
```
