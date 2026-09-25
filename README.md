# Paola's Cleaning Services — website

A static, 5-page, bilingual (English/Spanish) site. No build step: upload the folder and it works.

```
index.html  services.html  before-after.html  about.html  quote.html
css/styles.css      brand tokens + all components
js/main.js          menu, accordions, before/after sliders, gallery filters, quote form
js/i18n.js          every English + Spanish string, and the language toggle
images/logo.png     official wreath logo (transparent PNG)
images/favicon.svg  droplet + leaf from the wreath
images/placeholders/   page photos (see shot list)
images/before-after/   before/after pairs
DESIGN-PLAN.md      tokens, layout, anti-pattern review
```

Preview locally: open a terminal in this folder, run `python3 -m http.server`, then visit http://localhost:8000.
(Opening the .html files directly also works, but the Spanish choice won't be remembered between pages in some browsers.)

---

## 1. Logo
`images/logo.png` is the official wreath logo (transparent background), used in the nav and footer. `images/og-image.jpg` (the preview when the site is shared on Facebook/iMessage) is the logo on white — swap in a photo of a finished room with the logo later if you like.

## 2. Photos — just drop files in

**Right now the photo slots hold AI-generated stand-in images** (the separated shots are also in `images/placeholders/grid/`). They are not Paola or her real jobs, and the site copy says the photos are real — replace them with real photos before launch. Before/after pairs are still empty.

Every photo spot already points at its final file name. Save a photo with that exact name and it appears; until then a light-blue placeholder with the shot name shows instead. Use JPG, roughly the sizes below, under ~400 KB each (compress at squoosh.app).

### Shot list

| File | What to shoot | Size |
|---|---|---|
| `images/placeholders/hero-living-room.jpg` | Bright, sunlit living room or kitchen mid-clean. Keep the left side calm — text sits over it | 2400×1400 |
| `images/placeholders/hero-card-paola.jpg` | Paola at work, friendly, wiping a counter | 800×500 |
| `images/placeholders/who-kitchen.jpg` | Freshly cleaned kitchen, clear counters | 1200×800 |
| `images/placeholders/who-bedroom.jpg` | Tidy bedroom, made bed | 1200×800 |
| `images/placeholders/service-recurring.jpg` | Living room after a routine visit | 1200×900 (also cropped tall on Services) |
| `images/placeholders/service-deep.jpg` | Close-up: bathroom tile/grout being scrubbed | 1200×900 |
| `images/placeholders/how-1.jpg` … `how-4.jpg` | 1: phone showing the quote form · 2: Paola replying to a message · 3: supplies at a front door · 4: finished kitchen, lights on | 800×600 |
| `images/placeholders/why-paola-kitchen.jpg` | Paola wiping kitchen cabinets (vertical) | 800×1200 |
| `images/placeholders/paola-portrait.jpg` | Portrait of Paola, natural light, smiling (vertical) | 1000×1250 |
| `images/placeholders/about-strip-1.jpg` | Paola cleaning a mirror | 1200×900 |
| `images/placeholders/about-strip-2.jpg` | Supplies packed and ready | 800×900 |
| `images/placeholders/about-strip-3.jpg` | Finished living room | 1000×900 |
| `images/before-after/01-before.jpg` + `01-after.jpg` … through `08` | 8 before/after pairs. **Same spot, same angle, same framing** for each pair, landscape | 1200×900 |

Before/after cards 1–8 are currently labeled: kitchen deep, bathroom deep, living room recurring, bedroom recurring, kitchen move-out, bathroom move-out, living room deep, bedroom deep. If the real photos differ, edit that card's caption and its `data-tags` in `before-after.html` (tags: `kitchens bathrooms living bedrooms deep moveout`). To add a 9th, copy an `<li>` block and change `08` to `09`. The home page slider uses pair `01`.

## 3. Connect the quote form
Open `js/main.js`. At the top:

```js
const FORM_ENDPOINT = "";
```

Paste the URL between the quotes:

- **GoHighLevel:** Automation → Workflows → new workflow → trigger **Inbound Webhook** → copy the URL. Map fields `name, phone, email, address, service, frequency, beds, baths, sqft, date, notes, heard, language` to contact fields, then add actions (create contact, notify Paola by SMS/email, add to pipeline).
- **Formspree:** create a form at formspree.io, copy the `https://formspree.io/f/xxxx` URL. Submissions arrive in Paola's email.

The form sends JSON (`POST`, `Content-Type: application/json`). While `FORM_ENDPOINT` is empty, the form **pretends** to send (so you can demo it) but nothing is delivered — don't launch like that.

Links can pre-select the service: `quote.html#recurring-weekly`, `#recurring-biweekly`, `#recurring-monthly`, `#deep`. Handy for ads and text messages.

## 4. Edit text / translations
All copy lives in `js/i18n.js` as keys, e.g. `"home.hero.h1"`, once under `en` and once under `es`. Change both. The HTML files also contain the English (for search engines and no-JS visitors) — if you change English wording, update it in the matching `.html` file too (search for the key, e.g. `data-i18n="home.hero.h1"`).

Anything in **[square brackets]** is highlighted on the page on purpose. Replace every one before launch (list below). Search the project for `[` to find them all.

Language: first visit follows the browser language; the EN/ES toggle is remembered per visitor.

## 5. Deploy
- **Netlify:** drag this folder onto app.netlify.com/drop. Add the domain under Domain settings.
- **Vercel:** `npx vercel` in this folder, or import a Git repo. Framework preset: "Other".
- **cPanel / shared hosting:** upload everything into `public_html/` with File Manager or FTP.
- **GoHighLevel Sites:** not a direct fit (GHL builds pages in its editor). Host the site on Netlify and use the GHL webhook for the form.

After you have the domain, find-and-replace `https://www.YOUR-DOMAIN.com/` in all five `.html` files (canonical URLs, Open Graph, structured data).

## 6. Production note on Tailwind
The site loads Tailwind from its Play CDN (as specified). It works, but Tailwind prints a "not for production" warning in the browser console, and it adds a small delay on first load. Almost all styling is in `css/styles.css`; Tailwind only supplies spacing utilities like `mt-8`. For best performance later, generate a static Tailwind file with the Tailwind CLI and replace the `<script src="https://cdn.tailwindcss.com">` line with a `<link>` to it.

---

## Things Paola must confirm (every bracketed item)

**Business facts**
- Which days the 8am–8pm hours apply to (footer shows "8am–8pm" only)
- Response time for quotes: "within 24 hours" on the home card, "[X] hours" on the quote page and success message
- Are cleaning supplies included? (How it works step 3, bento tile, FAQ 1)
- Same cleaner every visit? (bento tile)
- Does she work alone or with a small team? (About page)
- Key/door code/lockbox entry — is that how she works? (FAQ 3)
- Cancellation and rescheduling policy (FAQ 6)
- Payment methods (FAQ 7)
- Service area list: Austin, Round Rock, Cedar Park, Pflugerville, Leander, Georgetown, Buda, Kyle, Manor, Lakeway (home page, FAQ 8, structured data in each page's `<head>`)
- "What's included" lists for recurring and deep cleaning (Services page)
- "Not included / ask us" for each service (Services page)
- Typical duration for recurring vs. deep (comparison table)

**Content to supply**
- All photos in the shot list, including 8 before/after pairs
- Before/after captions: hours on site and area for each pair
- Three real customer reviews with first name and neighborhood (home page) — only real ones
- Number of reviews, once collected (bento tile)
- Instagram/Facebook links, if any (footer)
- Her story for the About page: where she's from, how she started 6 years ago, what she cares about most — ideally in her own words
- The live domain (replace `YOUR-DOMAIN.com`)
- The form endpoint (GoHighLevel webhook or Formspree)

**Brand note:** the brief listed `#1F9BD8` for buttons, but white text on it measures 3.1:1 (it needs 4.5:1). Buttons and links use a deeper blue from the same family, `#146FA5` (5.5:1). The brighter sky blue is still used in the wreath, droplets and icons.
