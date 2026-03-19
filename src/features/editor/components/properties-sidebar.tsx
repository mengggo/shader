"use client"

import { useMemo } from "react"
import { getLayerDefinition } from "@/features/editor/config/layer-registry"
import type {
  EditorAsset,
  ParameterDefinition,
  ParameterValue,
  SelectParameterDefinition,
} from "@/features/editor/types"
import { ColorPicker } from "@/shared/ui/color-picker"
import { GlassPanel } from "@/shared/ui/glass-panel"
import { Select } from "@/shared/ui/select"
import { Slider } from "@/shared/ui/slider"
import { Toggle } from "@/shared/ui/toggle"
import { Typography } from "@/shared/ui/typography"
import { useAssetStore } from "@/store/assetStore"
import { useLayerStore } from "@/store/layerStore"
import s from "./properties-sidebar.module.css"

const blendModeOptions = [
  { label: "Normal", value: "normal" },
  { label: "Multiply", value: "multiply" },
  { label: "Screen", value: "screen" },
  { label: "Overlay", value: "overlay" },
  { label: "Darken", value: "darken" },
  { label: "Lighten", value: "lighten" },
] as const

const compositeModeOptions = [
  { label: "Filter", value: "filter" },
  { label: "Mask", value: "mask" },
] as const

function getSelectedAsset(
  assetById: Map<string, EditorAsset>,
  assetId: string | null,
): EditorAsset | null {
  if (!assetId) {
    return null
  }

  return assetById.get(assetId) ?? null
}

function formatLayerKind(kind: string): string {
  if (kind === "source") {
    return "Image"
  }

  return kind
}

function toColorValue(value: ParameterValue): string {
  return typeof value === "string" ? value : "#ffffff"
}

function toVec2Value(value: ParameterValue): [number, number] {
  return Array.isArray(value) && value.length === 2
    ? [value[0] ?? 0, value[1] ?? 0]
    : [0, 0]
}

function toNumberValue(value: ParameterValue, fallback = 0): number {
  return typeof value === "number" ? value : fallback
}

function toBooleanValue(value: ParameterValue): boolean {
  return value === true
}

function resolveParamValue(
  params: Record<string, ParameterValue>,
  definitions: ParameterDefinition[],
  key: string,
): ParameterValue | undefined {
  const explicitValue = params[key]
  if (explicitValue !== undefined) {
    return explicitValue
  }

  const definition = definitions.find((entry) => entry.key === key)
  return definition?.defaultValue
}

function isParamVisible(
  definition: ParameterDefinition,
  params: Record<string, ParameterValue>,
  definitions: ParameterDefinition[],
): boolean {
  if (!definition.visibleWhen) {
    return true
  }

  const controllingValue = resolveParamValue(params, definitions, definition.visibleWhen.key)
  return controllingValue === definition.visibleWhen.equals
}

