import { Wrapper } from "@/components/layout/wrapper"
import { Link } from "@/components/ui/link"
import { colors } from "@/lib/styles/colors"
import { breakpoints, layout } from "@/lib/styles/layout.mjs"

const TECH_STACK = [
  { description: "App Router, Turbopack", name: "Next.js", version: "16.1" },
  { description: "React Compiler enabled", name: "React", version: "19" },
  { description: "Strict mode", name: "TypeScript", version: "5.9" },
  { description: "CSS-first config", name: "Tailwind CSS", version: "4" },
  { description: "Lint + Format", name: "Biome", version: "2.3" },
  { description: "Package manager", name: "Bun", version: "1.3" },
]

const FEATURES = [
  {
    description:
      "Pre-configured colors, breakpoints, typography, and 30+ easing functions ready to use.",
    title: "Design System",
  },
  {
    description:
      "Enhanced Image and Link components with blur placeholders, connection-aware prefetching.",
    title: "Smart Components",
  },
  {
    description:
      "Light/dark theme with CSS custom properties and React context.",
    title: "Theme Support",
  },
  {
    description:
      "Custom scripts for component scaffolding, style generation, and HTTPS dev server.",
    title: "Developer Experience",
  },
  {
    description:
      "Bundle analyzer, optimized imports, security headers, and image optimization.",
    title: "Performance Optimized",
  },
]

const SCRIPTS = [
  { cmd: "bun dev", desc: "Start development server" },
  { cmd: "bun dev:https", desc: "Start with HTTPS" },
  { cmd: "bun build", desc: "Build for production" },
  { cmd: "bun generate", desc: "Scaffold components" },
  { cmd: "bun lint:fix", desc: "Fix lint issues" },
  { cmd: "bun typecheck", desc: "Type check with tsgo" },
]

const VERSION = "1.0.0"

export default function Home() {
  return (
    <Wrapper theme="dark">
      {/* Hero */}
      <section className="flex min-h-[80vh] flex-col justify-center px-safe pt-header-height">
        <div className="max-w-3xl">
          <p className="font-mono text-contrast text-sm uppercase tracking-wider">
            Next.js Starter Template v{VERSION}
          </p>
          <h1 className="mt-4 font-semibold text-4xl leading-tight tracking-tight md:text-6xl">
            Basement Next Starter
          </h1>
          <p className="mt-6 max-w-xl text-lg text-secondary/70">
            A production-ready Next.js starter with React 19, Tailwind CSS v4,
            TypeScript strict mode, and everything you need to build modern web
            applications.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 font-mono text-sm uppercase">
            <Link
              href="https://github.com/basementstudio/next-starter/generate"
              className="bg-secondary px-6 py-3 text-primary transition-opacity hover:opacity-80"
            >
              Use this template
            </Link>
            <Link
              href="https://github.com/basementstudio/next-starter"
              className="border border-secondary/30 px-6 py-3 transition-colors hover:border-secondary"
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-safe py-24">
        <h2 className="font-mono text-contrast text-sm uppercase tracking-wider">
          Tech Stack
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="border border-secondary/10 p-6 transition-colors hover:border-secondary/30"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-lg">{tech.name}</span>
                <span className="font-mono text-contrast text-sm">
                  v{tech.version}
                </span>
              </div>
              <p className="mt-2 text-secondary/60 text-sm">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-safe py-24">
        <h2 className="font-mono text-contrast text-sm uppercase tracking-wider">
          Features
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title}>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="mt-2 text-secondary/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Design System */}
      <section className="px-safe py-24">
        <h2 className="font-mono text-contrast text-sm uppercase tracking-wider">
          Design System
        </h2>

        {/* Colors */}
        <div className="mt-8">
          <h3 className="font-mono text-secondary/60 text-xs uppercase">
            Colors
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(colors).map(([name, value]) => (
              <div key={name} className="flex items-center gap-2">
                <div
                  className="size-8 rounded border border-secondary/20"
                  style={{ backgroundColor: value }}
                />
                <div className="font-mono text-xs">
                  <div className="text-secondary">{name}</div>
                  <div className="text-secondary/40">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakpoints */}
        <div className="mt-12">
          <h3 className="font-mono text-secondary/60 text-xs uppercase">
            Breakpoints
          </h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {Object.entries(breakpoints).map(([name, value]) => (
              <div
                key={name}
                className="border border-secondary/10 px-4 py-2 font-mono text-sm"
              >
                <span className="text-secondary">{name}</span>
                <span className="ml-2 text-secondary/40">{value}px</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-12">
          <h3 className="font-mono text-secondary/60 text-xs uppercase">
            Grid System
          </h3>
          <div className="mt-4 flex gap-8 font-mono text-sm">
            <div>
              <span className="text-secondary/40">Mobile:</span>{" "}
              <span className="text-secondary">
                {layout.columns.mobile} columns
              </span>
            </div>
            <div>
              <span className="text-secondary/40">Desktop:</span>{" "}
              <span className="text-secondary">
                {layout.columns.desktop} columns
              </span>
            </div>
            <div>
              <span className="text-secondary/40">Gap:</span>{" "}
              <span className="text-secondary">{layout.gap.desktop}px</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="px-safe py-24">
        <h2 className="font-mono text-contrast text-sm uppercase tracking-wider">
          Quick Start
        </h2>

        <div className="mt-8 max-w-2xl">
          <div className="border border-secondary/10 bg-secondary/5 p-6 font-mono text-sm">
            <div className="text-secondary/40"># Clone the template</div>
            <div className="mt-1 text-secondary">
              bunx degit basementstudio/next-starter my-project
            </div>
            <div className="mt-4 text-secondary/40"># Install dependencies</div>
            <div className="mt-1 text-secondary">
              cd my-project && bun install
            </div>
            <div className="mt-4 text-secondary/40"># Start development</div>
            <div className="mt-1 text-secondary">bun dev</div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="font-mono text-secondary/60 text-xs uppercase">
            Available Scripts
          </h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SCRIPTS.map((script) => (
              <div
                key={script.cmd}
                className="flex items-center justify-between border border-secondary/10 px-4 py-3 font-mono text-sm"
              >
                <code className="text-secondary">{script.cmd}</code>
                <span className="text-secondary/40">{script.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Structure */}
      <section className="px-safe py-24">
        <h2 className="font-mono text-contrast text-sm uppercase tracking-wider">
          Project Structure
        </h2>
        <div className="mt-8 max-w-2xl border border-secondary/10 bg-secondary/5 p-6 font-mono text-sm leading-relaxed">
          <pre className="text-secondary/80">
            {`app/                 # Next.js pages and routes
components/
  ├── layout/        # Header, Footer, Wrapper, Theme
  └── ui/            # Image, Link, SanityImage
lib/
  ├── hooks/         # useDeviceDetection, useMediaBreakpoint
  ├── scripts/       # Dev tools, generators
  ├── store/         # Zustand global state
  ├── styles/        # Design tokens, CSS config
  └── utils/         # Easings, math, strings, fetch`}
          </pre>
        </div>
      </section>

      {/* CTA */}
      <section className="px-safe py-24 text-center">
        <p className="font-mono text-secondary/60 text-sm uppercase">
          Ready to build something great?
        </p>
        <div className="mt-6 flex justify-center gap-4 font-mono text-sm uppercase">
          <Link
            href="https://github.com/basementstudio/next-starter/generate"
            className="bg-contrast px-8 py-4 text-primary transition-opacity hover:opacity-80"
          >
            Get Started
          </Link>
        </div>
      </section>
    </Wrapper>
  )
}
