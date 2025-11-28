---
title: Landing Page Redesign - Design
status: Draft
---

# Design: Landing Page Redesign

## 1. Architecture Changes
- **New Feature Slice**: `src/features/landing-page`
- **Components**:
    - `Hero`: Main entry point with headline, CTA, and hero image/graphic.
    - `Features`: Grid layout for features.
    - `Testimonials` (Optional): Social proof.
    - `CTASection`: Final call to action.
- **Shared UI**: Use `framer-motion` for animations.

## 2. Data Model / Schema Changes
- None. This is a static page redesign.

## 3. API / Interfaces
- None.

## 4. Component Design
### `Hero`
- **Layout**: Split screen (Text Left, Image Right) or Centered.
- **Animation**: Staggered fade-in for text. Parallax effect for image.

### `Features`
- **Layout**: Grid (bento grid style or standard cards).
- **Animation**: Cards fade in and scale up slightly on scroll.

## 5. Key Design Decisions
- **FSD Structure**: All landing page components move to `features/landing-page/components`.
- **Animations**: Use `framer-motion` for declarative, performant animations.
- **Styling**: Use `backdrop-blur` and subtle gradients to achieve the "Premium" look.

## 6. Security & Performance
- **Performance**: Use `next/image` for all assets. Lazy load animations (viewport detection).
