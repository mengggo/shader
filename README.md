# Basement Next Starter

A production-ready Next.js starter with React 19, Tailwind CSS v4, TypeScript strict mode, and everything you need to build modern web applications.

## Tech Stack

| Technology | Version | Description |
|------------|---------|-------------|
| Next.js | 16.1 | App Router, Turbopack |
| React | 19 | React Compiler enabled |
| TypeScript | 5.9 | Strict mode, `noUncheckedIndexedAccess` |
| Tailwind CSS | 4 | CSS-first configuration |
| Biome | 2.3 | Linting and formatting |
| Bun | 1.3 | Package manager and runtime |
| Zustand | 5.0 | State management |

## Quick Start

```bash
# Clone the template
bunx degit basementstudio/next-starter my-project

# Install dependencies
cd my-project && bun install

# Start development
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server with Turbopack |
| `bun dev:https` | Start with HTTPS (for secure contexts) |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun generate` | Scaffold new components/hooks |
| `bun lint` | Run Biome linter |
| `bun lint:fix` | Fix lint issues |
| `bun format` | Format code with Biome |
| `bun typecheck` | Type check with tsgo |
| `bun test` | Run tests with Bun |
| `bun analyze` | Analyze bundle size |

## Project Structure

```
app/                     # Next.js App Router pages and routes
  ├── api/               # API routes (draft-mode, revalidate)
  ├── layout.tsx         # Root layout with metadata, fonts
  ├── page.tsx           # Homepage
  ├── sitemap.ts         # Dynamic sitemap generation
  └── robots.ts          # SEO robots.txt

components/
  ├── layout/
  │   ├── header/        # Navigation header
  │   ├── footer/        # Page footer
  │   ├── wrapper/       # Page wrapper with theme
  │   └── theme/         # Theme context provider
  └── ui/
      ├── image/         # Enhanced Next.js Image wrapper
      └── link/          # Smart Link component

lib/
  ├── hooks/                      # Custom React hooks
  │   ├── use-device-detection/   # Device/capability detection
  │   ├── use-media-breakpoint/   # Responsive breakpoint hook
  │   └── use-prefetch/           # Prefetch utilities
  ├── integrations/               # Third-party integrations
  ├── scripts/                    # Build and dev scripts
  ├── store/                      # Zustand global state
  ├── styles/                     # Design tokens, CSS config
  │   ├── colors.ts               # Theme colors
  │   ├── layout.mjs              # Breakpoints, grid, spacing
  │   ├── easings.ts              # CSS easing variables
  │   └── fonts.ts                # Font loading (Geist Mono)
  └── utils/                      # Utility functions
      ├── easings.ts              # 30+ animation easing functions
      ├── math.ts                 # Math utilities
      ├── strings.ts              # String utilities
      └── fetch.ts                # Fetch utilities
```

## Features

### Design System

Pre-configured design tokens ready to use:

**Breakpoints:**
- `mobile`: 375px
- `tablet`: 620px
- `tablet-lg`: 1024px
- `desktop`: 1440px
- `desktop-large`: 1920px

**Grid:**
- Mobile: 4 columns
- Desktop: 12 columns
- Gap: 16px

**Colors:**
- Theme colors: `primary`, `secondary`, `contrast`
- Accent colors: `red`, `blue`, `green`, `violet`, `pink`
- Light/dark mode support

**Easings:**
30+ easing functions (quad, cubic, quart, quint, sine, expo, circ, back, elastic, bounce)

### Smart Components

**`<Image>`** - Enhanced Next.js Image wrapper:
- Automatic responsive sizes based on breakpoints
- Blur placeholder with shimmer effect
- Preload support for LCP images
- SVG handling

**`<Link>`** - Intelligent link component:
- Auto-detects external links (opens in new tab)
- Connection-aware prefetching (4G only, respects data saver)
- Falls back to button/div when no href
- Active state detection

**`<Wrapper>`** - Page layout component:
- Includes Header and Footer
- Theme provider integration
- Flexible content area

### Theme Support

Light/dark theme with CSS custom properties:

```tsx
import { Wrapper } from "@/components/layout/wrapper"

export default function Page() {
  return (
    <Wrapper theme="dark">
      <section>Your content</section>
    </Wrapper>
  )
}
```

Access theme in components:

```tsx
import { useTheme } from "@/components/layout/theme"

function Component() {
  const { name, setThemeName } = useTheme()
  // ...
}
```

### Performance Optimizations

- **React Compiler** - Automatic memoization (no manual `useMemo`/`useCallback`)
- **Turbopack** - Fast development builds
- **Bundle Analyzer** - `bun analyze` to inspect bundle size
- **Optimized Imports** - Auto-optimization for GSAP, Three.js, Lenis, Zustand
- **Security Headers** - CSP, HSTS, XSS protection pre-configured
- **Image Optimization** - AVIF, WebP with custom quality settings

### Developer Experience

- **Component Scaffolding** - `bun generate` to create components/hooks
- **HTTPS Dev Server** - `bun dev:https` for secure contexts
- **Strict TypeScript** - `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- **Biome** - Fast linting and formatting with custom rules
- **Tests** - Bun test runner with utilities

## Configuration

### Styles

Edit design tokens in `lib/styles/`:

- `colors.ts` - Theme and accent colors
- `layout.mjs` - Breakpoints, grid, spacing
- `typography.ts` - Font definitions
- `easings.ts` - CSS easing variables

After editing, regenerate CSS:

```bash
bun setup:styles
```

### Next.js

Configuration in `next.config.ts`:

- React Compiler enabled
- Typed routes
- SVG loader (@svgr/webpack)
- Security headers
- Image optimization settings

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/basementstudio/next-starter)

### Other Platforms

```bash
bun build
bun start
```

The app runs on port 3000 by default.

## License

MIT
