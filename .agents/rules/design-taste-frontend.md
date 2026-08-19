# Design Taste Frontend Standard (`design-taste-frontend`)

## Overview
Guidelines for maintaining refined design taste, pixel perfection, and avoiding generic UI patterns.

## 1. Zero Generic UI Anti-Patterns
- **No Plain Placeholders**: Avoid bland gray blocks or lorem ipsum when illustrative elements or structured mock data enhance real preview context.
- **Custom Iconography**: All icons must be unified vector SVGs (e.g. `AppleEmoji.tsx` mapping or Lucide icons). Never mix mismatched icon sets.
- **Rounded Visual Style**: Standardize corner radii across the application (e.g. `rounded-2xl` for controls, `rounded-[2.5rem]` for main containers).

## 2. Interactive Polish & Micro-Interactions
- **Interactive Feedback**: Every clickable element must respond to hover, focus, and active states (`hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`).
- **Physical Push-Button Feel**: Buttons utilize 3D tactile push effects (`border-b-4 active:translate-y-0.5 active:border-b-2`).
- **Smooth Cursor Hooks**: Subtle hover glow effects and active state highlight badges.

## 3. Pixel Perfection & Whitespace
- **Harmonious Padding & Margins**: Use consistent spacing scale (4px grid system: 8, 12, 16, 24, 32, 48, 64px).
- **Subtle Separators**: Avoid harsh full-width black/white dividers; use low-contrast borders (`border-slate-200/60 dark:border-slate-700/60`).