export function PropertiesSidebar() {
  const selectedLayerId = useLayerStore((state) => state.selectedLayerId)
  const selectedLayer = useLayerStore((state) =>
    selectedLayerId
      ? (state.layers.find((layer) => layer.id === selectedLayerId) ?? null)
      : null,
  )
  const setLayerBlendMode = useLayerStore((state) => state.setLayerBlendMode)
  const setLayerCompositeMode = useLayerStore((state) => state.setLayerCompositeMode)
  const setLayerHue = useLayerStore((state) => state.setLayerHue)
  const setLayerOpacity = useLayerStore((state) => state.setLayerOpacity)
  const setLayerSaturation = useLayerStore((state) => state.setLayerSaturation)
  const updateLayerParam = useLayerStore((state) => state.updateLayerParam)
  const assets = useAssetStore((state) => state.assets)

  const assetById = useMemo(
    () => new Map(assets.map((asset) => [asset.id, asset])),
    [assets],
  )

  const selectedAsset = selectedLayer
    ? getSelectedAsset(assetById, selectedLayer.assetId)
    : null

  if (!selectedLayer) {
    return (
      <aside className={s.root}>
        <GlassPanel className={s.panel} variant="panel">
          <div className={s.emptyState}>
            <Typography tone="secondary" variant="overline">
              Properties
            </Typography>
            <Typography variant="body">Select a layer to edit it.</Typography>
            <Typography tone="muted" variant="caption">
              Nothing to edit yet. Create a new layer in the left panel.
            </Typography>
          </div>
        </GlassPanel>
      </aside>
    )
  }

  const definition = getLayerDefinition(selectedLayer.type)
  const visibleParams =
    selectedLayer.type === "image"
      ? []
      : definition.params.filter((param) =>
          isParamVisible(param, selectedLayer.params, [...definition.params]),
        )

  return (
    <aside className={s.root}>
      <GlassPanel className={s.panel} variant="panel">
        <div className={s.header}>
          <div className={s.kindRow}>
            <Typography tone="secondary" variant="overline">
              Properties
            </Typography>
            <span className={s.kindBadge}>{formatLayerKind(selectedLayer.type)}</span>
          </div>
          <Typography variant="title">{selectedLayer.name}</Typography>
          <Typography tone="muted" variant="monoXs">
            {selectedAsset?.fileName ?? selectedLayer.type}
          </Typography>
        </div>

        <div className={s.content}>
          <section className={s.section}>
            <Typography className={s.sectionTitle} tone="secondary" variant="overline">
              General
            </Typography>

            <div className={s.fieldStack}>
              <Slider
                label="Opacity"
                max={100}
                min={0}
                onValueChange={(value) => setLayerOpacity(selectedLayer.id, value / 100)}
                value={selectedLayer.opacity * 100}
                valueSuffix="%"
              />

              <div className={s.inlineField}>
                <Typography className={s.fieldLabel} tone="secondary" variant="label">
                  Blend
                </Typography>
                <Select
                  className={s.select ?? ""}
                  onValueChange={(value) => {
                    if (value) {
                      setLayerBlendMode(selectedLayer.id, value as typeof selectedLayer.blendMode)
                    }
                  }}
                  options={blendModeOptions}
                  value={selectedLayer.blendMode}
                />
              </div>

              <div className={s.inlineField}>
                <Typography className={s.fieldLabel} tone="secondary" variant="label">
                  Mode
                </Typography>
                <Select
                  className={s.select ?? ""}
                  onValueChange={(value) => {
                    if (value) {
                      setLayerCompositeMode(
                        selectedLayer.id,
                        value as typeof selectedLayer.compositeMode,
                      )
                    }
                  }}
                  options={compositeModeOptions}
                  value={selectedLayer.compositeMode}
                />
              </div>

              <Slider
                label="Hue"
                max={180}
                min={-180}
                onValueChange={(value) => setLayerHue(selectedLayer.id, value)}
                value={selectedLayer.hue}
              />

              <Slider
                label="Saturation"
                max={2}
                min={0}
                onValueChange={(value) => setLayerSaturation(selectedLayer.id, value)}
                step={0.01}
                value={selectedLayer.saturation}
                valueFormatOptions={{ maximumFractionDigits: 2, minimumFractionDigits: 2 }}
              />
            </div>
          </section>

          {visibleParams.length > 0 ? (
            <section className={s.section}>
              <Typography className={s.sectionTitle} tone="secondary" variant="overline">
                {definition.defaultName}
              </Typography>

              <div className={s.fieldStack}>
                {visibleParams.map((param) => (
                  <ParameterField
                    definition={param}
                    key={param.key}
                    layerId={selectedLayer.id}
                    onChange={updateLayerParam}
                    value={selectedLayer.params[param.key] ?? param.defaultValue}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </GlassPanel>
    </aside>
  )
}

function ParameterField({
  definition,
  layerId,
  onChange,
  value,
}: {
  definition: ParameterDefinition
  layerId: string
  onChange: (id: string, key: string, value: ParameterValue) => void
  value: ParameterValue
}) {
  switch (definition.type) {
    case "number":
      return (
        <Slider
          label={definition.label}
          max={definition.max ?? 100}
          min={definition.min ?? 0}
          onValueChange={(nextValue) => onChange(layerId, definition.key, nextValue)}
          step={definition.step ?? 0.01}
          value={toNumberValue(value, definition.defaultValue)}
          valueFormatOptions={{ maximumFractionDigits: 2, minimumFractionDigits: 0 }}
        />
      )

    case "select":
      return (
        <div className={s.inlineField}>
          <Typography className={s.fieldLabel} tone="secondary" variant="label">
            {definition.label}
          </Typography>
          <Select
            className={s.select ?? ""}
            onValueChange={(nextValue) => {
              if (nextValue) {
                onChange(layerId, definition.key, nextValue)
              }
            }}
            options={(definition as SelectParameterDefinition).options}
            value={typeof value === "string" ? value : definition.defaultValue}
          />
        </div>
      )

    case "boolean":
      return (
        <div className={s.inlineFieldCompact}>
          <Typography className={s.fieldLabel} tone="secondary" variant="label">
            {definition.label}
          </Typography>
          <Toggle
            checked={toBooleanValue(value)}
            className={s.toggleWrap ?? ""}
            onCheckedChange={(nextValue) => onChange(layerId, definition.key, nextValue)}
          />
        </div>
      )

    case "color":
      return (
        <div className={s.inlineField}>
          <Typography className={s.fieldLabel} tone="secondary" variant="label">
            {definition.label}
          </Typography>
          <ColorPicker
            onValueChange={(nextValue) => onChange(layerId, definition.key, nextValue)}
            value={toColorValue(value)}
          />
        </div>
      )

    case "vec2": {
      const [x, y] = toVec2Value(value)

      return (
        <div className={s.vec2Group}>
          <Typography className={s.fieldLabel} tone="secondary" variant="label">
            {definition.label}
          </Typography>
          <Slider
            className={s.subSlider ?? ""}
            label="X"
            max={definition.max ?? 1}
            min={definition.min ?? -1}
            onValueChange={(nextValue) => onChange(layerId, definition.key, [nextValue, y])}
            step={definition.step ?? 0.01}
            value={x}
            valueFormatOptions={{ maximumFractionDigits: 2, minimumFractionDigits: 2 }}
          />
          <Slider
            className={s.subSlider ?? ""}
            label="Y"
            max={definition.max ?? 1}
            min={definition.min ?? -1}
            onValueChange={(nextValue) => onChange(layerId, definition.key, [x, nextValue])}
            step={definition.step ?? 0.01}
            value={y}
            valueFormatOptions={{ maximumFractionDigits: 2, minimumFractionDigits: 2 }}
          />
        </div>
      )
    }

    default:
      return null
  }
}
