import { colors, palettes, themeNames, themes } from "./colors"
import { easings } from "./easings"
import { breakpoints, customSizes, layout, screens } from "./layout.mjs"
import { fonts, typography } from "./typography"

const config = {
  breakpoints,
  colors,
  customSizes,
  easings,
  fonts,
  layout,
  palettes,
  screens,
  themeNames,
  themes,
  typography,
} as const

export {
  breakpoints,
  colors,
  customSizes,
  easings,
  fonts,
  layout,
  palettes,
  screens,
  themeNames,
  themes,
  typography,
}
export type ThemeName = keyof typeof themes
export type Config = typeof config
