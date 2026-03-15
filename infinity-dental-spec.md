# 🦷 Infinity Dental Clinic — Website Rebuild Spec
> HTML · CSS · JS · DecapCMS · Vibe-code Ready

---

## 1. Project Overview

Rebuild `democmsdental.netlify.app` as a fast, optimized, multi-page static site with DecapCMS admin panel. All content (text, images, blogs) editable by non-technical admin without touching code.

| Stack | CMS | Hosting |
|-------|-----|---------|
| HTML + CSS + Vanilla JS | DecapCMS (Git-based) | Netlify (free tier) |

---

## 2. Design System

### Colors (same palette)
```
--deep   #0C4A6E   dark navy headings
--sky    #0EA5E9   primary blue / CTAs
--teal   #14B8A6   accent / gradient pair
--mist   #F0F9FF   light page background
--ice    #E0F2FE   card backgrounds
--ink    #0F172A   body text
--gray   #64748B   secondary text
```

### Fonts (Google Fonts — load with display=swap)
- **Display / Headings:** Playfair Display (serif, bold/italic)
- **Body:** DM Sans (clean, 300–500 weight)
- **Numbers / Stats:** Space Mono (monospace)

### Rules
- No Inter / Roboto / Arial
- Sky+Teal gradient on all primary CTAs
- Cards: border-radius 16–20px, subtle box-shadow
- Hover: `translateY(-3px)` + deeper shadow, `transition: 0.25s ease`
- Mobile-first, breakpoints: 768px (tablet), 1024px (desktop)

---

## 3. File Structure

```
/project-root
├── index.html              ← Home
├── services.html           ← Services
├── about.html              ← Dr. Anmol
├── gallery.html            ← Gallery
├── reviews.html            ← Reviews
├── blog.html               ← Blog list
├── blog-post.html          ← Single post template
├── contact.html            ← Contact
├── css/
│   └── main.css            ← All styles (vars, components, pages)
├── js/
│   ├── main.js             ← Nav, animations, shared utils
│   └── cms-bridge.js       ← Fetches JSON → renders page content
├── images/                 ← All site images
├── _data/
│   ├── site.json           ← Doctor info, clinic details, stats
│   ├── services.json       ← All service cards
│   ├── gallery.json        ← Before/after image pairs
│   ├── reviews.json        ← Patient reviews
│   ├── about.json          ← Doctor bio, credentials, timeline
│   └── blog/               ← One .md file per blog post
├── admin/
│   ├── index.html          ← DecapCMS panel (1 script tag)
│   └── config.yml          ← CMS collections config
└── netlify.toml            ← Redirects + Identity config
```

---

## 4. Pages

### 4.1 Home `index.html`

**Sections (top to bottom):**

```
┌─────────────────────────────────────────────────────┐
│ NAV — fixed, blur backdrop                           │
│ Logo left · Links center · Visit Us + Book right     │
└─────────────────────────────────────────────────────┘
┌────────────────────┬────────────────────────────────┐
│ HERO LEFT (white)  │ HERO RIGHT (sky gradient)       │
│ · Tag pill         │ · Doctor photo (rounded top)    │
│ · Big headline     │ · Float badge: Painless         │
│ · Stats 16+/500+/4.9│· Float badge: Expert Surgeon  │
│ · [Book] [WhatsApp]│ · Rating badge 4.9★             │
└────────────────────┴────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ TICKER ← scrolling: Experience · Rating · MCI →     │
└─────────────────────────────────────────────────────┘
┌──────┬──────┬──────┬──────┐
│ SVC  │ SVC  │ SVC  │ SVC  │  ← SERVICES GRID (4-col)
│(dark)│      │      │      │  hover = sky+teal gradient
└──────┴──────┴──────┴──────┘
┌────────────────────┬────────────────────────────────┐
│ DOCTOR PHOTO       │ BIO + QUOTE + CREDS + BUTTONS  │
│ + badge (16+ yrs)  │                                │
└────────────────────┴────────────────────────────────┘
┌──────────────────────┬──────────────────────────────┐
│ WHY US — numbered    │ DARK STAT PANEL               │
│ 01 Tech 02 Pain-Free │ 4.9★ / 500+ / 10K+ / MCI     │
│ 03 Expertise 04 Safe │                              │
└──────────────────────┴──────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ CTA BANNER (deep blue) — [Book Appt] [WhatsApp Us]  │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ FOOTER — Brand | Services | Links | Contact+Hours   │
└─────────────────────────────────────────────────────┘
                                    [💬 WhatsApp float]
```

