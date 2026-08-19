# High-End Visual Design Standard (`high-end-visual-design`)

## Overview
Design principles to deliver a visually stunning, world-class aesthetic that wows users at first glance.

## 1. Color Palette & Harmony
- **No Generic Colors**: Never use basic RGB colors (`red`, `blue`, `green`, `#ff0000`, etc.). Use curated, vibrant color systems (e.g. HSL tailored accents, deep slate/navy dark modes, glowing neon highlights).
- **Gradients & Mesh Surfaces**: Incorporate multi-stop linear gradients, radial accents, and background glow spheres (`blur-3xl opacity-20`) for depth.
- **Glassmorphism**: Utilize translucent glass containers using dynamic backdrop blurs (`backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20`).

## 2. Typography & Hierarchy
- **Modern Font Pairing**: Use sleek, modern Google Fonts (e.g. Inter, Outfit, Plus Jakarta Sans) with defined tracking and line heights.
- **Fluid Typography**: Use dynamic scale (`clamp()`) for headings to ensure impact across screens.
- **Visual Distinction**: Establish clear typographic scale between headings (`h1` display), subheadings, body, and micro-labels.

## 3. Surface Elevation & Depth
- **Multi-layered Shadows**: Combine ambient soft shadows with directional shadows (`shadow-[0_10px_30px_rgba(0,0,0,0.08)]`).
- **Signature Borders**: Use physical 3D border depth (`border-2 border-b-4`) to make cards and buttons pop.
- **Micro-textures**: Subtle borders, soft inner highlights, and light reflections.
