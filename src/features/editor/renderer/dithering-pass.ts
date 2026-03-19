import type * as THREE from "three/webgpu"
import {
  clamp,
  float,
  floor,
  max,
  screenSize,
  texture as tslTexture,
  type TSLNode,
  uniform,
  uv,
  vec2,
  vec3,
  vec4,
} from "three/tsl"
import { buildDitherTextures, type DitherTextures } from "@/features/editor/renderer/dither-textures"
import { PassNode } from "@/features/editor/renderer/pass-node"
import type { LayerParameterValues } from "@/features/editor/types"

type Node = TSLNode

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.trim().replace("#", "")
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((entry) => `${entry}${entry}`)
          .join("")
      : normalized.padEnd(6, "0").slice(0, 6)

  return [
    Number.parseInt(value.slice(0, 2), 16) / 255,
    Number.parseInt(value.slice(2, 4), 16) / 255,
    Number.parseInt(value.slice(4, 6), 16) / 255,
  ]
}

export class DitheringPass extends PassNode {
  private readonly colorBlueUniform: Node
  private readonly colorGreenUniform: Node
  private readonly colorRedUniform: Node
  private readonly levelsUniform: Node
  private readonly matrixSizeUniform: Node
  private readonly spreadUniform: Node
  private readonly textures: DitherTextures

  private currentTexture: THREE.DataTexture
  private ditherNode: Node | null = null

  constructor(layerId: string) {
    super(layerId)
    this.textures = buildDitherTextures()
    this.currentTexture = this.textures.bayer4
    this.levelsUniform = uniform(4)
    this.matrixSizeUniform = uniform(4)
    this.spreadUniform = uniform(0.5)
    this.colorRedUniform = uniform(0.96)
    this.colorGreenUniform = uniform(0.96)
    this.colorBlueUniform = uniform(0.94)
    this.rebuildEffectNode()
  }

  override render(
    renderer: THREE.WebGPURenderer,
    inputTexture: THREE.Texture,
    outputTarget: THREE.WebGLRenderTarget,
    time: number,
    delta: number,
  ): void {
    if (this.ditherNode) {
      this.ditherNode.value = this.currentTexture
    }

    super.render(renderer, inputTexture, outputTarget, time, delta)
  }

  override updateParams(params: LayerParameterValues): void {
    const [red, green, blue] = hexToRgb(
      typeof params.color === "string" ? params.color : "#f5f5f0",
    )

    this.colorRedUniform.value = red
    this.colorGreenUniform.value = green
    this.colorBlueUniform.value = blue
    this.levelsUniform.value =
      typeof params.levels === "number" ? Math.max(2, params.levels) : 4
    this.spreadUniform.value =
      typeof params.spread === "number"
        ? Math.max(0, Math.min(1, params.spread))
        : 0.5

    switch (params.algorithm) {
      case "bayer-8x8":
        this.currentTexture = this.textures.bayer8
        this.matrixSizeUniform.value = 8
        break
      case "blue-noise":
        this.currentTexture = this.textures.blueNoise
        this.matrixSizeUniform.value = 64
        break
      default:
        this.currentTexture = this.textures.bayer4
        this.matrixSizeUniform.value = 4
        break
    }
  }

  override dispose(): void {
    this.textures.bayer4.dispose()
    this.textures.bayer8.dispose()
    this.textures.blueNoise.dispose()
    super.dispose()
  }

  protected override buildEffectNode(): Node {
    if (!(this.levelsUniform && this.matrixSizeUniform)) {
      return this.inputNode
    }

    const pixelCoordinates = vec2(uv().x, uv().y).mul(screenSize)
    const ditherUv = pixelCoordinates.div(this.matrixSizeUniform)
    this.ditherNode = tslTexture(this.currentTexture, ditherUv)

    const src = this.inputNode
    const threshold = float(this.ditherNode.r)
    const levelsMinusOne = max(this.levelsUniform.sub(float(1)), float(1))
    const luma = float(src.r)
      .mul(float(0.2126))
      .add(float(src.g).mul(float(0.7152)))
      .add(float(src.b).mul(float(0.0722)))
    const quantized = clamp(
      floor(luma.mul(levelsMinusOne).add(threshold.mul(this.spreadUniform))).div(
        levelsMinusOne,
      ),
      float(0),
      float(1),
    )
    const tint = vec3(
      this.colorRedUniform,
      this.colorGreenUniform,
      this.colorBlueUniform,
    )
    const tinted = vec3(quantized, quantized, quantized).mul(tint)

    return vec4(tinted, float(1))
  }
}