---

### 4.2 Services `services.html`
- Short hero banner + breadcrumb
- Filter tabs: All / Implants / Cosmetic / Restorative / Preventive
- 3-col card grid: icon + name + short desc + View Detail
- Click card → inline detail drawer (full desc + image)
- CTA section at bottom

### 4.3 Dr. Anmol `about.html`
- Hero: doctor photo right, intro + MCI badge left
- Education + career timeline (vertical)
- Specializations icon grid (6 items)
- Pull quote on deep blue background
- Stats: 16+ yrs / 500+ patients / 10K+ treatments / 25+ services
- Book Consultation CTA

### 4.4 Gallery `gallery.html`
- Filter tabs: All / Smile Makeover / Implants / Braces / Whitening
- Before/After card grid — side-by-side or slider comparison
- Click → full-screen lightbox with prev/next
- Caption: case label + treatment type

### 4.5 Reviews `reviews.html`
- Hero: 4.9★ large + total count + "As seen on Google" badge
- 3-col masonry cards: stars + review text + name + date
- Load More button (JS pagination, no reload)

### 4.6 Blog `blog.html`
- Featured post (large card, latest)
- 3-col grid: thumbnail + tag + title + excerpt + date + Read More

### 4.7 Blog Post `blog-post.html`
- Single template — rendered dynamically from markdown via JS
- Header: title + author + date + tag
- Body: marked.js parses markdown → HTML
- Share buttons: WhatsApp + copy link
- Related posts (3 cards) at bottom

### 4.8 Contact `contact.html`
- Two-col: left = form (Name, Phone, Service, Message, Submit), right = info + map
- `#appointment` hash scrolls to form
- Hours table: Mon–Sun 10AM–2PM & 5PM–9PM
- Google Maps embed (Vijay Nagar, Indore)
- Large WhatsApp direct button

---

## 5. Shared Components (every page)

### NAV (`main.js` injects or include via fetch)
- Fixed top, backdrop-filter blur
- Logo + 7 nav links + Visit Us (ghost) + Book Appointment (filled)
- Active link: highlight based on `window.location.pathname`
- Mobile: hamburger icon → slide-in drawer

### FOOTER (same HTML on all pages)
- 4-col desktop, 2-col tablet, 1-col mobile
- Brand blurb, core services, quick links, address + hours

