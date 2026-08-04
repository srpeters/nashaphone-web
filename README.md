# nashaphone-web

Corporate website for Nasha Phone S.L., a Spanish B2B distributor of
factory-surplus stock. The audience is a purchasing manager deciding, in
about twenty seconds, whether the company that just emailed them is real
and worth a reply.

Public repository: it contains only the site itself. No secrets, no API
keys, no customer data.

## Running it

No build step and no runtime dependencies. Open `index.html` in a
browser — double-clicking the file works, `file://` and all.

## Files

| File | Purpose |
|---|---|
| `index.html` | the whole site, eleven sections from utility bar to footer |
| `aviso-legal.html` | LSSI-CE identification page |
| `styles.css` | hand-written stylesheet, mobile first |
| `main.js` | reveals, header blur, mobile nav, mailto enquiry |
| `favicon.svg` | monogram, drawn as paths so no font is needed |
| `og-image.png` | 1200×630 link preview card |
| `DESIGN.md` | the design plan this build was made to |

## Brand logos

The twelve marks in the brand wall come from the `simple-icons` package,
which is a **build-time-only** dependency: the single-path `d` data is
extracted and inlined into `index.html` as `<svg>` elements, so the
published page still makes zero external requests. `node_modules` is
gitignored and is not needed to serve or edit the site.

To refresh or add a mark:

```bash
npm install simple-icons          # local only, never committed
# then copy the path data out of node_modules/simple-icons/icons/<brand>.svg
```

Wordmark logos (SAMSUNG, SONY, SIEMENS, HONOR, OPPO, LG) carry the
`brand-logo--wide` class. Every icon shares a 24×24 viewBox, but a
wordmark fills only a thin strip of it while a symbol fills nearly all of
it, so one shared height renders the wordmarks almost invisible. The two
kinds are sized separately in CSS.

## Conventions

- File names, code, comments and commits in English; all user-facing
  copy in Spanish, because the audience is Spanish.
- Nothing is loaded from a third party: no web fonts, no CDN, no
  analytics, no tracking.
- Content is limited to verified company facts. No invented years in
  business, client counts, certifications, testimonials or delivery
  times.
- The enquiry form has no backend. It composes a `mailto:` with the
  typed values and hands off to the visitor's mail client; nothing is
  submitted to or stored on any server.

## Deployment

GitHub Pages, served from `main` at the repository root.

Pointing `nashaphone.es` at this site is a separate step: it needs the
domain to resolve first, then a CNAME file and the custom-domain setting
in the repository's Pages configuration.
