import { useMedia } from "react-use"
import { breakpoints } from "@/lib/styles/config"

/**
 * Hook for detecting if the viewport is at a specific breakpoint.
 *
 * @param breakpoint - The breakpoint to detect
 * @returns True if the viewport is at the breakpoint
 */
export function useMediaBreakpoint(
  breakpoint: keyof typeof breakpoints,
  defaultState = false
) {
  return useMedia(`(min-width: ${breakpoints[breakpoint]}px)`, defaultState)
}
