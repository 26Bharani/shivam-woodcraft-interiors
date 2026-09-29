# Shivam Woodcraft Interiors, Website

A static website built with plain HTML5, CSS3 and vanilla JavaScript. There is no build step, no backend and no framework, so it deploys as-is to GitHub and Vercel.

## Project structure

```
index.html            All page content and structured data
css/style.css         Base styles (mobile-first) and design tokens
css/responsive.css    Tablet, laptop and desktop layout
js/main.js            Menu, gallery filter, lightbox, enquiry form
images/hero/          hero-main.jpg, hero-mobile.jpg, about-workshop.jpg, cta-bg.jpg
images/services/      5 featured-service photos
images/projects/      16 gallery photos
favicon/favicon.svg   Browser tab icon
robots.txt            Search engine rules
sitemap.xml           Sitemap for Google
vercel.json           Cache and security headers (optional)
```

## Deploy: GitHub + Vercel

1. Create a new GitHub repository and upload the contents of this folder (`index.html` must be at the top level).
2. In Vercel choose **Add New > Project**, import the repository and press **Deploy**.
   - Framework Preset: **Other**
   - Build Command: leave empty
   - Output Directory: leave empty (the project root is served)
3. After the first deploy, do the **Set your real web address** step below.

## Set your real web address (important for SEO)

The files use the placeholder address `https://shivam-woodcraft-interiors.vercel.app/`. Once you know your real address (the Vercel one or your own domain), search all files for `shivam-woodcraft-interiors.vercel.app` and replace it. It appears in:

- `index.html`: canonical link, Open Graph tags (`og:url`, `og:image`) and the JSON-LD block
- `robots.txt`: the Sitemap line
- `sitemap.xml`: the `<loc>` line

Then submit `sitemap.xml` in Google Search Console.

## Edit business details

| What | Where |
| --- | --- |
| Phone numbers | Search for `9080356021` and `9150326690` in `index.html` (buttons, contact, footer, JSON-LD) |
| WhatsApp number | Search for `919080356021` in `index.html`, and change `whatsappNumber` at the top of `js/main.js` (used by the enquiry form) |
| Address | Search for `Medavakkam` in `index.html` (contact, footer, JSON-LD) |
| Colours and fonts | The `:root` block at the top of `css/style.css` |
| Service cards | The `<ul class="services__grid">` list in `index.html` |
| Page title and description | The `<title>` and `<meta name="description">` at the top of `index.html` |

## Replace the photos

The site ships with generated wood-texture placeholders so nothing appears broken. Each placeholder shows its filename in the corner.

1. Save your photo with the **same file name** as the placeholder (for example `images/projects/kitchen-1.jpg`).
2. Overwrite the placeholder. No code change is needed.

Recommended sizes (JPG, quality 75 to 80, under 300 KB each where possible):

| Folder | Files | Suggested size |
| --- | --- | --- |
| `images/hero/` | `hero-main.jpg` | 1920 x 1080 |
| | `hero-mobile.jpg` | 900 x 1400 (portrait, shown on phones) |
| | `about-workshop.jpg` | 1000 x 1200 |
| | `cta-bg.jpg` | 1920 x 900 |
| `images/services/` | `modular-kitchen.jpg`, `wardrobes.jpg`, `tv-units.jpg`, `wooden-doors.jpg`, `custom-furniture.jpg` | 1200 x 900 |
| `images/projects/` | 16 gallery photos | about 900 px wide, any height |

If your photo has a different shape from the placeholder, update the `width` and `height` attributes on its `<img>` tag in `index.html` so the page does not jump while loading.

After replacing photos, also update the `alt` text and captions to describe the real work. This helps both accessibility and search.

### Add or remove a gallery photo

In the `<div class="gallery">` block of `index.html`, copy one `<figure class="work-item">` block. Change `data-category`, the image `src` and `alt`, the button `aria-label` and the caption. Valid categories: `kitchen`, `wardrobe`, `tv-unit`, `bedroom`, `living-room`, `pooja-unit`, `woodwork`.

## How the enquiry form works

The site is static, so there is no server. When someone submits the form, `js/main.js` builds a message with their name, phone, service and message, then opens `https://wa.me/919080356021?text=...`. The customer presses send in WhatsApp. Nothing is stored anywhere.

## Local SEO checklist

- Replace the placeholder web address (above).
- Create and verify a **Google Business Profile** for Medavakkam. This matters more for local search than anything on the page itself.
- Keep the name, address and phone number identical everywhere online.
- Add `geo` coordinates and `openingHours` to the JSON-LD block in `index.html` once you have them.
- Replace placeholder photos with real project photos.

## Notes

- Fonts (Marcellus and Hanken Grotesk) load from Google Fonts. If they cannot load, the site falls back to Georgia and system fonts.
- The contact map is a lazy-loaded Google Maps embed for Medavakkam, Chennai 600100.
- Motion respects the visitor's "reduce motion" setting.
- The lightbox uses the native `<dialog>` element: Esc closes it, and arrow keys or swipes move between photos.

&copy; 2026 Shivam Woodcraft Interiors. All Rights Reserved.
