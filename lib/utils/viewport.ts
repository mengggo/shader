/**
 * Viewport Utilities
 *
 * Convert pixel values to viewport-relative sizes and relative units.
 * Mirrors the SASS functions for consistent responsive scaling.
 *
 * @example
 * ```ts
 * import { tovw, torem, toem } from '@/utils/viewport'
 *
 * // Convert to viewport width units
 * const paddingX = tovw(16, 24) // "1.5625vw" with a minimum of 24px
 * const fontSize = tovw(16, 'mobile') // "4.27vw" (no undefined needed!)
 * const width = tovw(100, 50, 'desktop') // "max(50px, 6.94vw)"
 *
 * // Convert to rem/em
 * const spacing = torem(24) // "1.5rem"
 * const padding = toem(16, 14) // "1.14em"
 * ```
 *
 * ## When to Use
 *
 * - **CSS**: Prefer the PostCSS functions `tovw()`, `torem()`, and `toem()`
 * - **JavaScript/TypeScript**: Use these for dynamic calculations or inline styles
 * - **Runtime calculations**: Use for canvas, WebGL, or dynamic sizing
 */

import { breakpoints } from "@/lib/styles/config"

type ContextSize = keyof typeof breakpoints | number

/**
 * Resolves a context size to a pixel value.
 *
 * @param context - Context identifier or pixel value
 * @returns Pixel value
 */
function resolveContext(context: ContextSize): number {
  if (typeof context === "number") {
    return context
  }
  return breakpoints[context] ?? breakpoints.desktop
}

/**
 * Checks if a value is a context identifier (breakpoint key).
 *
 * @param value - Value to check
 * @returns True if value is a breakpoint key
 */
function isContextIdentifier(
  value: unknown
): value is keyof typeof breakpoints {
  return typeof value === "string" && value in breakpoints
}

/**
 * Rounds a number to a maximum of 4 decimal places, removing trailing zeros.
 *
 * @param value - Number to round
 * @returns Rounded number as string without trailing zeros
 */
function roundToMaxDecimals(value: number): string {
  // Round to 4 decimal places
  const rounded = Math.round(value * 10000) / 10000
  // Convert to string and remove trailing zeros only after decimal point
  return rounded
    .toString()
    .replace(/\.0+$/, "")
    .replace(/(\.\d*?)0+$/, "$1")
}

// Function overloads for tovw
export function tovw(target: number): string
export function tovw(target: number, min: number): string
export function tovw(target: number, context: ContextSize): string
export function tovw(target: number, min: number, context: ContextSize): string
/**
 * Converts a pixel value to viewport width units (vw).
 * Optionally applies a minimum value using CSS max().
 *
 * Supports flexible parameter patterns:
 * - `tovw(target)` - Uses default desktop context
 * - `tovw(target, min)` - Sets minimum value
 * - `tovw(target, context)` - Sets context (auto-detected if string identifier)
 * - `tovw(target, min, context)` - Sets both min and context
 *
 * @param target - Target pixel value to convert
 * @param minOrContext - Optional minimum pixel value OR context identifier
 * @param context - Context size identifier (if min was provided)
 * @returns CSS string with vw units (e.g., "6.94vw" or "max(50px, 6.94vw)")
 *
 * @example
 * ```ts
 * // Basic conversion
 * tovw(100) // "6.94vw"
 * tovw(16, 'mobile') // "4.27vw" (no undefined needed!)
 *
 * // With minimum value
 * tovw(100, 50) // "max(50px, 6.94vw)"
 * tovw(100, 50, 'mobile') // "max(50px, 6.94vw)" with mobile context
 *
 * // Custom context
 * tovw(100, 1920) // "5.21vw"
 *
 * // Handles zero
 * tovw(0) // "0"
 * ```
 */
export function tovw(
  target: number,
  minOrContext?: number | ContextSize,
  context?: ContextSize
): string {
  if (target === 0) {
    return "0"
  }

  let min: number | undefined
  let resolvedContext: ContextSize = "desktop"

  if (minOrContext !== undefined) {
    if (isContextIdentifier(minOrContext)) {
      // Second param is context
      resolvedContext = minOrContext
      if (context !== undefined) {
        resolvedContext = context
      }
    } else if (typeof minOrContext === "number") {
      // Second param is min value
      min = minOrContext
      if (context !== undefined) {
        resolvedContext = context
      }
    }
  } else if (context !== undefined) {
    // Only context provided as third param (legacy support)
    resolvedContext = context
  }

  const contextSize = resolveContext(resolvedContext)
  const vwValue = (target / contextSize) * 100

  if (min !== undefined) {
    return `max(${min}px, ${roundToMaxDecimals(vwValue)}vw)`
  }

  return `${roundToMaxDecimals(vwValue)}vw`
}

/**
 * Converts a pixel value to rem units.
 *
 * @param target - Target pixel value to convert
 * @param context - Base font size in pixels (default: 16)
 * @returns CSS string with rem units (e.g., "1.5rem")
 *
 * @example
 * ```ts
 * torem(24) // "1.5rem" (24 / 16)
 * torem(18, 14) // "1.29rem" (18 / 14)
 * torem(0) // "0"
 * ```
 */
export function torem(target: number, context = 16): string {
  if (target === 0) {
    return "0"
  }

  return `${roundToMaxDecimals(target / context)}rem`
}

/**
 * Converts a pixel value to em units.
 *
 * @param target - Target pixel value to convert
 * @param context - Context size in pixels (required)
 * @returns CSS string with em units (e.g., "1.5em")
 *
 * @example
 * ```ts
 * toem(24, 16) // "1.5em" (24 / 16)
 * toem(18, 14) // "1.29em" (18 / 14)
 * toem(0, 16) // "0"
 * ```
 */
export function toem(target: number, context: number): string {
  if (target === 0) {
    return "0"
  }

  return `${roundToMaxDecimals(target / context)}em`
}
