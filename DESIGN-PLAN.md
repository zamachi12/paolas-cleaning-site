# Design plan — Paola's Cleaning Services (Pass 1)

## 1. Token system

**Color** (sampled from the logo brief, refined for contrast — ratios measured, not guessed)

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--blue-600` | `#1F9BD8` | Brand sky blue: droplet motif, borders on focus, large decorative moments, the stat tile's fill is *not* this (see below) | white on it = 3.12 → **fails 4.5 for text**, so it never carries white body/button text |
| `--blue-700` | `#146FA5` | **Added.** Primary button fill, links, focus ring, the one blue bento tile | white on it = 5.46 ✓; on `--blue-100` = 4.9 ✓ |
| `--blue-800` | `#0E4A73` | All headings and body text | 9.35 on white, 8.39 on `--blue-100` ✓ |
| `--blue-500m` | `#3E6C8E` | Secondary text, section labels (replaces "800 at reduced opacity", which is fragile on tinted bands) | 5.61 on white, 5.03 on `--blue-100` ✓ |
| `--blue-100` | `#E6F5FC` | Section bands, card fills, form fields | — |
| `--blue-200` | `#BFE6F7` | Borders, dividers, nav bottom line | — |
| `--green-500` | `#8DC63F` | Accent: label ticks, check discs, "free quotes" states. Text on green is always `--blue-800` (4.58 ✓); white on green (2.04) is never used | — |
| `--green-100` | `#EEF7DF` | Success state, two bento tiles | — |

Correction to the brief: the brief says white on `#1F9BD8` passes 4.5:1. It measures 3.12:1, so buttons use the deeper `--blue-700` from the same hue family. The sky blue still leads visually through the motif, borders and droplets.

**Type** — Outfit (display, 500/600): rounded geometric, echoes the wordmark without copying it. Nunito Sans (body, 400/600/700): soft terminals, very legible. Fallback: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`.

Scale (fluid `clamp`): display 36→68px · h2 30→48px · h3 22→28px · lead 18→20px · body 17px/1.6 · small 15px · label 15px.

**Spacing** 4-pt base: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Section padding `clamp(64px, 9vw, 128px)`. Gutter `clamp(16px, 4vw, 40px)`, max content 1240px.

**Radius** — two only: `--r-pill: 999px` (buttons, chips, toggle), `--r-card: 20px` (cards, photos, form card, inputs).

## 2. Layout concepts

- **Home** — full-bleed photo hero with a white wash from the left; headline block left, floating quote card right wrapped in the droplet wreath. Then alternating white / `--blue-100` bands: who we help → services rows → staggered how-it-works → bento → one slider → testimonial slots → area chips → CTA band.
- **Services** — short light hero; two long sections, image left/right alternating; frequency cards that deep-link into the form; comparison table; FAQ accordion.
- **Before & After** — portfolio: filter chips, grid of slider cards (1/2/3 cols), counts announced.
- **About** — portrait-led hero in Paola's voice, draft story with bracketed facts, how-I-work list, stats, values, photo strip.
- **Quote** — two columns: reassurance left, form card right on a `--blue-100` page band. Single column on mobile with the form first after a short intro.

Alignment: left-aligned type throughout. Centered only inside the CTA bands.

```
HOME (desktop)
+--------------------------------------------------------------------+
| [logo]   Home Services Before&After About   512-855-8006 EN|ES [Get a free quote (>)] |
+--------------------------------------------------------------------+
| (photo: sunlit Austin kitchen, white wash from left)              |
|  Trusted by 400+ Austin homes              .-~ droplet wreath ~-.  |
|  A clean home, without the                (  +-----------------+ ) |
|  weekend spent cleaning.                  (  | [photo]         | ) |
|  One sentence.                            (  | ✓ 6 years       | ) |
|  [Get a free quote (>)]                    ( | ✓ recurring+deep| ) |
|                                             '| [Get a quote >] |'  |
+--------------------------------------------------------------------+
| — Who we help      Headline ....................  [About Paola (>)]|
| [Houses]           [Apartments & condos]           [Rentals]       |  blue-100
| [ photo                      ] [ photo                      ]      |
+--------------------------------------------------------------------+
| — Our services   | Two ways we clean, both done thoroughly.        |
| Recurring home cleaning — tagline                          (v)     |
|   [photo] included ✓✓✓  stat  [See service details]  (open)        |
| Deep cleaning — tagline                                    (>)     |
+--------------------------------------------------------------------+
| How it works:  [1 photo][2 photo]                                  |
|                    [3 photo][4 photo]   Ready to get started? [btn]|
+--------------------------------------------------------------------+
| Bento (blue-100): [6 years][400+ homes][tall photo]                |
|                   [same cleaner][supplies][free quotes][feedback]  |
+--------------------------------------------------------------------+
| Before/after slider  + caption  [See all results]                  |
| Testimonials x3 [placeholders]  | Area chips | CTA band | footer   |
+--------------------------------------------------------------------+

