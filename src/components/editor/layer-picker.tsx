"use client"

import {
  CameraIcon,
  CodeIcon,
  GradientIcon,
  ImageIcon,
  PlusIcon,
  TextTIcon,
  VideoCameraIcon,
} from "@phosphor-icons/react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import Image from "next/image"
import {
  type ComponentType,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { GlassPanel } from "@/components/ui/glass-panel"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/cn"

export type AddLayerAction =
  | "ascii"
  | "circuit-bent"
  | "directional-blur"
  | "chromatic-aberration"
  | "crt"
  | "custom-shader"
  | "displacement-map"
  | "dithering"
  | "edge-detect"
  | "fluted-glass"
  | "gradient"
  | "halftone"
  | "image"
  | "ink"
  | "live"
  | "particle-grid"
  | "pixelation"
  | "pattern"
  | "pixel-sorting"
  | "plotter"
  | "posterize"
  | "slice"
  | "smear"
  | "threshold"
  | "text"
  | "video"

type LayerPickerCategory = "all" | "core" | "distort"

type SourceItem = {
  icon: ComponentType<{ size: number; weight: "regular" | "bold" }>
  label: string
  value: AddLayerAction
}

type EffectItem = {
  category: Exclude<LayerPickerCategory, "all">
  description?: string
  label: string
  previewSrc?: string
  value: AddLayerAction
}

type LayerPickerProps = {
  className?: string
  onSelect: (action: AddLayerAction) => void
}

const CATEGORY_OPTIONS: readonly {
  label: string
  value: LayerPickerCategory
}[] = [
  { label: "全部", value: "all" },
  { label: "基础", value: "core" },
  { label: "扭曲", value: "distort" },
] as const

const SOURCE_ITEMS: readonly SourceItem[] = [
  { icon: ImageIcon, label: "图像", value: "image" },
  { icon: VideoCameraIcon, label: "视频", value: "video" },
  { icon: CameraIcon, label: "摄像头", value: "live" },
  { icon: TextTIcon, label: "文字", value: "text" },
  { icon: GradientIcon, label: "网格渐变", value: "gradient" },
  { icon: CodeIcon, label: "自定义着色器", value: "custom-shader" },
] as const

const EFFECT_ITEMS: readonly EffectItem[] = [
  {
    category: "core",
    description: "将图像转换为字符字形，呈现经典终端风格。",
    label: "ASCII",
    previewSrc: "/examples/ascii.webp",
    value: "ascii",
  },
  {
    category: "core",
    description: "添加涂抹发光与流体渗色，模拟霓虹墨水边缘效果。",
    label: "油墨",
    previewSrc: "/examples/ink.webp",
    value: "ink",
  },
  {
    category: "core",
    description: "将源图像映射为可重复的编织纹理与图形肌理。",
    label: "图案",
    previewSrc: "/examples/pattern.webp",
    value: "pattern",
  },
  {
    category: "core",
    description: "添加扫描线、荧光晕染与老式显示器噪点。",
    label: "CRT",
    previewSrc: "/examples/crt.webp",
    value: "crt",
  },
  {
    category: "core",
    description: "将色彩精度降低为有序或纹理抖动效果。",
    label: "抖动",
    previewSrc: "/examples/dithering.webp",
    value: "dithering",
  },
  {
    category: "core",
    description: "将帧转换为图形网点屏幕与印刷纹理。",
    label: "半色调",
    previewSrc: "/examples/halftone.webp",
    value: "halftone",
  },
  {
    category: "core",
    description: "将图像分解为发光粒子矩阵。",
    label: "粒子网格",
    previewSrc: "/examples/particle-grid.webp",
    value: "particle-grid",
  },
  {
    category: "core",
    description: "将相邻像素归并为更大色块，呈现低分辨率风格。",
    label: "像素化",
    previewSrc: "/examples/pixelation.webp",
    value: "pixelation",
  },
  {
    category: "core",
    description: "将色调压缩为更少层级，保留图形化外观。",
    label: "色调分离",
    previewSrc: "/examples/posterize.webp",
    value: "posterize",
  },
  {
    category: "core",
    description: "将帧转为高对比黑白，可控截止值与颗粒感。",
    label: "阈值",
    previewSrc: "/examples/threshold.webp",
    value: "threshold",
  },
  {
    category: "core",
    description: "绘图机美学，支持排线、交叉排线与墨水模拟。",
    label: "绘图机",
    previewSrc: "/examples/plotter.webp",
    value: "plotter",
  },
  {
    category: "distort",
    description: "渲染亮度门控扫描线，并围绕吸引子弯曲变形。",
    label: "电路弯折",
    previewSrc: "/examples/circuit-bent.webp",
    value: "circuit-bent",
  },
  {
    category: "distort",
    description: "沿线性或径向方向涂抹像素，模拟运动、焦外或景深。",
    label: "方向模糊",
    previewSrc: "/examples/directional-blur.webp",
    value: "directional-blur",
  },
  {
    category: "distort",
    description: "按亮度或色彩将相邻像素排序成拉丝条纹。",
    label: "像素排序",
    previewSrc: "/examples/pixel-sorting.webp",
    value: "pixel-sorting",
  },
  {
    category: "distort",
    description: "将水平切片偏移为块状故障条纹。",
    label: "切片",
    previewSrc: "/examples/slice.webp",
    value: "slice",
  },
  {
    category: "distort",
    description: "提取对比度边缘，转化为图形轮廓线。",
    label: "边缘检测",
    previewSrc: "/examples/edge-detect.webp",
    value: "edge-detect",
  },
  {
    category: "distort",
    description: "沿亮度方向推动像素，生成扭曲置换场。",
    label: "置换贴图",
    previewSrc: "/examples/displacement-map.webp",
    value: "displacement-map",
  },
  {
    category: "distort",
    description: "偏移色彩通道，产生色边与镜头分离效果。",
    label: "色差",
    previewSrc: "/examples/chromatic-aberration.webp",
    value: "chromatic-aberration",
  },
  {
    category: "distort",
    description: "从锐利到柔和的渐进模糊，可控范围。",
    label: "渐进模糊",
    previewSrc: "/examples/progressive-blur.webp",
    value: "smear",
  },
  {
    category: "distort",
    description: "竖纹透镜玻璃扭曲，带有细微色差分离。",
    label: "竖纹玻璃",
    previewSrc: "/examples/fluted-glass.webp",
    value: "fluted-glass",
  },
] as const

function LayerPickerInfoButton({
  description,
  reduceMotion,
}: {
  description: string
  onWarm: () => void
  reduceMotion: boolean
  tooltipWarm: boolean
}) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const closeTooltip = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setOpen(false)
  }, [])

  useEffect(() => closeTooltip, [closeTooltip])

  return (
    <div className="absolute top-2 right-2 z-10">
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            className="pointer-events-none absolute top-7 right-0 w-44 rounded-[12px] border border-[var(--ds-border-panel)] bg-[rgb(16_16_20_/_0.92)] px-2.5 py-2 text-[10px] text-[var(--ds-color-text-secondary)] leading-[1.35] shadow-[var(--ds-shadow-panel-dark)] backdrop-blur-[20px]"
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{
              duration: reduceMotion ? 0.12 : 0.16,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            {description}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function EffectCard({
  item,
  onSelect,
  reduceMotion,
  tooltipWarm,
  onWarmTooltip,
}: {
  item: EffectItem
  onSelect: (action: AddLayerAction) => void
  onWarmTooltip: () => void
  reduceMotion: boolean
  tooltipWarm: boolean
}) {
  return (
    <div className="group relative">
      {item.description ? (
        <LayerPickerInfoButton
          description={item.description}
          onWarm={onWarmTooltip}
          reduceMotion={reduceMotion}
          tooltipWarm={tooltipWarm}
        />
      ) : null}
      <button
        className="flex w-full origin-center cursor-pointer flex-col rounded-[10px] border border-white/6 bg-[rgb(255_255_255_/_0.02)] text-left transition-[transform,border-color,background-color,box-shadow] duration-[200ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/14 hover:bg-[rgb(255_255_255_/_0.05)] hover:shadow-[0_10px_30px_rgb(0_0_0_/_0.18),inset_0_1px_0_rgb(255_255_255_/_0.04)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--ds-border-active)] focus-visible:outline-offset-2 active:scale-[0.97]"
        onClick={() => onSelect(item.value)}
        type="button"
      >
        <div className="p-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] border border-white/7 bg-[rgb(12_12_16_/_0.84)]">
            {item.previewSrc ? (
              <Image
                alt={item.label}
                className="object-cover"
                fill
                sizes="180px"
                src={item.previewSrc}
              />
            ) : null}
          </div>
        </div>
        <div
          className={cn("min-w-0 px-2 pt-1 pb-2", item.description && "pr-6")}
        >
          <div className="overflow-hidden text-ellipsis whitespace-nowrap font-[var(--ds-font-mono)] text-[11px] text-[var(--ds-color-text-primary)] leading-[14px]">
            {item.label}
          </div>
        </div>
      </button>
    </div>
  )
}

function SourceButton({
  item,
  onSelect,
}: {
  item: SourceItem
  onSelect: (action: AddLayerAction) => void
}) {
  const Icon = item.icon

  return (
    <button
      className="inline-flex h-7 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/8 bg-[rgb(255_255_255_/_0.03)] px-3 font-[var(--ds-font-mono)] text-[10px] text-[var(--ds-color-text-secondary)] leading-none transition-[transform,border-color,background-color,color] duration-[180ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/14 hover:bg-[rgb(255_255_255_/_0.07)] hover:text-[var(--ds-color-text-primary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--ds-border-active)] focus-visible:outline-offset-2 active:scale-[0.97]"
      onClick={() => onSelect(item.value)}
      type="button"
    >
      <Icon size={12} weight="regular" />
      {item.label}
    </button>
  )
}

export function LayerPicker({ className, onSelect }: LayerPickerProps) {
  const reduceMotion = useReducedMotion() ?? false
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<LayerPickerCategory>("all")
  const [tooltipWarm, setTooltipWarm] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [panelPosition, setPanelPosition] = useState<{
    left: number
    top: number
  } | null>(null)
  const panelId = useId()

  const visibleEffects = useMemo(
    () =>
      category === "all"
        ? EFFECT_ITEMS
        : EFFECT_ITEMS.filter((item) => item.category === category),
    [category]
  )

  const updatePanelPosition = useCallback(() => {
    if (!triggerRef.current) {
      return
    }

    const rect = triggerRef.current.getBoundingClientRect()

    if (window.innerWidth < 900) {
      setPanelPosition({
        left: 16,
        top: 16,
      })
      return
    }

    const sidebarRight = 16 + 284 + 8
    const left = Math.min(sidebarRight, window.innerWidth - 560 - 16)

    setPanelPosition({
      left,
      top: rect.top,
    })
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    updatePanelPosition()

    window.addEventListener("resize", updatePanelPosition)
    window.addEventListener("scroll", updatePanelPosition, true)

    return () => {
      window.removeEventListener("resize", updatePanelPosition)
      window.removeEventListener("scroll", updatePanelPosition, true)
    }
  }, [open, updatePanelPosition])

  useEffect(() => {
    if (!open) {
      return
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    window.requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("button:not([disabled])")
        ?.focus()
    })

    const handlePointerDown = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) {
        return
      }

      const withinTrigger = rootRef.current?.contains(event.target) ?? false
      const withinPanel = panelRef.current?.contains(event.target) ?? false

      if (!(withinTrigger || withinPanel)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("mousedown", handlePointerDown)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("mousedown", handlePointerDown)
      window.removeEventListener("keydown", handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [open])

  const handleSelect = useCallback(
    (action: AddLayerAction) => {
      onSelect(action)
      setOpen(false)
    },
    [onSelect]
  )

  const renderEffectGrid = (items: readonly EffectItem[]) => (
    <div className="grid grid-cols-3 gap-2 px-3 pt-2 pb-3">
      {items.map((item) => (
        <EffectCard
          item={item}
          key={item.value}
          onSelect={handleSelect}
          onWarmTooltip={() => setTooltipWarm(true)}
          reduceMotion={reduceMotion}
          tooltipWarm={tooltipWarm}
        />
      ))}
    </div>
  )

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      <IconButton
        aria-controls={panelId}
        aria-expanded={open}
        aria-label="添加图层"
        className="focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--ds-border-active)] focus-visible:outline-offset-2"
        onClick={() => {
          setOpen((current) => {
            const next = !current

            if (next) {
              setCategory("all")
              setTooltipWarm(false)
            }

            return next
          })
        }}
        ref={triggerRef}
        variant="emphasis"
      >
        <PlusIcon size={14} weight="bold" />
      </IconButton>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence initial={false}>
              {open && panelPosition ? (
                <motion.div
                  animate={
                    reduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, scale: 1, y: 0 }
                  }
                  className="z-40 w-[min(560px,calc(100vw-2rem))]"
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.98, y: -8 }
                  }
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.98, y: -8 }
                  }
                  ref={panelRef}
                  style={{
                    left: panelPosition.left,
                    position: "fixed",
                    top: panelPosition.top,
                    transformOrigin: "top right",
                  }}
                  transition={{
                    duration: reduceMotion ? 0.12 : 0.2,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  <GlassPanel
                    className="flex flex-col gap-0 p-0"
                    id={panelId}
                    variant="panel"
                  >
                    <div className="border-[var(--ds-border-divider)] border-b px-3 pt-3 pb-2.5">
                      <div className="mb-2 font-[var(--ds-font-mono)] text-[10px] text-[var(--ds-color-text-muted)] uppercase tracking-[0.14em]">
                        素材源
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {SOURCE_ITEMS.map((item) => (
                          <SourceButton
                            item={item}
                            key={item.value}
                            onSelect={handleSelect}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="px-3 pt-2.5 pb-1">
                        <div className="flex items-center gap-1.5">
                          {CATEGORY_OPTIONS.map((option) => {
                            const active = option.value === category

                            return (
                              <button
                                className={cn(
                                  "relative inline-flex h-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-transparent px-2.5 py-1 font-[var(--ds-font-mono)] text-[10px] text-[var(--ds-color-text-secondary)] leading-none transition-[transform,color] duration-[180ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-[var(--ds-color-text-primary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--ds-border-active)] focus-visible:outline-offset-2 active:scale-[0.97]",
                                  active &&
                                    "text-[var(--ds-color-text-primary)]"
                                )}
                                key={option.value}
                                onClick={() => setCategory(option.value)}
                                type="button"
                              >
                                {active ? (
                                  <motion.span
                                    className="absolute inset-0 rounded-full border border-white/8 bg-[linear-gradient(180deg,rgb(255_255_255_/_0.1),rgb(255_255_255_/_0.04))]"
                                    layoutId="layer-picker-tab"
                                    transition={{
                                      duration: reduceMotion ? 0.12 : 0.2,
                                      ease: [0.32, 0.72, 0, 1],
                                    }}
                                  />
                                ) : null}
                                <span className="relative z-[1]">
                                  {option.label}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="max-h-[min(52vh,400px)] overflow-y-auto">
                        <AnimatePresence initial={false} mode="wait">
                          <motion.div
                            animate={
                              reduceMotion
                                ? { opacity: 1 }
                                : { opacity: 1, y: 0 }
                            }
                            className="min-h-0"
                            exit={
                              reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: -6 }
                            }
                            initial={
                              reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: 6 }
                            }
                            key={category}
                            transition={{
                              duration: reduceMotion ? 0.08 : 0.14,
                              ease: [0.32, 0.72, 0, 1],
                            }}
                          >
                            {renderEffectGrid(visibleEffects)}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  )
}
