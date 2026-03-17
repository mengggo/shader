// THIS FILE HAS TO STAY .mjs AS ITS CONSUMED BY POSTCSS
// EDIT THIS AS NEEDED

const breakpoints = {
  "desktop-large": 1920,
  desktop: 1440,
  "tablet-lg": 1024,
  tablet: 768,
  mobile: 640,
}

const screens = {
  mobile: { width: breakpoints.mobile, height: 650 },
  desktop: { width: breakpoints.desktop, height: 816 },
}

const layout = {
  columns: { mobile: 4, desktop: 12 },
  gap: { mobile: 16, desktop: 16 },
  safe: { mobile: 16, desktop: 16 },
}

const customSizes = {
  "header-height": { mobile: 58, desktop: 98 },
}

export { breakpoints, customSizes, layout, screens }
