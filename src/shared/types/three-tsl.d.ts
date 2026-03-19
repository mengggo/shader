declare module "three/tsl" {
  export interface TSLNode {
    a: TSLNode
    b: TSLNode
    g: TSLNode
    r: TSLNode
    rgb: TSLNode
    value: unknown
    w: TSLNode
    x: TSLNode
    y: TSLNode
    z: TSLNode

    add(value: unknown): TSLNode
    and(value: unknown): TSLNode
    clamp(min?: unknown, max?: unknown): TSLNode
    div(value: unknown): TSLNode
    equal(value: unknown): TSLNode
    greaterThan(value: unknown): TSLNode
    greaterThanEqual(value: unknown): TSLNode
    lessThan(value: unknown): TSLNode
    lessThanEqual(value: unknown): TSLNode
    mul(value: unknown): TSLNode
    sqrt(): TSLNode
    sub(value: unknown): TSLNode
  }

  export function abs(value: unknown): TSLNode
  export function clamp(value: unknown, min?: unknown, max?: unknown): TSLNode
  export function cos(value: unknown): TSLNode
  export function dot(left: unknown, right: unknown): TSLNode
  export function float(value?: unknown): TSLNode
  export function floor(value: unknown): TSLNode
  export function max(left: unknown, right: unknown): TSLNode
  export function min(left: unknown, right: unknown): TSLNode
  export function mix(left: unknown, right: unknown, factor: unknown): TSLNode
  export const screenSize: TSLNode
  export function select(
    condition: unknown,
    whenTrue: unknown,
    whenFalse: unknown,
  ): TSLNode
  export function sin(value: unknown): TSLNode
  export function sqrt(value: unknown): TSLNode
  export function texture(value: unknown, uv?: unknown): TSLNode
  export function uniform(value?: unknown): TSLNode
  export function uv(): TSLNode
  export function vec2(x?: unknown, y?: unknown): TSLNode
  export function vec3(x?: unknown, y?: unknown, z?: unknown): TSLNode
  export function vec4(
    x?: unknown,
    y?: unknown,
    z?: unknown,
    w?: unknown,
  ): TSLNode
}