### Floating WhatsApp Button
- Fixed bottom-right, green (#25D366), opens `wa.me/917987654321`
- Subtle pulse animation, z-index 99

---

## 6. DecapCMS Admin Panel

Admin lives at `/admin` — protected via Netlify Identity.

### `admin/index.html`
```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body>
<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

### Admin Wireframe
```
┌──────────────┬────────────────────────────────────────┐
│ SIDEBAR      │ MAIN PANEL — e.g. Services              │
│              │                                         │
│ 🦷 Infinity  │  [ + New Service ]              (top)   │
│ ──────────── │  ─────────────────────────────────────  │
│ Site Info    │  🦷 Implants & Grafting  [Edit] [Delete] │
│ Services     │  ✨ Smile Makeover       [Edit] [Delete] │
│ Gallery      │  👑 Crowns & Bridges     [Edit] [Delete] │
│ Reviews      │  ⚡ Single Sitting RCT   [Edit] [Delete] │
│ Blog         │  ...                                    │
│ Doctor Info  │                                         │
└──────────────┴────────────────────────────────────────┘
```

### CMS Collections

| Collection | File | Admin Can |
|------------|------|-----------|
| Site Info | `_data/site.json` — name, phone, hours, address, stats | Edit text & numbers |
| Services | `_data/services.json` — icon, name, desc, category | Add / Edit / Delete |
| Gallery | `_data/gallery.json` — before img, after img, label, category | Upload images, add cases |
| Reviews | `_data/reviews.json` — name, stars, text, date | Add / Edit / Delete |
| Blog Posts | `_data/blog/*.md` — title, date, tag, thumbnail, body | Create / Edit / Delete |
| Doctor Info | `_data/about.json` — bio, credentials, timeline, quote | Edit bio & career |

### How CMS → Website Works
1. Admin edits content in DecapCMS at `/admin`
2. DecapCMS commits changes to GitHub repo (`_data/` files)
3. Netlify auto-deploys on every commit (< 30 sec)
4. `cms-bridge.js` fetches JSON on page load → injects into DOM placeholders
5. Blog posts: `marked.js` parses markdown → injects into `blog-post.html` template

---

## 7. Image Rules & Size Handling

| Image Type | Max Upload | Recommended Dimensions |
|------------|------------|------------------------|
| Doctor hero photo | 500 KB | 800×1000px, portrait, JPG |
| Service card icon | 50 KB | 200×200px, PNG/SVG |
| Gallery before/after | 600 KB each | 1200×800px, JPG, landscape |
| Blog thumbnail | 300 KB | 800×450px (16:9), JPG |
| Clinic interior | 600 KB | 1200×800px, JPG |
| Logo | 100 KB | 200×200px, PNG/SVG |

### Validation Rules
- Show error toast if file > max: `"Image too large! Keep under 500KB"`
- Use `<img loading="lazy">` on all below-fold images
- Always set explicit `width` + `height` to prevent layout shift
- Use `object-fit: cover` on all image containers — no stretching
- Fallback: if image fails, show placeholder with clinic color + 🦷 icon

### config.yml hint example
```yaml
- label: Doctor Photo
  name: doctor_photo
  widget: image
  hint: "Max 500KB · 800x1000px · Portrait JPG only"
```

---

## 8. Performance Rules

- Google Fonts: `display=swap` — no render blocking
- `<link rel="preconnect" href="https://fonts.googleapis.com">`
- All `<script>` tags: `defer` attribute
- Images: compress to WebP where possible
- CSS ticker/marquee: CSS animation only, no JS
- No jQuery — vanilla JS only
- Minify CSS + JS before deploy
- **Target:** Lighthouse Performance 90+, Accessibility 95+

---

## 9. DecapCMS `config.yml` Skeleton

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: images
public_folder: /images

collections:
  - name: site
    label: Site Info
    files:
      - file: _data/site.json
        label: Site Settings
        name: site
        fields:
          - { label: Doctor Name, name: doctor_name, widget: string }
          - { label: Phone, name: phone, widget: string }
          - { label: Address, name: address, widget: string }
          - { label: Hours, name: hours, widget: string }
          - { label: Years Experience, name: years_exp, widget: number }
          - { label: Happy Patients, name: patients, widget: number }
          - { label: Google Rating, name: rating, widget: number }
          - { label: Doctor Photo, name: doctor_photo, widget: image, hint: "Max 500KB · 800x1000px" }

  - name: services
    label: Services
    folder: _data/services
    create: true
    slug: "{{slug}}"
    fields:
      - { label: Name, name: title, widget: string }
      - { label: Icon (emoji), name: icon, widget: string }
      - { label: Short Description, name: desc, widget: text }
      - { label: Full Description, name: body, widget: markdown }
      - { label: Category, name: category, widget: select, options: [Implants, Cosmetic, Restorative, Preventive] }

  - name: gallery
    label: Gallery
    folder: _data/gallery
    create: true
    fields:
      - { label: Label, name: title, widget: string }
      - { label: Category, name: category, widget: select, options: [Smile Makeover, Implants, Braces, Whitening] }
      - { label: Before Image, name: before, widget: image, hint: "Max 600KB · 1200x800px" }
      - { label: After Image, name: after, widget: image, hint: "Max 600KB · 1200x800px" }

  - name: reviews
    label: Reviews
    folder: _data/reviews
    create: true
    fields:
      - { label: Patient Name, name: name, widget: string }
      - { label: Stars (1-5), name: stars, widget: number, min: 1, max: 5 }
      - { label: Review Text, name: body, widget: text }
      - { label: Date, name: date, widget: date }

  - name: blog
    label: Blog Posts
    folder: _data/blog
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Date, name: date, widget: datetime }
      - { label: Tag, name: tag, widget: string }
      - { label: Thumbnail, name: thumbnail, widget: image, hint: "Max 300KB · 800x450px (16:9)" }
      - { label: Excerpt, name: excerpt, widget: text }
      - { label: Body, name: body, widget: markdown }
```

---

## 10. `netlify.toml`

```toml
[[redirects]]
  from = "/admin"
  to = "/admin/index.html"
  status = 200

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200

[build]
  publish = "."
```

> Also enable **Netlify Identity** + **Git Gateway** in Netlify dashboard → Site Settings → Identity.

---

## 11. Build Checklist

### Phase 1 — Core Site
- [ ] Create file structure as in Section 3
- [ ] Build shared nav (all links, active state, mobile hamburger) in `main.js`
- [ ] Build shared footer HTML
- [ ] Build `index.html` — all 8 sections
- [ ] Build `services.html` — filter tabs + card grid + detail drawer
- [ ] Build `about.html` — timeline + stats + quote
- [ ] Build `gallery.html` — filter + lightbox
- [ ] Build `reviews.html` — grid + load more
- [ ] Build `blog.html` + `blog-post.html` (marked.js rendering)
- [ ] Build `contact.html` — form + map embed
- [ ] Wire all internal links between pages

### Phase 2 — CMS Integration
- [ ] Create `admin/index.html` (DecapCMS script tag only)
- [ ] Create `admin/config.yml` with all collections (copy from Section 9)
- [ ] Create `_data/site.json`, `services.json`, `gallery.json`, `reviews.json`, `about.json` with sample data
- [ ] Write `cms-bridge.js` — fetch JSON → inject into DOM `data-cms` placeholders
- [ ] Enable Netlify Identity + Git Gateway in Netlify dashboard
- [ ] Test: edit in admin → commit → Netlify deploys → page updates
- [ ] Test image upload + size validation warning toast

### Phase 3 — Polish & Deploy
- [ ] Test all pages on mobile (hamburger, touch targets, readable text)
- [ ] Add `loading="lazy"` to all below-fold images
- [ ] Check all internal links work
- [ ] Minify CSS + JS
- [ ] Check Lighthouse scores (target 90+)
- [ ] Deploy to Netlify — verify `/admin` works with Identity

---

## Key Data (hardcode as defaults)

```
Clinic:   Infinity Dental Clinic
Doctor:   Dr. Anmol Billore — BDS, Implantologist
Phone:    +91 79876 54321
Address:  34, Scheme No. 54, Vijay Nagar, Indore
Hours:    10AM–2PM & 5PM–9PM, Mon–Sun
Stats:    16+ yrs · 500+ patients · 4.9★ · 10,000+ treatments · MCI Verified
WA link:  https://wa.me/917987654321
Doctor photo: https://democmsdental.netlify.app/dr-billore.jpg
```

---

*Give this entire file to your AI coder. It has everything needed to build the full site.*
