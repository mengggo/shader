# Components

UI components organized by purpose.

```
components/
├── ui/        → Primitives (reusable across projects)
├── layout/    → Site chrome (customize per project)
└── magic/   → Animation & visual enhancements
```

## Direct Imports (Recommended)

```tsx
// UI Components - import directly for better clarity
import { Image } from '@/components/ui/image'
import { Link } from '@/components/ui/link'

// Layout Components
import { Wrapper } from '@/components/layout/wrapper'
import { Header } from '@/components/layout/header' 
import { Footer } from '@/components/layout/footer'

// Magic Components
import { Marquee } from '@/components/magic/marquee'
```

## UI Components

| Component | Purpose |
|-----------|---------|
| `image/` | Optimized images (always use this, never `next/image`) |
| `link/` | Smart navigation (auto-detects external) |

## Layout Components

| Component | Purpose |
|-----------|---------|
| `wrapper/` | Page wrapper (theme, WebGL, Lenis) |
| `header/` | Site header/navigation |
| `footer/` | Site footer |
| `lenis/` | Smooth scrolling |

```tsx
<Wrapper theme="dark" webgl lenis>
  <section>Your content</section>
</Wrapper>
```

## Effects Components

| Component | Purpose |
|-----------|---------|
| `marquee/` | Infinite scrolling text |

## Best Practices

```tsx
// ✅ Always use custom Image
import { Image } from '@/components/ui/image'
<Image src="/photo.jpg" alt="Photo" aspectRatio={16/9} />

// ✅ Always use custom Link
import { Link } from '@/components/ui/link'
<Link href="/about">Internal</Link>
<Link href="https://example.com">External</Link>

// ✅ CSS Modules + Tailwind
import s from './component.module.css'
<div className={cn(s.wrapper, 'flex items-center')} />
```

## Related

- [Image docs](ui/image/README.md)
- [Real Viewport docs](ui/real-viewport/README.md)
- [WebGL Components](../lib/webgl/README.md)
