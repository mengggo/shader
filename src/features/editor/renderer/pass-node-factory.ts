import { AsciiPass } from "@/features/editor/renderer/ascii-pass"
import { DitheringPass } from "@/features/editor/renderer/dithering-pass"
import { PassNode } from "@/features/editor/renderer/pass-node"
import type { EffectLayerType } from "@/features/editor/types"

export function createPassNode(layerId: string, type: EffectLayerType): PassNode {
  switch (type) {
    case "ascii":
      return new AsciiPass(layerId)
    case "dithering":
      return new DitheringPass(layerId)
    default:
      return new PassNode(layerId)
  }
}
