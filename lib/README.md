# Lib

Non-UI code: hooks, integrations, styles, and utilities.

> **Rule**: Renders UI → `components/` · Everything else → `lib/`

## Quick Imports

```tsx
// Utilities - explicit imports for better tree-shaking
import { clamp, lerp } from '@/lib/utils/math'
import { slugify } from '@/lib/utils/strings'

// Styles
import { colors, themes, breakpoints } from '@/lib/styles/config'
```

## Directories

| Directory | Purpose | Optional? |
|-----------|---------|-----------|
| [hooks/](hooks/README.md) | React hooks + Zustand store | ❌ Core |
| [styles/](styles/README.md) | CSS & Tailwind config | ❌ Core |
| [utils/](utils/README.md) | Pure utility functions | ❌ Core |

## Scripts

```bash
bun dev              # Start dev server
bun run generate     # Generate pages/components
bun run setup:project  # Configure integrations
bun setup:styles     # Regenerate CSS
```
