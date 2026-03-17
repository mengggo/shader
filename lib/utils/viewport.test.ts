/**
 * Unit tests for viewport utilities
 *
 * Run with: bun test lib/utils/viewport.test.ts
 */

import { describe, expect, it } from "bun:test"
import { toem, torem, tovw } from "./viewport"

// Helper to check vw values with floating point tolerance
function expectVw(actual: string, expectedVw: number) {
  const match = actual.match(/^([\d.]+)vw$/)
  if (!match?.[1]) {
    throw new Error(`Expected vw format, got: ${actual}`)
  }
  const actualVw = Number.parseFloat(match[1])
  expect(actualVw).toBeCloseTo(expectedVw, 4)
}

// Helper to check max() values with floating point tolerance
function expectMaxVw(actual: string, expectedMin: number, expectedVw: number) {
  const match = actual.match(/^max\((\d+)px, ([\d.]+)vw\)$/)
  if (!(match?.[1] && match[2])) {
    throw new Error(`Expected max() format, got: ${actual}`)
  }
  const actualMin = Number.parseFloat(match[1])
  const actualVw = Number.parseFloat(match[2])
  expect(actualMin).toBe(expectedMin)
  expect(actualVw).toBeCloseTo(expectedVw, 4)
}

describe("tovw", () => {
  describe("basic conversion (default desktop context)", () => {
    it("should convert pixels to vw with default desktop context (1440px)", () => {
      expectVw(tovw(100), 6.9444)
      expect(tovw(1440)).toBe("100vw")
      expect(tovw(720)).toBe("50vw")
    })

    it("should handle zero", () => {
      expect(tovw(0)).toBe("0")
    })
  })

  describe("with minimum value", () => {
    it("should apply minimum value using max()", () => {
      expectMaxVw(tovw(100, 50), 50, 6.9444)
      expectMaxVw(tovw(200, 100), 100, 13.8889)
    })

    it("should handle zero target with min", () => {
      expect(tovw(0, 50)).toBe("0")
    })
  })

  describe("with context identifier", () => {
    it("should use mobile context (375px)", () => {
      expectVw(tovw(16, "mobile"), 4.2667)
      expect(tovw(375, "mobile")).toBe("100vw")
    })

    it("should use desktop-large context (1920px)", () => {
      expectVw(tovw(100, "desktop-large"), 5.2083)
      expect(tovw(1920, "desktop-large")).toBe("100vw")
    })

    it("should use tablet-lg context (1024px)", () => {
      expectVw(tovw(100, "tablet-lg"), 9.7656)
      expect(tovw(1024, "tablet-lg")).toBe("100vw")
    })

    it("should use tablet context (620px)", () => {
      expectVw(tovw(100, "tablet"), 16.129)
      expect(tovw(620, "tablet")).toBe("100vw")
    })

    it("should use desktop context explicitly", () => {
      expectVw(tovw(100, "desktop"), 6.9444)
    })
  })

  describe("with custom numeric context", () => {
    it("should use custom pixel context as third parameter", () => {
      // Numeric contexts must be passed as third parameter (with undefined min)
      // Using type assertion to test the implementation behavior
      expectVw(tovw(100, 1920), 5.2083)
      expectVw(tovw(100, 800), 12.5)
      expectVw(tovw(100, 2000), 5)
    })

    it("should treat numeric second parameter as min, not context", () => {
      // When second param is a number, it's treated as min, not context
      expectMaxVw(tovw(100, 1920), 1920, 6.9444)
    })
  })

  describe("with both min and context", () => {
    it("should apply min and context together", () => {
      expectMaxVw(tovw(100, 50, "mobile"), 50, 26.6667)
      expectMaxVw(tovw(200, 100, "desktop-large"), 100, 10.4167)
    })

    it("should use numeric context with min", () => {
      expectMaxVw(tovw(100, 50, 1920), 50, 5.2083)
    })
  })

  describe("edge cases", () => {
    it("should handle very small values", () => {
      expectVw(tovw(1), 0.0694)
      expectVw(tovw(0.5), 0.0347)
    })

    it("should handle very large values", () => {
      expectVw(tovw(5000), 347.2222)
    })

    it("should handle decimal values", () => {
      expectVw(tovw(16.5), 1.1458)
      expectVw(tovw(16.5, "mobile"), 4.4)
    })
  })
})