QUOTE (desktop)
+--------------------------------------------------------------------+
| nav                                                                |
+-------------------------------+------------------------------------+
| — Free quote                  |  +------------------------------+  |
| Tell us about your home.      |  | Full name  [__________]      |  |
| We'll send a price.           |  | Phone [____]  Email [_____]  |  |
| 1 You send the form           |  | Address or ZIP [__________]  |  |
| 2 Paola replies [X hours]     |  | (o) Recurring  ( ) Deep      |  |
| 3 You pick a date             |  | Frequency: weekly/bi/monthly |  |
| 512-855-8006 · email          |  | Beds [v] Baths [v] Sq ft [ ] |  |
| No obligation. No hidden fees.|  | Date [ ]  Notes [______]     |  |
|                               |  | Heard about us [v]           |  |
|                               |  | [Send my quote request]      |  |
+-------------------------------+------------------------------------+
| footer                                                             |
```

## 3. The one bold move

A hand-drawn SVG **wreath arc of droplets and leaves** hugging the hero's quote card — the same vocabulary as the logo's wreath, opened into a crescent so it reads as "this card is the brand's doorway." It appears once, on the most important conversion element above the fold. Everything else stays quiet: no droplet masks in the gallery, no scattered background droplets. The favicon reuses one droplet + one leaf from that same drawing.

## 4. Self-review against the anti-patterns

| Anti-pattern | Status |
|---|---|
| Dark navy/black sections | Clear — darkest fill is `--blue-700` on one bento tile and buttons |
| Yellow/terracotta/purple, gradients | Clear — the hero's white wash is the only overlay (legibility, not decoration) |
| ALL-CAPS eyebrows | Clear — sentence-case labels with a 24px green tick |
| 01/02 on services | Clear — numbers only on How it works |
| Colored/italic word in headline | Clear |
| "→" glued to text | Clear — SVG arrow in a round badge |
| Emoji icons | Clear — inline Lucide-style SVG |
| Identical cards/same shadow | Revised: first draft had white shadowed cards everywhere. Now cards are flat fills (white on blue bands, blue-100 on white) with a 1px `--blue-200` border; only the hero card and the quote form carry a shadow |
| Centering everything | Clear — centered only in CTA bands |
| Inter/Space Grotesk/Poppins | Clear — Outfit + Nunito Sans |
| Fade-up per section / hover-lift everywhere | Clear — one hero reveal; hover changes color only |
| Placeholder-only labels | Clear |
| Fabricated reviews/ratings/badges | Clear — bracketed slots, highlighted in the page |
| Lorem ipsum | Clear |
| 100vh hero | Clear — content-sized |
| Fixed px containers | Clear — `min(1240px, 100% - 2*gutter)` |
| `#111` text | Clear — `--blue-800` |

"Would I make this for any cleaning company?" — the generic version would be a stock hero with a centered headline and three service icons. What makes this Paola's: the wreath taken from her own logo, the first-person About page, the Austin-area chips, bilingual copy written for Texas Spanish speakers, and a gallery built as proof of her real jobs instead of stock photos.
