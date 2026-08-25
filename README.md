# Titan America Brokers — website

Static site. Plain HTML, CSS, and vanilla JS. No framework, no build step, no npm.
Open `index.html` in a browser to run it. Upload the folder contents to a repo root to deploy on GitHub Pages.

---

## Files

```
index.html            Home
auto-transport.html   Auto Transport
dealerships.html      Dealerships  (primary sales page)
freight.html          Freight
about.html            About
contact.html          Contact
privacy.html          Privacy Policy   (noindex)
terms.html            Terms of Service (noindex)

assets/css/styles.css All styling
assets/js/main.js     Nav, scroll reveal, form validation, form submit
assets/img/           Your images go here — see the list below

sitemap.xml  robots.txt  .nojekyll  README.md
```

---

## Images to make

Every image slot renders as a `#101010` placeholder block with a hairline border and a label until you drop a real file in. Filenames are exact — match them and the placeholders disappear on their own.

| File | Size | Where it appears |
|---|---|---|
| `assets/img/logo.png` | **400×100** (PNG, transparent) | Header and footer, every page. Silver-on-transparent sits directly on the dark background. Until it exists, a text wordmark shows instead. |
| `assets/img/favicon.png` | **512×512** (PNG) | Browser tab icon, every page |
| `assets/img/og.jpg` | **1200×630** | Social share preview (Facebook, LinkedIn, iMessage) |
| `assets/img/hero.jpg` | **1600×900** | Home — hero |
| `assets/img/dealer.jpg` | **1200×900** | Home — dealership section |
| `assets/img/dealer-hero.jpg` | **1600×900** | Dealerships — hero |
| `assets/img/backup.jpg` | **1200×900** | Dealerships — backup coverage section |
| `assets/img/auto-hero.jpg` | **1600×900** | Auto Transport — hero |
| `assets/img/open-transport.jpg` | **1200×800** | Auto Transport — open transport |
| `assets/img/enclosed-transport.jpg` | **1200×800** | Auto Transport — enclosed transport |
| `assets/img/freight.jpg` | **1600×686** | Freight — hero |
| `assets/img/about.jpg` | **1600×686** | About — hero |
| `assets/img/office.jpg` | **1600×686** | Contact — office |

Images are cropped with `object-fit: cover`, so an oversized file still works — just keep the aspect ratio close. Export JPGs at 70–80% quality and keep each one under about 250KB so the pages stay fast.

---

## Forms

Three forms: the vehicle quote form (Home and Auto Transport), the dealer quote form (Dealerships), and the contact form (Contact).

Open `assets/js/main.js` and set the endpoint at the top:

```js
var FORMSPREE_ENDPOINT = "";                          // paste your Formspree URL here
var FALLBACK_EMAIL = "info@titanamericabrokers.com";  // used when the endpoint is blank
```

- **Endpoint set** — submissions POST as JSON to Formspree and the success panel shows in place of the form.
- **Endpoint blank** — the form opens a pre-filled email to `FALLBACK_EMAIL` with every field on its own line. Works everywhere, but you're relying on the visitor to hit send, so set the endpoint before you drive traffic.

To get an endpoint: create a free Formspree account, add a form, copy the URL (`https://formspree.io/f/xxxxxxx`), paste it between the quotes. Nothing else changes.

Each form already has client-side validation with inline errors, a hidden honeypot field (`company_website`) that silently drops bots, and a visible consent line about phone/email/text contact.

---

## Before you publish

1. **Domain** — the canonical tags, Open Graph URLs, `sitemap.xml`, and `robots.txt` all use `https://titanamericabrokers.com`. Find and replace if the live domain is different (including the GitHub Pages subdomain if you launch there first).
2. **Formspree endpoint** — see above.
3. **Broker authority line** — every page footer has this commented out. Uncomment on all eight pages once authority is active and the numbers are issued:
   ```html
   <!-- Uncomment once broker authority is active:
   <p class="disclaimer" style="margin-top:28px">MC #000000 · USDOT #0000000</p>
   -->
   ```
   Nothing on the site claims licensing, bonding, insurance, MC, or USDOT status today. Keep it that way until the authority is granted.
4. **Legal pages** — Privacy and Terms are written to be accurate for a brokerage, not reviewed by counsel. Have an attorney read them before you take real volume.
5. **Google Business Profile** — the address, phone, and hours on the site must match the profile exactly, character for character. That match is what earns the local map ranking.

---

## Deploying to GitHub Pages

1. Create a repo (public).
2. Upload the **contents** of this folder to the repo root — `index.html` must sit at the top level, not inside a subfolder.
3. Settings → Pages → Source: `Deploy from a branch` → Branch: `main`, folder: `/ (root)` → Save.
4. Live in a minute or two at `https://<username>.github.io/<repo>/`.
5. For the real domain: add a file named `CNAME` at the root containing `titanamericabrokers.com`, then point the DNS A records at GitHub's IPs per their custom-domain docs.

`.nojekyll` is included so GitHub serves the files as-is.

---

## Notes

- **Fonts** — headings use Oswald, body uses Barlow, both loaded from Google Fonts (about 40KB). Offline or if you'd rather not call an external host, delete the two `preconnect` lines and the `fonts.googleapis.com` stylesheet link from each page; the CSS falls back to a condensed system stack.
- **Page weight** — roughly 45–60KB per page before your images.
- **Accessibility** — semantic landmarks, labeled fields, visible focus rings, `prefers-reduced-motion` respected, works down to 360px wide.
- **SEO targets** — nationwide auto transport, auto transport broker, dealership auto transport, auction vehicle transport, enclosed auto transport, car shipping Los Angeles. Titles and meta descriptions are already written against these; the dealership page is the one to build links to.
