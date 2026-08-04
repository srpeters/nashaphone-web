# nashaphone-web

Company website for Nasha Phone S.L., a Spanish B2B distributor of
factory-surplus stock. The audience is purchasing managers deciding, in
about twenty seconds, whether the company that just emailed them is real.

Public repository: it contains only the site itself. No secrets, no API
keys, no customer data.

## Running it

There is no build step and there are no dependencies. Open `index.html`
in a browser — double-clicking the file works, `file://` and all.

## Files

| File | Purpose |
|---|---|
| `index.html` | the whole site: hero, what we do, categories, how we work, contact |
| `aviso-legal.html` | LSSI-CE identification page |
| `styles.css` | hand-written stylesheet, mobile first |
| `main.js` | one behaviour: fade-and-rise section entrances |
| `favicon.svg` | monogram, drawn as paths so no font is needed |
| `og-image.png` | 1200×630 link preview card |
| `DESIGN.md` | the design plan the site was built to |

## Conventions

- File names, code, comments and commits in English; all user-facing
  copy in Spanish, because the audience is Spanish.
- Nothing is loaded from a third party: no web fonts, no CDN, no
  analytics, no tracking. The page makes zero external requests.
- Content is limited to verified company facts. No invented years in
  business, client counts, certifications or testimonials.

## Deployment

GitHub Pages, served from `main` at the repository root.

Pointing `nashaphone.es` at this site is a separate step: it needs the
domain to resolve first, then a CNAME file and the custom-domain setting
in the repository's Pages configuration.
