# Craon Video Editor Design System Specification (`/video-editor`)

This document defines the canonical design system for the `/video-editor` route in Craon.

## 1. Typography Standards

The `/video-editor` workspace uses a strict two-font system:

- **Geist Sans (`var(--font-geist-sans)`)**: Primary font used for all UI text, panel titles, button copy, input labels, tooltips, tab labels, and dialog messages.
- **Geist Mono (`var(--font-geist-mono)`)**: Monospace font reserved exclusively for timecodes (`00:00:00`), video durations, ruler tick values, frame rates, resolution metadata (`1920 × 1080`), zoom percentages, and numeric editor controls.

*Inter Variable font usage is strictly removed from the video editor route.*

---

## 2. Iconography Standards

- **Icon Package**: Official `@hugeicons/core-free-icons` and `@hugeicons/react`.
- **Stroke & Size Rules**: Icons are rendered at a default size of 14px–16px with a consistent `strokeWidth={1.5}`.
- **No Icon Mismatches**: Phosphor, Lucide, Radix visual icons, and emoji icons are excluded from the `/video-editor` interface.

---

## 3. Canonical Color Tokens

All `/video-editor` surfaces draw strictly from one canonical token per semantic role defined in `VideoEditor.module.css`:

```css
:root {
  --editor-bg: #101110;
  --editor-panel: #151615;
  --editor-panel-raised: #1A1B19;
  --editor-surface-hover: #20211F;
  --editor-surface-active: #24231F;

  --editor-accent: #E8753D;
  --editor-accent-soft: rgba(232, 117, 61, 0.12);

  --editor-text: #F3F3EF;
  --editor-text-secondary: rgba(255, 255, 255, 0.58);
  --editor-text-muted: rgba(255, 255, 255, 0.34);

  --editor-border: rgba(255, 255, 255, 0.06);
  --editor-border-strong: rgba(255, 255, 255, 0.12);
}
```

### Semantic Color Roles
- **White Primary Actions (`#F3F3EF` / `#FFFFFF`)**: Primary export CTAs, primary buttons, and crisp white brand text.
- **Orange Active / Selected States (`#E8753D`)**: Active timeline clip outlines, playhead line, snapping indicators, selected tool pills, and active focus rings.
- **Neutral Secondary Controls (`rgba(255, 255, 255, 0.58)`)**: Icon buttons, tab headers, muted action items, and secondary controls.
- **Green Status (`#86A98D`)**: Success toasts, ready indicators, and background processing completion.
- **Red Destructive (`#E55353`)**: Delete confirmations, clear clips, and warning alerts.

---

## 4. Layout & Panel Proportions

Default proportion layout configuration for the resizable editor grid:

- **AI Assistant Panel**: 23% horizontal width
- **Assets Panel**: 18% horizontal width
- **Main Workspace (Preview)**: 59% horizontal width

Inside Main Workspace:
- **Preview Player**: 66% vertical height
- **Multitrack Timeline**: 34% vertical height
