/**
 * Main page wrapper providing theme, smooth scrolling, and WebGL context.
 *
 * Customize the Header and Footer components for your project needs.
 */
"use client"

import cn from "clsx"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { Theme } from "@/components/layout/theme"
import type { ThemeName } from "@/lib/styles/config"

/**
 * Props for the Wrapper component.
 */
interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Theme to apply ('dark' | 'light'). Defaults to 'dark'. */
  theme?: ThemeName
}

/**
 * Main page wrapper component providing theme.
 *
 * This component serves as the root container for pages, automatically handling
 * theme application and layout structure.
 * It includes navigation and footer.
 *
 * @param props - Component props
 * @param props.theme - Color theme to apply to the page
 * @param props.children - Page content
 * @param props.className - Additional CSS classes
 *
 * @example
 * ```tsx
 * // Basic usage with theme
 * export default function Page() {
 *   return (
 *     <Wrapper theme="dark">
 *       <section>My page content</section>
 *     </Wrapper>
 *   )
 * }
 * ```
 */
export function Wrapper({
  children,
  theme = "dark",
  className,
  ...props
}: WrapperProps) {
  return (
    <Theme theme={theme} global>
      <Header />
      <main
        id="main-content"
        className={cn("relative flex grow flex-col", className)}
        {...props}
      >
        {children}
      </main>
      <Footer />
    </Theme>
  )
}
