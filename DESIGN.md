# Design plan

Written before any code. The audience is a purchasing manager who has
received a cold email and is spending about twenty seconds deciding
whether this company is real.

## Palette

Four neutrals and exactly one accent. No gradients.

| Token | Hex | Use | Contrast on background |
|---|---|---|---|
| `--bg` | `#FBFBFD` | page background | — |
| `--surface` | `#F5F5F7` | one recessed panel ("Cómo trabajamos") | — |
| `--text` | `#1D1D1F` | headings and body | 16.28:1 |
| `--text-muted` | `#6E6E73` | secondary text, captions | 4.91:1 |
| `--hairline` | `#D2D2D7` | 1px rules only, never text | — |
| `--accent` | `#00636B` | see below | 6.78:1 |

### Why this accent

A deep petrol teal, used on roughly 2% of the page: the category
numerals, the primary button, the rules above the four facts, and the
focus ring.

- It is not Apple's link blue `#0071E3`. Copying it would make the page
  read as a template rather than a company.
- It is not Bosch corporate blue or Bosch green. The site names Bosch
  nowhere, and an accent close to a supplier's brand colour would imply
  an endorsement we have no right to imply.
- It is not logistics orange and not the warm-cream / terracotta pairing
  the brief rules out.
- At 6.78:1 on the background and 7.01:1 under white button text it
  clears WCAG AA for normal text with margin, so the one colour on the
  page never becomes an accessibility problem.
- Tonally it reads technical and sober rather than consumer-facing,
  which is what a purchasing manager is looking for.

## Type scale

System stack led by `-apple-system` / `SF Pro Display`, `Inter` as the
web fallback, no font is ever downloaded.

| Role | Size | Weight | Tracking | Leading |
|---|---|---|---|---|
| Display (h1) | `clamp(2.5rem, 8.5vw, 5rem)` | 600 | -0.035em | 1.05 |
| Section (h2) | `clamp(1.75rem, 4.6vw, 3rem)` | 600 | -0.025em | 1.1 |
| Category name | `clamp(1.5rem, 5vw, 2.5rem)` | 600 | -0.02em | 1.15 |
| Lead paragraph | `clamp(1.125rem, 2.2vw, 1.5rem)` | 400 | -0.01em | 1.5 |
| Body | `1.0625rem` → `1.1875rem` | 400 | normal | 1.65 |
| Caption / eyebrow | `0.8125rem` | 500 | 0.08em, uppercase | 1.4 |

Tight tracking only on the large sizes; body keeps default tracking and
comfortable leading. Body never drops below 17px, so iOS does not
auto-zoom.

## Structure

Full-width sections stacked vertically, content capped at 1100px,
gutters 24px on mobile and 40px from 768px up. Vertical rhythm on an
8px scale; section padding `clamp(72px, 11vw, 152px)`.

1. Slim sticky header — wordmark, one anchor, blurred hairline bar.
2. Hero — one sentence, one primary action (email), phone beside it.
3. Qué hacemos — three short paragraphs, plain language.
4. Categorías — the remembered element, see below.
5. Cómo trabajamos — four facts in a recessed panel, stated flat.
6. Contacto — email as large type, phone, address, legal identity.
7. Footer — legal name, NIF, link to Aviso legal.

## The one element this page is remembered by

The categories, set as four oversized numbered rows — `01`–`04` in
accent teal against the category name in near-black display type,
separated by full-width hairlines. No icons, no cards, no photography:
it is built purely from type, rule and space, it reads like a spec
sheet rather than a brochure, and it is the one moment where the accent
appears at size. It collapses to a single column at 390px without
losing its character.

## Motion

One idea only: sections fade in and rise 12px on entry, 600ms ease-out,
via IntersectionObserver. Elements are hidden only when JavaScript is
running, so the page is fully readable with JS off. Under
`prefers-reduced-motion: reduce` nothing moves and everything is
visible immediately.

## Checked against the brief before building

- No stock photography, no icons, no third-party logos. Passed: the only
  non-text shapes are 1px rules and a 24×2px accent dash.
- Nothing invented. Every claim on the page traces to the supplied fact
  list; no years in business, no client counts, no certifications, no
  testimonials, no superlatives, no exclamation marks.
- Not a generic template: the numbered spec-sheet categories and the
  single petrol-teal accent are specific decisions, and the page carries
  no card grid, no feature icons and no gradient hero.
