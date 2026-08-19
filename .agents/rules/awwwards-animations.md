# Awwwards Animations Standard (`awwwards-animations`)

## Overview
Guidelines for implementing fluid, cinematic motion design, page transitions, and interactive animations reminiscent of Awwwards site-of-the-day web experiences.

## 1. Motion Principles & Timing
- **Natural Easing Curves**: Use custom cubic-bezier curves (`cubic-bezier(0.16, 1, 0.3, 1)`) or spring physics for organic motion rather than harsh linear transitions.
- **Staggered Orchestration**: Reveal UI lists and grid items with staggered delays (`delay-[50ms]`, `delay-[100ms]`) to create fluid visual flow.
- **Micro-Animations**: Add springy hover scale, subtle rotation, dynamic badge pulses, and floating ambient background elements.

## 2. Page & Layout Transitions
- **Smooth Reveals**: Animate headers, hero sections, and cards into view on page load using entry opacity + vertical translation (`translate-y-4 -> translate-y-0`).
- **Scroll-Triggered Motion**: Utilize GSAP / Framer Motion / Lenis smooth scroll for scroll-driven animations, parallax layers, and progress indicators.

## 3. Performance & GPU Acceleration
- **Hardware Acceleration**: Animate only GPU-accelerated properties (`transform`, `opacity`). Avoid animating layout properties like `width`, `height`, `margin`, or `top`.
- **Performance Optimizations**: Utilize `will-change: transform` sparingly on complex animated components, and ensure 60fps frame rates.
