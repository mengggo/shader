# Styles

Hybrid styling with Tailwind CSS v4 and custom PostCSS functions.

## PostCSS Functions

```css
/* Viewport-relative sizing */
.element {
  width: tovw(100);                    /* 6.94vw (100px at 1440px) */
  width: tovw(100, 50);                 /* max(50px, 6.94vw) */
  width: tovw(16, undefined, 'mobile'); /* 4.27vw (16px at 375px) */
}

/* Relative units */
.text {
  font-size: torem(24);    /* 1.5rem (24px / 16px) */
  padding: toem(16, 14);   /* 1.14em (16px / 14px) */
}

/* Grid columns */
.sidebar {
  width: columns(3);       /* Spans 3 columns + gaps */
}
```

## Custom Utilities (`dr-*`)

```tsx
// Responsive sizing (scales with viewport)
<div className="dr-w-150 dr-h-100" />

// Column-based sizing
<div className="dr-w-col-4" />  {/* 4 columns wide */}

// Grid layout
<div className="dr-grid" />     {/* 4 cols mobile, 12 cols desktop */}
```

## Breakpoints

```css
@media (--mobile) { /* >= 640px */ }
@media (--tablet) { /* >= 768px */ }
@media (--tablet-lg) { /* >= 1024px */ }
@media (--desktop) { /* >= 1440px */ }
@media (--desktop-large) { /* >= 1920px */ }
```

## Configuration

| File | Purpose |
|------|---------|
| `colors.ts` | Color palette & themes |
| `typography.ts` | Font sizes & weights |
| `layout.mjs` | Grid, breakpoints, spacing |
| `easings.ts` | Animation curves |
| `fonts.ts` | Font loading |

After changing config: `bun setup:styles`

## Generated Files (Don't Edit)

- `css/root.css` — CSS custom properties
- `css/tailwind.css` — Tailwind utilities

See [scripts/README.md](scripts/README.md) for generation details.
