import { describe, expect, it } from "bun:test"
import { CrtPass } from "@/features/editor/renderer/crt-pass"

describe("CrtPass", () => {
  it("can switch modes, enable persistence, and rebuild bloom safely", () => {
    const pass = new CrtPass("crt-test")

    expect(() =>
      pass.updateParams({
        beamFocus: 0.66,
        bloomEnabled: true,
        bloomIntensity: 2.1,
        crtMode: "slot-mask",
        persistence: 0.24,
      }),
    ).not.toThrow()

    expect(pass.needsContinuousRender()).toBe(true)

    expect(() =>
      pass.updateParams({
        bloomEnabled: false,
        crtMode: "aperture-grille",
        persistence: 0,
      }),
    ).not.toThrow()

    expect(() =>
      pass.updateParams({
        bloomEnabled: true,
        crtMode: "composite-tv",
        persistence: 0.18,
        signalArtifacts: 0.55,
      }),
    ).not.toThrow()

    pass.resize(640, 360)
    pass.updateLogicalSize(960, 540)

    expect(pass.getMaterialVersion()).toBeGreaterThanOrEqual(0)

    expect(() => pass.dispose()).not.toThrow()
  })
})