describe("torem", () => {
  describe("basic conversion (default 16px context)", () => {
    it("should convert pixels to rem with default context", () => {
      expect(torem(16)).toBe("1rem")
      expect(torem(24)).toBe("1.5rem")
      expect(torem(32)).toBe("2rem")
      expect(torem(8)).toBe("0.5rem")
    })

    it("should handle zero", () => {
      expect(torem(0)).toBe("0")
    })
  })

  describe("with custom context", () => {
    it("should use custom base font size", () => {
      // Using toBeCloseTo for floating point comparison
      const result1 = torem(18, 14)
      const match1 = result1.match(/^([\d.]+)rem$/)
      expect(Number.parseFloat(match1?.[1] || "0")).toBeCloseTo(
        1.2857142857142858,
        4
      )

      expect(torem(20, 10)).toBe("2rem")
      expect(torem(24, 12)).toBe("2rem")
    })

    it("should handle zero with custom context", () => {
      expect(torem(0, 14)).toBe("0")
    })
  })

  describe("edge cases", () => {
    it("should handle decimal values", () => {
      const result1 = torem(16.5)
      const match1 = result1.match(/^([\d.]+)rem$/)
      // 16.5 / 16 = 1.03125, rounded to 4 decimals = 1.0313
      expect(Number.parseFloat(match1?.[1] || "0")).toBeCloseTo(1.0313, 4)

      const result2 = torem(18.5, 14)
      const match2 = result2.match(/^([\d.]+)rem$/)
      // 18.5 / 14 = 1.3214285714285714, rounded to 4 decimals = 1.3214
      expect(Number.parseFloat(match2?.[1] || "0")).toBeCloseTo(1.3214, 4)
    })

    it("should handle very small values", () => {
      const result1 = torem(1)
      const match1 = result1.match(/^([\d.]+)rem$/)
      expect(Number.parseFloat(match1?.[1] || "0")).toBeCloseTo(0.0625, 4)

      const result2 = torem(0.5)
      const match2 = result2.match(/^([\d.]+)rem$/)
      // 0.5 / 16 = 0.03125, rounded to 4 decimals = 0.0313
      expect(Number.parseFloat(match2?.[1] || "0")).toBeCloseTo(0.0313, 4)
    })

    it("should handle very large values", () => {
      expect(torem(100)).toBe("6.25rem")
      expect(torem(200)).toBe("12.5rem")
    })
  })
})

describe("toem", () => {
  describe("basic conversion", () => {
    it("should convert pixels to em", () => {
      expect(toem(24, 16)).toBe("1.5em")
      expect(toem(16, 16)).toBe("1em")
      expect(toem(32, 16)).toBe("2em")
      expect(toem(8, 16)).toBe("0.5em")
    })

    it("should handle zero", () => {
      expect(toem(0, 16)).toBe("0")
    })
  })

  describe("with different contexts", () => {
    it("should use custom context size", () => {
      const result1 = toem(18, 14)
      const match1 = result1.match(/^([\d.]+)em$/)
      expect(Number.parseFloat(match1?.[1] || "0")).toBeCloseTo(
        1.2857142857142858,
        4
      )

      expect(toem(20, 10)).toBe("2em")
      expect(toem(24, 12)).toBe("2em")
    })

    it("should handle zero with different contexts", () => {
      expect(toem(0, 14)).toBe("0")
      expect(toem(0, 20)).toBe("0")
    })
  })

  describe("edge cases", () => {
    it("should handle decimal values", () => {
      const result1 = toem(16.5, 16)
      const match1 = result1.match(/^([\d.]+)em$/)
      // 16.5 / 16 = 1.03125, rounded to 4 decimals = 1.0313
      expect(Number.parseFloat(match1?.[1] || "0")).toBeCloseTo(1.0313, 4)

      const result2 = toem(18.5, 14)
      const match2 = result2.match(/^([\d.]+)em$/)
      // 18.5 / 14 = 1.3214285714285714, rounded to 4 decimals = 1.3214
      expect(Number.parseFloat(match2?.[1] || "0")).toBeCloseTo(1.3214, 4)
    })

    it("should handle very small values", () => {
      const result1 = toem(1, 16)
      const match1 = result1.match(/^([\d.]+)em$/)
      expect(Number.parseFloat(match1?.[1] || "0")).toBeCloseTo(0.0625, 4)

      const result2 = toem(0.5, 16)
      const match2 = result2.match(/^([\d.]+)em$/)
      // 0.5 / 16 = 0.03125, rounded to 4 decimals = 0.0313
      expect(Number.parseFloat(match2?.[1] || "0")).toBeCloseTo(0.0313, 4)
    })

    it("should handle very large values", () => {
      expect(toem(100, 16)).toBe("6.25em")
      expect(toem(200, 16)).toBe("12.5em")
    })

    it("should handle context larger than target", () => {
      expect(toem(8, 16)).toBe("0.5em")
      expect(toem(4, 16)).toBe("0.25em")
    })
  })
})
