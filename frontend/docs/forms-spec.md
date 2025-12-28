# Form UI Specification (Synapse)

## Design Tokens

Base font-size: **16px** (to prevent iOS zoom).
Base grid: **4px**.

### Control Heights

| Size        | Token                    | Height   | Tailwind Class | Use Case                                         |
| :---------- | :----------------------- | :------- | :------------- | :----------------------------------------------- |
| **Compact** | `control.height.compact` | **32px** | `h-8`          | High density tables, specialized filters         |
| **Regular** | `control.height.regular` | **40px** | `h-10`         | Default form inputs, settings pages              |
| **Large**   | `control.height.large`   | **48px** | `h-12`         | Hero inputs, login screens, main calls to action |

### Typography

| Component       | Token               | Size     | Weight        | Tailwind Class              |
| :-------------- | :------------------ | :------- | :------------ | :-------------------------- |
| **Label**       | `text.size.regular` | 14px\*   | 500 (Medium)  | `text-sm font-medium`       |
| **Input Text**  | `text.size.regular` | **16px** | 400 (Regular) | `text-base md:text-sm`\*\*  |
| **Helper Text** | `text.size.compact` | 12.8px   | 400 (Regular) | `text-[0.8rem]`             |
| **Error Text**  | `text.size.compact` | 12.8px   | 500 (Medium)  | `text-[0.8rem] font-medium` |

_\*Labels use 14px distinct from input text for hierarchy._
_\*\*Inputs use 16px to prevent zoom on mobile, but may scale to 14px on desktop (`md:text-sm`) if needed._

## Usage Guidelines

### Layout

- **Label Placement**: Top-aligned by default.
- **Spacing**: `space-y-2` between form fields.
- **Validation**: Error messages appear below the input. Space should be reserved or layout shift accepted (currently reserved 20px min-height for message container).

### Component Usage (Shadcn + Tailwind)

#### Basic Input

```tsx
<FormItem>
  <FormLabel>Email</FormLabel>
  <FormControl>
    <Input placeholder="name@example.com" /> {/* Defaults to 40px, 16px font */}
  </FormControl>
  <FormMessage />
</FormItem>
```

#### Sizing

Use the `size` prop on `FormItem` or individual components to control density.

```tsx
/* Compact (32px) */
<Input size="sm" />

/* Large (48px) */
<Input size="lg" />
```

#### Select

Top-level `SelectTrigger` aligns with Input styles.

```tsx
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  {/* ... content */}
</Select>
```

## Accessibility (A11y)

- **Target Size**: Minimum 44x44px target size is met/exceeded by Regular and Large sizes. Compact (32px) should be used with caution or ensuring adequate spacing.
- **Contrast**: Borders and text meet WCAG AA (4.5:1).
- **Focus**: Visible focus ring with `ring-offset`.
- **Screen Readers**: `aria-invalid` set on error; `aria-describedby` links input to error message.
