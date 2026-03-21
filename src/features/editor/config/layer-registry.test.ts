import { describe, expect, it } from "bun:test"
import { getLayerDefinition } from "@/features/editor/config/layer-registry"
import { isParamVisible } from "@/features/editor/components/properties-sidebar-utils"
import { buildParameterValues } from "@/features/editor/utils/parameter-schema"

describe("CRT layer registry", () => {
  it("provides the new CRT defaults without migration", () => {
    const definition = getLayerDefinition("crt")
    const params = buildParameterValues(definition.params)

    expect(params.crtMode).toBe("slot-mask")
    expect(params.cellSize).toBe(3)
    expect(params.beamFocus).toBe(0.58)
    expect(params.brightness).toBe(1.2)
    expect(params.highlightDrive).toBe(1)
    expect(params.highlightThreshold).toBe(0.62)
    expect(params.shoulder).toBe(0.25)
    expect(params.chromaRetention).toBe(1.15)
    expect(params.shadowLift).toBe(0.16)
    expect(params.persistence).toBe(0.18)
    expect(params.signalArtifacts).toBe(0.45)
    expect(params.chromaticAberration).toBe(2)
  })

  it("only shows signal artifacts for composite TV mode", () => {
    const definition = getLayerDefinition("crt")
    const signalArtifacts = definition.params.find((param) => param.key === "signalArtifacts")

    expect(signalArtifacts).not.toBeUndefined()

    expect(
      isParamVisible(signalArtifacts!, { crtMode: "slot-mask" }, [...definition.params]),
    ).toBe(false)
    expect(
      isParamVisible(signalArtifacts!, { crtMode: "aperture-grille" }, [...definition.params]),
    ).toBe(false)
    expect(
      isParamVisible(signalArtifacts!, { crtMode: "composite-tv" }, [...definition.params]),
    ).toBe(true)
  })
})
