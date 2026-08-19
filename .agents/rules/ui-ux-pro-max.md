# UI/UX Pro Max Standard (`ui-ux-pro-max`)

## Overview
Comprehensive product-level UX patterns, state handling, and interactive perfection standards.

## 1. Complete State Coverage
- **Loading States**: Always show polished skeleton screens or animated shimmer indicators during async actions—never leave blank unstyled screens.
- **Empty States**: Present engaging, helpful empty states with clear calls to action and custom icons.
- **Error Recovery**: Provide actionable error states with retry options, clear messaging, and non-blocking toast notifications.

## 2. Dynamic Input & Form UX
- **Instant Validation**: Provide real-time inline validation feedback with smooth color transitions and helpful hint text.
- **Touch & Mobile Ergonomics**: Interactive targets must be at least 44x44px. Inputs auto-scroll into view without overlapping virtual keyboards.
- **Optimistic UI Updates**: Immediately reflect user actions (e.g. toggles, incrementing counters) in the interface while network requests complete.

## 3. Navigation & Flow
- **Context Awareness**: Maintain clear breadcrumbs, active state highlights, and sticky navigation headers.
- **Modal & Drawer Handling**: Ensure smooth backdrop blur transitions, ESC key listener, outside-click dismissal, and scroll lock on open modals.
