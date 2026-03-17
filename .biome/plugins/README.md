## Plugins

### 1. `no-anchor-element.grit`
Enforces using Next.js `<Link>` component instead of HTML `<a>` elements.

### 2. `no-unnecessary-forwardref.grit`
Checks for unnecessary `forwardRef` usage in React 19 with the compiler.

### 3. `no-relative-parent-imports.grit`
Forbids relative parent imports (`../`) and encourages alias imports (`@/`).

## Plugin Configuration

The plugins are configured in `biome.json`:
```json
"plugins": [
  "./biome-plugins/no-anchor-element.grit",
  "./biome-plugins/no-unnecessary-forwardref.grit",
  "./biome-plugins/no-relative-parent-imports.grit"
]
``` 
