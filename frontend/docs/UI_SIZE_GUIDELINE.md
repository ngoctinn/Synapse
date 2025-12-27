# UI Size Guideline (Synapse)

Target: Web-SaaS (dashboard / workspace / B2B platform).
Base: 16px (1rem). Grid: 4px baseline.

## 1. Typography

| Token | Size (px) | rem | Line-height | Weight | Usage |
|---|---|---|---|---|---|
| `type-xxl` | 32px | 2.0rem | 40px | 600 | Page / major section title |
| `type-xl` | 24px | 1.5rem | 32px | 600 | Screen title, modal title |
| `type-lg` | 20px | 1.25rem | 28px | 600 | Card title, panel heading |
| `type-md` | 16px | 1.0rem | 24px | 500 | Body / paragraph / table cell |
| `type-sm` | 14px | 0.875rem | 20px | 400 | Secondary text, labels |
| `type-xs` | 12px | 0.75rem | 16px | 400 | Helper text, captions |

## 2. Buttons

| Token | Height | Padding X | Radius |
|---|---|---|---|
| `btn-large` | 48px | 20-24px | 8px |
| `btn-regular` | 40px | 16px | 8px |
| `btn-small` | 32px | 12px | 6px |
| `btn-icon` | 40/32px | - | 8/6px |

## 3. Forms (Input, Select)

| Token | Height | Label | Padding |
|---|---|---|---|
| `input-regular` | 40px | 14px | 12px LR |
| `input-compact` | 32px | 12-14px | 10px LR |

- **Gap**: Label -> Control: 8px. Control -> Helper: 6-8px.
- **Radius**: 6-8px.

## 4. Layout & Spacing

**Spacing Scale (4px baseline):**
- s0: 4px
- s1: 8px
- s2: 12px
- s3: 16px
- s4: 24px
- s5: 32px
- s6: 40px
- s7: 48px
- s8: 64px

**Containers:**
- `container-xl`: 1440px
- `container-lg`: 1280px
- `container-md`: 1024px

## 5. Components

- **Card Padding**: 16px (regular), 24px (hero). Radius: 12px.
- **Table Row**: 48px (regular), 40px (compact). Header: 56px.
- **Modal Width**: 420px (sm), 720px (md), 960px (lg).
- **Avatar**: 48px (xl), 32px (md), 24px (sm).

## 6. Accessibility

- **Min Click Target**: 44px.
- **Contrast**: Body text >= 4.5:1.
