# Walnutterz

**The Original Walnut Head Football Figures: Reborn with a Twist.**

A mobile-first, professional e-commerce and community site for Walnutterz — bespoke,
hand-painted walnut head football figures. Built with **Next.js 15 (App Router)**,
TypeScript, Tailwind CSS v4, Prisma + SQLite, and Auth.js. Self-hostable with zero
external services required to run.

---

## Quick start

```bash
npm install          # installs deps + generates the Prisma client
npm run db:push      # creates the SQLite database (dev.db)
npm run db:seed      # seeds products, content, admin + demo customer
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

### Demo accounts

| Role     | Email                     | Password      |
| -------- | ------------------------- | ------------- |
| Admin    | `admin@walnutterz.com`    | `admin123`    |
| Customer | `customer@example.com`    | `password123` |

> Change these before going live. Registration is open at `/register`.

---

## What's included

### Storefront (13 pages from the brief + more)
- **Home** — hero, USPs, Featured Figure of the Week, product grid, community hub, testimonials.
- **Shop** (`/shop`) — filterable grid (search, category, occasion) + Featured Figure.
- **Product detail** (`/products/[slug]`) — gallery, price, reviews, related, schema.org `Product` + `Offer`.
- **Our Models, Custom Orders, About, About Us, Testimonials, FAQs (with FAQ schema), Contact, Contact Us, Blog** (`/blog`, `/blog/[slug]`).
- Competitor-insight pages: **Why Walnut?** (`/why-walnut`) and **Quick Turnaround** (`/quick-turnaround`).

### Community hub (all 7 confirmed features)
- **Featured Figure of the Week** — best-seller by trailing-week sales + customer reviews (out of 10).
- **The Football Time Tunnel** (`/time-tunnel`) — decade-by-decade legends, admin-managed.
- **Design Your Own Walnutterz** (`/design-your-own`) — full submission form with image uploads → admin inbox.
- **Customer Gallery** (`/gallery`) — auto-rotating slideshow + category filter + moderated submissions.
- **Meet the Maker** (`/meet-the-maker`) — admin-editable story + photo.
- **The Making of a Walnutterz** (`/making-of`) — process steps + optional video.
- **Gift Finder** (`/gift-finder`) — occasion-based routing into the shop.

### Shopping & accounts
- Persistent cart (localStorage) with slide-out drawer, cart page, and checkout.
- Checkout creates real orders; **Stripe Checkout** when keys are set, safe **mock mode** otherwise.
- **Customer dashboard** (`/account`) — order history, profile, and add/change payment methods.

### Admin area (`/admin`, admin role only)
- Dashboard with revenue/order/stock stats.
- **Product CRUD** with image upload (create, edit, delete/soft-delete).
- **Orders** list + detail with status updates.
- **Design requests** inbox, **Gallery moderation**, **Site content** editors, **Messages**.

### SEO
- Per-page metadata + canonical + Open Graph/Twitter, `Organization`/`Product`/`FAQPage`/`Article` schema.
- Auto-generated `robots.txt` and `sitemap.xml` (includes products + blog posts).

---

## Payments (Stripe)

The app runs in **mock mode** out of the box — orders are recorded and cards are
validated/stored as brand + last-4 only (no full PAN is ever persisted), with no real
charges. To enable live payments, add your keys to `.env`:

```env
STRIPE_SECRET_KEY="sk_test_…"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_…"
```

Checkout then redirects to Stripe Checkout. A webhook to confirm `PENDING → PAID` can
be wired at `/api/checkout` (session id is stored on the order).

---

## Configuration (`.env`)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite path (default `file:./dev.db`). Swap for Postgres/MySQL by changing the Prisma datasource. |
| `AUTH_SECRET` | Auth.js session secret — **generate a fresh one for production** (`openssl rand -base64 32`). |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used for SEO, sitemap and Stripe redirects. |
| `STRIPE_*` | Optional — enables live payments. |

---

## Project structure

```
src/
  app/                 # App Router pages, layouts, API routes
    admin/             # Admin dashboard (role-gated)
    account/           # Customer dashboard (auth-gated)
    api/               # REST endpoints (auth, checkout, uploads, admin)
    products/[slug]/   # Product detail pages
  components/          # Header, Footer, cart, forms, admin widgets
  content/             # Vendored brief JSON + typed page-content accessor
  context/             # Cart context (client)
  lib/                 # prisma, auth session, money, products, uploads, stripe
prisma/
  schema.prisma        # Data model
  seed.mjs             # Seed data (products, content, users)
public/assets/         # Brand + product imagery (downloaded from the brief)
public/uploads/        # User-generated uploads (gallery, custom requests)
```

## Notes
- Images are served unoptimized (`next.config.mjs`) so the app needs no image binary at runtime — ideal for self-hosting.
- Content language: British English, per the brief.
- To move off SQLite for production, point `DATABASE_URL` at Postgres and update `datasource db.provider` in `prisma/schema.prisma`, then `prisma migrate`.
