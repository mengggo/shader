// THIS FILE HAS TO STAY .mjs AS ITS CONSUMED BY POSTCSS
import { breakpoints } from "../layout.mjs"

/**
 * Resolves a context size to a pixel value.
 * @param {string | number} context - Context identifier or pixel value
 * @returns {number} Pixel value
 */
function resolveContext(context) {
  if (typeof context === "number") {
    return context
  }
  const numContext = Number.parseFloat(context)
  if (!Number.isNaN(numContext)) {
    return numContext
  }
  return breakpoints[context] ?? breakpoints.desktop
}

/**
 * Validates and parses a pixel value.
 * @param {string} value - Pixel value to parse
 * @returns {number} Parsed pixel value
 */
function parsePixels(value) {
  const numValue = Number.parseFloat(value)
  if (Number.isNaN(numValue)) {
    throw new Error(`Invalid pixel value: ${value}`)
  }
  return numValue
}

/**
 * Rounds a number to a maximum of 4 decimal places, removing trailing zeros.
 * @param {number} value - Number to round
 * @returns {string} Rounded number as string without trailing zeros
 */
function roundToMaxDecimals(value) {
  // Round to 4 decimal places
  const rounded = Math.round(value * 10000) / 10000
  // Convert to string and remove trailing zeros only after decimal point
  return rounded
    .toString()
    .replace(/\.0+$/, "")
    .replace(/(\.\d*?)0+$/, "$1")
}

export const functions = {
  /**
   * Converts a pixel value to viewport width units (vw).
   * Optionally applies a minimum value using CSS max().
   *
   * Supports flexible parameter patterns:
   * - `tovw(target)` - Uses default desktop context
   * - `tovw(target, min)` - Sets minimum value (numeric)
   * - `tovw(target, context)` - Sets context (string identifier)
   * - `tovw(target, min, context)` - Sets both min and context
   *
   * @param {string} target - Target pixel value to convert
   * @param {string} [minOrContext] - Minimum pixel value OR context identifier
   * @param {string} [context] - Context size identifier (if min was provided)
   * @returns {string} CSS string with vw units
   *
   * @example
   * tovw(100) // "6.94vw"
   * tovw(100, 50) // "max(50px, 6.94vw)"
   * tovw(16, 'mobile') // "4.27vw" (no need for undefined!)
   * tovw(100, 50, 'mobile') // "max(50px, 6.94vw)" with mobile context
   */
  tovw: (target, minOrContext, context) => {
    const numTarget = parsePixels(target)
    if (numTarget === 0) {
      return "0"
    }

    let min
    let resolvedContext = "desktop"

    if (minOrContext !== undefined && minOrContext !== "") {
      // Fast check: is it a known breakpoint key?
      if (minOrContext in breakpoints) {
        // Second param is context
        resolvedContext = minOrContext
        if (context !== undefined && context !== "") {
          resolvedContext = context
        }
      } else {
        // Second param is min value (numeric)
        min = parsePixels(minOrContext)
        if (context !== undefined && context !== "") {
          resolvedContext = context
        }
      }
    } else if (context !== undefined && context !== "") {
      // Only context provided as third param (legacy support)
      resolvedContext = context
    }

    const contextSize = resolveContext(resolvedContext)
    const vwValue = (numTarget / contextSize) * 100

    if (min !== undefined) {
      return `max(${min}px, ${roundToMaxDecimals(vwValue)}vw)`
    }

    return `${roundToMaxDecimals(vwValue)}vw`
  },

  /**
   * Converts a pixel value to rem units.
   *
   * @param {string} target - Target pixel value to convert
   * @param {string} [context='16'] - Base font size in pixels
   * @returns {string} CSS string with rem units
   *
   * @example
   * torem(24) // "1.5rem"
   * torem(18, 14) // "1.29rem"
   */
  torem: (target, context = "16") => {
    const numTarget = parsePixels(target)
    if (numTarget === 0) {
      return "0"
    }

    const numContext = parsePixels(context)
    return `${roundToMaxDecimals(numTarget / numContext)}rem`
  },

  /**
   * Converts a pixel value to em units.
   *
   * @param {string} target - Target pixel value to convert
   * @param {string} context - Context size in pixels (required)
   * @returns {string} CSS string with em units
   *
   * @example
   * toem(24, 16) // "1.5em"
   * toem(18, 14) // "1.29em"
   */
  toem: (target, context) => {
    const numTarget = parsePixels(target)
    if (numTarget === 0) {
      return "0"
    }

    if (!context) {
      throw new Error("toem requires a context parameter")
    }

    const numContext = parsePixels(context)
    return `${roundToMaxDecimals(numTarget / numContext)}em`
  },

  /**
   * Calculates column width based on number of columns.
   *
   * @param {string} columns - Number of columns
   * @returns {string} CSS calc expression
   */
  columns: (columns) => {
    const numColumns = Number.parseFloat(columns)
    if (Number.isNaN(numColumns)) {
      throw new Error(`Invalid column value: ${columns}`)
    }
    return `calc((${numColumns} * var(--column-width)) + ((${numColumns} - 1) * var(--gap)))`
  },
}
