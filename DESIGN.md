# Design plan — corporate rebuild

Written before the code. The previous build was a sparse typographic
page and was rejected three times as "muy simple", "se siente muy IA",
"vacío al medio". The diagnosis is density: a real distributor's site
carries commercial weight on every screen. Reference: maxmovil.com.

The rule I am building to: **no section may be one line of text on
white space.** Every band must carry either a figure, a card, a logo, a
silhouette or a dark surface.

## Palette

| Token | Hex | Use |
|---|---|---|
| `--white` | `#FFFFFF` | canvas |
| `--surface` | `#F5F5F7` | alternating bands, tinted card fills |
| `--ink` | `#0F1115` | utility bar, featured banner, footer |
| `--text` | `#1D1D1F` | body and headings |
| `--muted` | `#6E6E73` | secondary text (5.07:1 on white) |
| `--hairline` | `#D2D2D7` | rules, grid lines, card borders |
| `--accent` | `#E8940F` | amber: CTA fills, banner, numerals on dark |
| `--accent-ink` | `#8A5200` | amber as text on light (6.39:1) |
| `--logo-grey` | `#86868B` | brand wall at rest, → `#1D1D1F` on hover |

Measured, not assumed: `#E8940F` on white is only **2.42:1**, so amber
is never text on a light surface — it is a fill. Amber CTAs take
`#1D1D1F` text (6.95:1), never white (2.42:1). On the dark band amber
reaches 7.81:1.

## Type scale

System stack, `-apple-system` / `SF Pro Display` / `Inter`. Nothing
downloaded.

| Role | Size | Weight | Tracking |
|---|---|---|---|
| Hero h1 | `clamp(2.25rem, 6.4vw, 4rem)` | 700 | -0.03em |
| Section h2 | `clamp(1.625rem, 3.6vw, 2.5rem)` | 700 | -0.025em |
| Banner h2 | `clamp(1.75rem, 4.2vw, 3rem)` | 700 | -0.03em |
| Card h3 | `1.1875rem` | 600 | -0.01em |
| Stat figure | `clamp(1.5rem, 3.6vw, 2.25rem)` | 700 | -0.02em |
| Body | `1.0625rem` (17px) | 400 | — |
| Caption / eyebrow | `0.8125rem` | 600 | 0.08em caps |

## Section rhythm

Tight and alternating, not airy. Band padding `clamp(48px, 6vw, 88px)`
— roughly half the previous build. Surfaces alternate
white → grey → white → **dark** → grey → white → dark footer, so the
eye never travels more than one band without a change of ground.

1. Utility bar (dark, 36px)
2. Header (white, sticky, blurs on scroll)
3. Hero (white, split: copy left / built composition right)
4. Stats band (white, hairline-boxed, four figures)
5. Brand wall (grey, twelve monochrome logos in a hairline grid)
6. Categories (white, four elevated cards)
7. **Featured offer band (dark, full-bleed)**
8. Cuatro condiciones (grey, one panel of four cells)
9. Proceso (white, three numbered steps)
10. Contacto (grey, details + styled enquiry panel)
11. Footer (dark, four columns + bottom bar)

## Depth

Not decoration — it is the thing that separates a corporate site from a
wireframe. Three layered shadow tokens (`sm`, `md`, `lg`), 16–18px
radii, tinted fills, and real overlap in the hero, where three product
cards sit on different z-indexes at slight rotations and float on
independent 7–9s cycles.

## The element this page is remembered by

**The featured offer band** — a full-bleed near-black strip carrying the
200 Samsung Galaxy S20 units in big type, amber CTA, the Samsung mark
and a phone silhouette lit by an amber glow. It is the visual centre of
the page and the answer to "vacío al medio": the middle of the page is
now the darkest and heaviest thing on it.

## Constraints kept from before

Zero external requests: brand logos are inlined as single-path SVG,
extracted from `simple-icons` at build time, and `node_modules` is
gitignored. No invented facts — no years in business, client counts,
certifications, testimonials or delivery times. Trademarks are
attributed to their owners under the wall.
