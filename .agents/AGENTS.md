# Project Design & Customization Rules

## 1. Icon & Emoji Standard (`AppleEmoji.tsx`)
- All emoji displays across the site MUST use `components/AppleEmoji.tsx`.
- `AppleEmoji.tsx` maps raw emoji strings to high-resolution, seamless Lucide SVG vector icons (`BookText`, `Calculator`, `Landmark`, `Globe2`, `Scale`, `Trophy`, `Target`, `CheckCircle2`, `XCircle`, `MinusCircle`, `BarChart3`, etc.).
- Never render raw image emojis or wrap emojis in tinted square background boxes unless explicitly requested.

## 2. Card Architecture & Borders (`KPSSInfoCards` Standard)
- All main containers and form cards MUST follow the site's signature 3D card structure:
  - Container: `bg-white dark:bg-slate-800`
  - Borders: `border-2 border-b-4 border-slate-200 dark:border-slate-700`
  - Radius: `rounded-2xl` for stat/stepper chips, `rounded-[2.5rem]` for main containers.
  - Buttons: Physical 3D push-button style with `border-2 border-b-4` and `active:translate-y-0.5`.

## 3. Mandatory Site Color Palette Standard
STRICT RULE: NEVER use dark, muddy, or ad-hoc custom colors (such as `#3b8701` or arbitrary dark tints). ALWAYS use the site's exact canonical color palette in both Light and Dark modes:
- **Tamamlanan / Genel Kültür / Success Green**: `#58cc02` (Duolingo Green)
- **Genel UI / GY / Primary Accent Blue**: `#1cb0f6` (Duolingo Blue)
- **Matematik / Toplam Müfredat Purple**: `#af52de` (Apple Purple)
- **Tarih / Kalan Görevler / Hedef Orange**: `#ff9500` (Apple Orange)
- **Türkçe / Busis Coral**: `#F43F5E` (Koyu Mercan)
- **Coğrafya Emerald**: `#10B981` (Zümrüt Yeşili)
- **Vatandaşlık Indigo**: `#5856d6` (Apple Indigo)
- **Tehlike / Hata Red**: `#ff4b4b` (Duolingo Red)

## 4. Accuracy Calculation
- "İsabet Oranı" MUST be calculated as `(Net / Toplam Soru Sayısı) * 100`.

## 5. Active System Competencies (`Core Design & UX Standards`)
STRICT ENFORCEMENT: The following 5 active competencies MUST be strictly followed across all frontend development and UI design tasks:

- **`frontend-design`**: Modern React component architecture, semantic HTML5, clean modular design system foundation, and responsive layouts across all viewports.
- **`high-end-visual-design`**: Curated vibrant color palettes, glassmorphism, dynamic gradients, optical typography, multi-layered shadows, and optical depth.
- **`design-taste-frontend`**: Zero generic UI components, custom SVG icons (`AppleEmoji.tsx`), physical 3D push-button interactions, rounded forms (`rounded-2xl` / `rounded-[2.5rem]`), and pixel perfection.
- **`awwwards-animations`**: Smooth fluid motion, natural cubic-bezier easing, staggered entrance animations, scroll-triggered reveals, and 60fps GPU acceleration.
- **`ui-ux-pro-max`**: Complete UX state handling (loading skeletons, empty states, error recovery), real-time validation, optimistic UI updates, and touch ergonomics.

## 6. Gamification & Visual Memory Core Principle
STRICT RULE: The fundamental purpose of all gamification modules across this platform is to INCREASE RETENTION through VISUAL MEMORY (Görsel Hafıza ile Akılda Kalıcılık).
- Every rule or concept MUST be paired with color-coded mental anchors, clear visual icons (`AppleEmoji.tsx`), and intuitive visual gauges/bars.
- Gamification mechanics (drag & drop, sliders, visual progress bars) must reinforce immediate visual association so students naturally remember exam topics.
