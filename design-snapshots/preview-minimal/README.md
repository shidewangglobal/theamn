# Preview — Apple Gray / White Theme

Test layout **without changing the live site** at `/`.

## URLs

| Version | URL |
|---------|-----|
| **Live (cream)** | http://localhost:4321/ |
| **Preview (Apple gray/white)** | http://localhost:4321/preview/ |

Run dev: `npm run dev`

## Palette (Apple-inspired)

| Token | Hex | Use |
|-------|-----|-----|
| Page gray | `#F5F5F7` | Section canvas, gaps between bento boxes |
| Card white | `#FFFFFF` | Bento solid boxes |
| Text primary | `#1D1D1F` | Headlines |
| Text secondary | `#6E6E73` | Body |
| Accent | `#0066CC` | Labels, links, primary buttons |

## What preview changes (CSS only)

Scoped under `.theme-preview` in `src/styles/theme-preview.css`:

- **No warm white / cream** on light sections
- **Gray canvas + white cards** (gaps show gray like Apple grid)
- **Flat minimal shadows** on boxes
- **Apple blue** for accents & CTA on light UI
- **Images:** clean, light polish in bento frames
- **Dark anchors unchanged:** Hero, Tech, Contact, Footer

## Files

| File | Role |
|------|------|
| `src/pages/preview/index.astro` | Preview route |
| `src/layouts/PreviewLayout.astro` | Layout + banner |
| `src/styles/theme-preview.css` | Theme overrides |

## Promote to live

Merge `theme-preview.css` tokens into `global.css` when approved.

## Revert preview

Delete preview route + layout + `theme-preview.css`. Live `/` untouched.
