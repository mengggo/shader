import type { Config } from "../config"
import { formatObject } from "./utils"

export function generateRoot({
  breakpoints,
  colors,
  customSizes,
  easings,
  layout,
  screens,
}: Pick<
  Config,
  "breakpoints" | "colors" | "customSizes" | "easings" | "layout" | "screens"
>) {
  return `@custom-media --hover (hover: hover) and (pointer: fine);
@custom-media --reduced-motion (prefers-reduced-motion: reduce);

${formatObject(
  breakpoints,
  ([name, value]) => `@custom-media --${name} (width >= ${value}px);`,
  "\n"
)}

:root {
	--device-width: ${screens.mobile.width};
	--device-height: ${screens.mobile.height};

	${formatObject(layout, ([name, { mobile }]) => {
    if (name === "columns") return `--columns: ${mobile};`

    return `--${name}: ${mobile}px;`
  })}

	${formatObject(customSizes, ([name, { mobile }]) => `--${name}: ${mobile}px;`)}

	--layout-width: calc(100vw - (2 * var(--safe)));
	--column-width: calc((var(--layout-width) - (var(--columns) - 1) * var(--gap)) / var(--columns));

	${formatObject(easings, ([name, value]) => `--ease-${name}: ${value};`)}

	${formatObject(colors, ([name, value]) => `--color-${name}: ${value};`)}

	@variant desktop {
    --device-width: ${screens.desktop.width};
    --device-height: ${screens.desktop.height};

    ${formatObject(
      layout,
      ([name, { desktop }]) => {
        if (name === "columns") return `--columns: ${desktop};`

        return `--${name}: ${desktop}px;`
      },
      "\n\t\t"
    )}

    ${formatObject(customSizes, ([name, { desktop }]) => `--${name}: ${desktop}px;`, "\n\t\t")}
	}
}
  `
}
