const palettes = {
  gray: {
    50: "#F5F5F5",
    100: "#E0E0E0",
    200: "#C2C2C2",
    300: "#A3A3A3",
    400: "#858585",
    500: "#666666",
    600: "#4D4D4D",
    700: "#333333",
    800: "#1A1A1A",
  },
  blue: {
    500: "#487CFF",
  },
  green: {
    500: "#00FF9B",
  },
  violet: {
    500: "#F101A5",
  },
  pink: {
    500: "#FF73A6",
  },
  orange: {
    500: "#FF4D00",
  },
}

const colors = {
  black: "#000000",
  white: "#ffffff",
  orange: palettes.orange[500],
  blue: palettes.blue[500],
  green: palettes.green[500],
  violet: palettes.violet[500],
  pink: palettes.pink[500],
  gray: palettes.gray[500],
} as const

const themeNames = ["light", "dark"] as const
const colorNames = ["primary", "secondary", "contrast"] as const

const themes = {
  light: {
    primary: colors.white,
    secondary: colors.black,
    contrast: colors.orange,
  },
  dark: {
    primary: colors.black,
    secondary: colors.white,
    contrast: colors.orange,
  },
} as const satisfies Themes

export { colors, palettes, themeNames, themes }

// UTIL TYPES
export type Themes = Record<
  (typeof themeNames)[number],
  Record<(typeof colorNames)[number], string>
>
