import type { Config } from "../config"
import { formatObject } from "./utils"

export function generateTailwind({
  breakpoints,
  colors,
  customSizes,
  easings,
  fonts,
  palettes,
  themes,
  typography,
}: Pick<
  Config,
  | "breakpoints"
  | "colors"
  | "customSizes"
  | "easings"
  | "fonts"
  | "palettes"
  | "themes"
  | "typography"
>) {
  // Theme
  const themeEntries = Object.entries(themes)
  const firstTheme = themeEntries[0]?.[1] ?? {}
  const theme = `/** Custom theme **/
@theme {
	--breakpoint-*: initial;
	${formatObject(breakpoints, ([name, value]) => `--breakpoint-${name}: ${value}px;`)}

  --color-*: initial;
	${formatObject(firstTheme, ([key, value]) => `--color-${key}: ${value};`)}
  ${formatObject(colors, ([key, value]) => `--color-${key}: ${value};`)}

  ${Object.entries(palettes)
    .filter(([, scaleValues]) => Object.keys(scaleValues).length > 1)
    .map(
      ([paletteName, paletteValues]) =>
        `/* ${paletteName} */\n\t` +
        Object.entries(paletteValues)
          .map(([shade, value]) => `--color-${paletteName}-${shade}: ${value};`)
          .join("\n\t")
    )
    .join("\n\n\t")}

	--spacing: 0.25rem;
	--spacing-0: 0;
	--spacing-safe: var(--safe);
	--spacing-gap: var(--gap);
  ${formatObject(customSizes, ([key]) => `--spacing-${key}: var(--${key});`)}

  --font-*: initial;
  ${formatObject(fonts, ([name, variableName]) => `--font-${name}: var(${variableName});`)}

  --ease-*: initial;
  ${formatObject(easings, ([name, value]) => `--ease-${name}: ${value};`)}
}`

  // Theme overwrites
  const themeOverwrites = `
/** Custom theme overwrites **/
${formatObject(
  themes,
  ([name, value]) => `[data-theme=${name}] {
  ${formatObject(value, ([key, value]) => `--color-${key}: ${value};`)}
}`,
  "\n"
)}
  `

  // Utilities
  const utilities = `
/** Custom static utilities **/
${Object.entries(typography)
  .map(
    ([name, value]) => `@utility ${name} {
  ${Object.entries(value)
    .filter((entry) => entry?.[0] && entry?.[1])
    .filter((entry) => entry !== undefined)
    .map(([key, value]) => {
      if (key === "font-size") {
        if (typeof value === "number") {
          return `font-size: ${value}px;`
        }

        if (
          typeof value === "object" &&
          "mobile" in value &&
          "desktop" in value
        ) {
          return [
            `font-size: ${(value?.mobile as number) ?? 0}px;`,
            `@variant desktop { font-size: ${(value?.desktop as number) ?? 0}px; }`,
          ].join("\n\t")
        }

        return `font-size: ${value as unknown as number}px;`
      }

      if (typeof value === "object") {
        return [
          `${key}: ${value.mobile};`,
          `@variant desktop { ${key}: ${value.desktop}; }`,
        ].join("\n\t")
      }

      return `${key}: ${value};`
    })
    .join("\n\t")}
}`
  )
  .join("\n\n")}

@utility b-grid {
	display: grid;
	grid-template-columns: repeat(var(--columns), 1fr);
	column-gap: var(--gap);
}

@utility b-layout-block {
	margin-inline: auto;
  width: calc(100% - 2 * var(--safe));
}

@utility b-layout-block-inner {
	padding-inline: var(--safe);
	width: 100%;
}

@utility b-layout-grid {
	@apply b-layout-block b-grid;
}

@utility b-layout-grid-inner {
	@apply b-layout-block-inner b-grid;
}`

  // Variants
  const variants = `
/** Custom variants **/
${Object.keys(themes)
  .map(
    (name) =>
      `@custom-variant ${name} (&:where([data-theme=${name}], [data-theme=${name}] *));`
  )
  .join("\n")}`

  return [theme, themeOverwrites, utilities, variants].join("\n")
}
