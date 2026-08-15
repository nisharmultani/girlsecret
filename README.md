# GirlSecret

E-commerce site for the GirlSecret brand, built with Next.js (Pages Router) and Supabase (Postgres).

## Tech stack

- **Framework:** Next.js 14 (Pages Router), React 18, Tailwind CSS
- **Database:** Supabase (Postgres) — see `supabase/schema.sql`
- **Payments:** Stripe
- **Email:** Resend (SendGrid/AWS SES also supported, see `lib/email.js`)
- **Images:** Cloudinary (review photo uploads), `sharp` for local optimization

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up the database**
   - Create a Supabase project.
   - In the Supabase SQL Editor, run `supabase/schema.sql` to create all tables.
   - Optionally run `supabase/seed.sql` for sample products, a test login
     (`test@girlsecret.co.uk` / `Password123`), orders, reviews, etc.

3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in real values.
   - At minimum you need `NEXT_PUBLIC_SUPABASE_URL` and
     `SUPABASE_SERVICE_ROLE_KEY` for the app to run at all.

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Project structure

- `pages/` — Next.js pages and API routes (`pages/api/`)
- `lib/db.js` — all database access (Supabase queries), one function per operation
- `lib/supabase.js` — Supabase client (service-role key, server-side only)
- `lib/auth.js` / `lib/adminAuth.js` — password hashing and session helpers for customers/admin
- `lib/stripe.js`, `lib/email.js` — payment and email integrations
- `components/` — shared UI, grouped by area (`product/`, `admin/`, `blog/`, `layout/`, `ui/`)
- `context/` — React context providers (auth, wishlist)
- `supabase/schema.sql` — full database schema, with comments explaining non-obvious design choices
- `supabase/seed.sql` — sample data for local development

## Known gaps

- **Admin API routes are not authenticated.** `lib/adminAuth.js` has a
  `requireAdminAuth` middleware, but no `/api/admin/*` route uses it yet, and
  the admin frontend doesn't send an auth token on its API calls either — both
  sides need updating together. See `ADMIN_LOGIN_SETUP.md`.
- **Default admin password is in source control** (`pages/api/admin/auth/login.js`).
  Set `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` before deploying.
- A few referenced image assets don't exist in `public/`: PWA icons
  (see `public/icons/README.md`), `public/og-image.jpg`, and
  `public/images/blog-placeholder.jpg`.
