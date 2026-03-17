# Utils

Pure utility functions organized by concern.

Use explicit imports for clarity and better tree-shaking:

```tsx
import { clamp, lerp, mapRange } from '@/utils/math'
import { slugify } from '@/utils/strings'
import { generatePageMetadata } from '@/utils/metadata'
import { tovw, torem, toem } from '@/utils/viewport'
```

## Modules

| Module | Functions |
|--------|-----------|
| `math` | `clamp`, `lerp`, `mapRange`, `modulo`, `normalize`, `distance` |
| `easings` | All easing functions (`easeOutCubic`, etc.) |
| `viewport` | `tovw`, `torem`, `toem` |
| `strings` | `slugify`, `mergeRefs`, `capitalizeFirstLetter` |
| `metadata` | `generatePageMetadata` |

## Common Patterns

```tsx
// Math
clamp(0, value, 100)
lerp(0, 100, 0.5) // → 50
mapRange(0, 1000, scrollY, 0, 1)

// Viewport units
tovw(100, 50, 'desktop') // → "max(50px, 6.94vw)"
tovw(16, undefined, 'mobile') // → "4.27vw"
torem(24) // → "1.5rem"
toem(16, 14) // → "1.14em"

// SEO
export const metadata = generatePageMetadata({ title: 'About' })
```
