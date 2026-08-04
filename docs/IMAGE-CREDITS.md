# Image credits

Every photograph on this site comes from Pexels and is served from this
repository. Nothing is hotlinked, so the published page still makes zero
requests to third-party domains.

## Licence

All four images are used under the **Pexels License**
(<https://www.pexels.com/license/>), checked on 2026-08-04:

- Free for commercial use.
- **Attribution is not required** — "Giving credit to the photographer or
  Pexels is not necessary but always appreciated." This file exists for
  our own traceability, not because the licence demands it.
- Restrictions we are within: we do not resell unaltered copies, we do
  not use the images as part of a trade mark or business name, we do not
  imply that any brand or person endorses us, and no identifiable person
  appears in any of the four.

## The four category images

| Card | File | Source | Photo ID |
|---|---|---|---|
| 01 Telefonía móvil | `assets/img/telefonia.*` | <https://www.pexels.com/photo/6373126/> | 6373126 |
| 02 Electrodomésticos y herramienta | `assets/img/electrodomesticos.*` | <https://www.pexels.com/photo/7214452/> | 7214452 |
| 03 Televisores | `assets/img/televisores.*` | <https://www.pexels.com/photo/6316063/> | 6316063 |
| 04 Electrónica de consumo | `assets/img/electronica.*` | <https://www.pexels.com/photo/3394650/> | 3394650 |

## Featured offer band image

| Where | File | Source |
|---|---|---|
| Oferta destacada band | `assets/img/samsung-s20.*` | **Supplied by the client** |

This one is **not** from a stock library and carries **no licence I have
verified**. It was supplied by Z, saved to his Downloads folder, and it
is manufacturer product imagery of the Samsung Galaxy S20 — the product
actually being offered in that band, not decoration or an endorsement
claim.

**Z is responsible for having the right to use it.** I make no claim
about that right, because I cannot verify it. Manufacturer product
imagery is commonly permitted for resellers advertising the genuine
product, and is commonly restricted in other ways; if there is any doubt,
the safe options are to photograph the actual stock or to ask the
supplier for the press kit and its usage terms.

The trademark notice under the brand wall, and the one on the Aviso legal
page, already state that third-party marks belong to their owners and
that their mention implies no affiliation.

Processing: the supplied PNG was 1254x1254, RGB, with **no alpha channel**
and an opaque near-white background, which would have rendered as a white
slab on the near-black band. The background was removed with a
connectivity-based flood fill from the borders (not a global threshold,
which would have punched holes in the light-blue handset and the white
"SAMSUNG" and "S20" lettering), the subject eroded by 1px to drop the
blended boundary pixels, then premultiplied, resized and unpremultiplied
so no white bled into the edges. Delivered at 725x850 as WebP (86 KB,
full quality) with a palette-quantised PNG fallback (137 KB).

## Selection rules applied

Each candidate was downloaded and inspected at full resolution before
selection, against the sourcing rules:

- **No recognisable human faces.** None of the four contains a person.
- **No visible third-party brand logos or unmistakable branded devices.**
  Checked by zooming into the parts most likely to carry a mark: the
  television bezel and the oven fascia. No legible wordmark appears at
  any size the page delivers.
  - A cleaner smartphone mockup (Pexels 30930310) was rejected despite a
    brighter background because its silhouette, with the pill-shaped
    front cutout, is recognisably one manufacturer's handset. 6373126 is
    a plain slab with no such tell.
  - Every power-tool candidate found was either branded by colour scheme
    and logo (yellow, or the blue of a specific professional line) or
    shot on a cluttered workbench, so category 02 is represented by
    built-in white goods instead, which is within the category as
    written ("Electrodomésticos y herramienta").
- **Consistent treatment.** All four are centre-cropped to 4:3, resized
  to 900×675 and exported with identical settings, so they read as a set.

## Processing

Source JPEG at 1600px wide → centre-crop 4:3 → 900×675 → exported twice:

- WebP, quality 76, method 6 — served first via `<picture>`
- JPEG, quality 78, progressive — fallback for older browsers

| File | WebP | JPEG |
|---|---|---|
| telefonia | 5.1 KB | 26.4 KB |
| electrodomesticos | 17.1 KB | 41.0 KB |
| televisores | 15.6 KB | 40.2 KB |
| electronica | 5.7 KB | 17.1 KB |

All well under the 150 KB ceiling. Each `<img>` carries explicit
`width`/`height` (so no layout shift), `loading="lazy"`,
`decoding="async"` and Spanish alt text.
