# Frontend Design Standard (`frontend-design`)

## Overview
Guidelines and architectural rules for building robust, scalable, and maintainable frontend interfaces.

## 1. Component Architecture & Structure
- **Modular Components**: Break interfaces down into atomic, reusable React components with clean props interfaces.
- **Semantic HTML5**: Use `<main>`, `<section>`, `<nav>`, `<article>`, `<header>`, `<footer>`, `<aside>`, and `<button>` appropriately instead of generic `<div>` containers.
- **Strict Separation of Concerns**: Keep business logic, state management, and visual components separated.

## 2. Design System Foundation
- Maintain a unified set of design tokens (colors, typography scales, spacing units, border radii, shadows).
- Ensure 100% consistency across light and dark modes.
- Prefer CSS variable definitions or Tailwind configuration over arbitrary hardcoded ad-hoc values.

## 3. Responsive Layout System
- Build mobile-first with adaptive layouts targeting mobile (<640px), tablet (640px-1024px), desktop (1024px-1536px), and ultra-wide (>1536px).
- Use Flexbox and CSS Grid for resilient layouts that adjust smoothly across viewport resize events without overflow bugs.

## 4. Accessibility (a11y) & Standards
- Maintain AA/AAA color contrast ratios for text readability across light and dark themes.
- Ensure full keyboard navigation support with customized, high-visibility focus states (`focus-visible:ring-2`).
- Include appropriate `aria-*` attributes and `role` tags for screen readers.
