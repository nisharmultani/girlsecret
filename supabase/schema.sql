-- GirlSecret database schema (Postgres / Supabase)
-- Mirrors the Airtable base this app used to run on. Run this once in the
-- Supabase SQL editor (Project > SQL Editor > New query) against a fresh
-- project.
--
-- Changes made vs. the original Airtable schema, and why:
--   - orders.user_id is a real nullable foreign key + a separate
--     guest_email column, replacing the "guest_<email>" string that used
--     to be stuffed into the same text field as real user record IDs.
--   - order_items is a proper table instead of a JSON-encoded "Items"
--     text field, so line items can be queried/joined/reported on.
--   - wishlists has a real UNIQUE(user_id, product_id) constraint instead
--     of Airtable's "UniqueKey" formula-field workaround.
--   - Dormant/duplicate fields we found while auditing (Newsletter.User,
--     Products' duplicate "In Stock"/"InStock", the unused "Reviews"/
--     "Reviews 2" link fields, Products' unexplained InfoBanners link)
--     were dropped rather than carried over.
--   - AliExpressStatus was renamed to supplier_status (same meaning:
--     internal fulfillment/dropship tracking, distinct from the
--     customer-facing order status).

create extension if not exists pgcrypto;

-- Shared helper: keep an `updated_at` column current on every UPDATE.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ===========================================================================
-- USERS
-- ===========================================================================
create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  first_name text,
  last_name text,
  phone text,
  active boolean not null default true,
  email_verified boolean not null default false,
  verification_token text,
  verification_token_expiry timestamptz,
  reset_token text,
  reset_token_expiry timestamptz,
  created_at timestamptz not null default now()
);

create index idx_users_email on users (email);

-- ===========================================================================
-- ADDRESSES
-- ===========================================================================
create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  full_name text,
  label text default 'Home',
  address_line1 text,
  address_line2 text,
  city text,
  postcode text,
  country text,
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_addresses_user_id on addresses (user_id);

-- ===========================================================================
-- PRODUCTS
-- ===========================================================================
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  sale_price numeric(10, 2),
  category text,
  slug text not null unique,
  images jsonb not null default '[]',
  -- Despite the name (and despite being a linked-record field in
  -- Airtable), this isn't a reference to other product rows - it's a
  -- second gallery of variant/style images for THIS product, used for the
  -- ProductCard hover-swap and the extended gallery on the product page.
  -- Same shape as `images`.
  available_product_images jsonb not null default '[]',
  in_stock boolean not null default true,
  featured boolean not null default false,
  keywords text,
  sizes text[] default '{}',
  colors text[] default '{}',
  sold_count integer not null default 0,
  -- average_rating/review_count are denormalized caches. The app computes
  -- these live from the reviews table (see get_product_review_stats
  -- below) - these columns exist for admin-view parity with the old
  -- Airtable fields, not as the source of truth.
  average_rating numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  specifications text,
  video_urls text[] default '{}',
  created_at timestamptz not null default now()
);

create index idx_products_slug on products (slug);
create index idx_products_category on products (category);
create index idx_products_featured on products (featured) where featured = true;

-- ===========================================================================
-- REVIEWS
-- ===========================================================================
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  name text,
  email text,
  rating integer not null check (rating between 1 and 5),
  comment text,
  images jsonb not null default '[]',
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- The single biggest fix from the Airtable version: this is what lets
-- "reviews for product X" be a fast indexed lookup instead of a full
-- table scan filtered in JavaScript.
create index idx_reviews_product_id on reviews (product_id) where approved = true;

-- ===========================================================================
-- ORDERS + ORDER ITEMS
-- ===========================================================================
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references users (id) on delete set null,
  guest_email text,
  customer_name text,
  customer_email text,
  subtotal numeric(10, 2) not null default 0,
  shipping_cost numeric(10, 2) not null default 0,
  discount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  status text not null default 'Pending'
    check (status in ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  -- Set by the Stripe webhook (pages/api/payment/webhook.js), independent
  -- of `status` above: a paid order can still be Pending fulfillment.
  payment_status text,
  payment_intent_id text,
  payment_method text,
  amount_received numeric(10, 2),
  payment_error text,
  shipping_address jsonb,
  billing_address jsonb,
  promo_code text,
  referral_code text,
  tracking_number text,
  carrier text,
  -- Internal dropship/fulfillment tracking, separate from `status` above
  -- (was "AliExpressStatus" in Airtable).
  supplier_status text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_user_id on orders (user_id);
create index idx_orders_order_number on orders (order_number);
create index idx_orders_customer_email on orders (customer_email);

create trigger trg_orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  -- Snapshot of the product name/price/image at purchase time, so
  -- historical orders stay accurate (and still render a thumbnail) even if
  -- the product is later renamed/repriced/deleted.
  product_name text,
  product_slug text,
  image text,
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null default 0,
  size text,
  color text
);

create index idx_order_items_order_id on order_items (order_id);
create index idx_order_items_product_id on order_items (product_id);

-- ===========================================================================
-- WISHLISTS
-- ===========================================================================
create table wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  product_id uuid not null references products (id) on delete cascade,
  added_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index idx_wishlists_user_id on wishlists (user_id);

-- ===========================================================================
-- NEWSLETTER
-- ===========================================================================
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  source text,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  resubscribed_at timestamptz,
  unsubscribed_at timestamptz
);

-- ===========================================================================
-- CONTACT MESSAGES
-- ===========================================================================
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  subject text,
  message text,
  status text not null default 'New'
    check (status in ('New', 'Read', 'Replied', 'Resolved')),
  submitted_at timestamptz not null default now()
);

-- ===========================================================================
-- PROMO CODES
-- ===========================================================================
-- Note: the Airtable version had a latent bug here - the admin create/edit
-- API wrote ValidFrom/ValidUntil, but the customer-facing validatePromoCode
-- checked a separate, never-written ExpiryDate field, so admin-set expiry
-- dates were silently ignored at checkout. Unified to valid_from/valid_until
-- here; lib/db.js's validatePromoCode checks both.
create table promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10, 2) not null,
  min_purchase numeric(10, 2) not null default 0,
  max_discount numeric(10, 2),
  valid_from timestamptz,
  valid_until timestamptz,
  description text,
  usage_count integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_promo_codes_code on promo_codes (code);

-- ===========================================================================
-- REFERRALS (influencer / ambassador program)
-- ===========================================================================
-- This table covers two distinct features that shared one Airtable table:
-- influencer/ambassador referral codes (referral_code + influencer_* +
-- totals), and simple customer "refer a friend" pairs (referrer_email /
-- referred_email, no code). A row belongs to one or the other, not both.
create table referrals (
  id uuid primary key default gen_random_uuid(),
  referral_code text unique,
  influencer_name text,
  influencer_email text,
  promo_code text,
  commission_rate numeric(5, 2) not null default 10,
  total_clicks integer not null default 0,
  total_conversions integer not null default 0,
  total_revenue numeric(10, 2) not null default 0,
  total_commission numeric(10, 2) not null default 0,
  is_active boolean not null default true,
  type text not null default 'Influencer' check (type in ('Influencer', 'Ambassador')),
  -- Customer refer-a-friend pair (no referral_code involved).
  referrer_email text,
  referred_email text,
  status text default 'Pending' check (status in ('Pending', 'Converted')),
  created_at timestamptz not null default now()
);

create index idx_referrals_referral_code on referrals (referral_code) where referral_code is not null;

-- ===========================================================================
-- INFLUENCER / AMBASSADOR APPLICATIONS
-- ===========================================================================
-- Separate "apply to join the program" forms, distinct from the referrals
-- table above (which tracks accepted/active codes). There's no existing
-- admin review flow for these in the app - applications just land here
-- for now.
create table influencer_applications (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  instagram text,
  follower_count text,
  niche text,
  message text,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  referral_code text unique,
  applied_date timestamptz not null default now(),
  total_clicks integer not null default 0,
  total_sales integer not null default 0,
  total_revenue numeric(10, 2) not null default 0,
  commission_earned numeric(10, 2) not null default 0,
  commission_rate numeric(5, 2) not null default 15
);

create table ambassador_applications (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  city text,
  university text,
  why_you text,
  experience text,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  referral_code text unique,
  applied_date timestamptz not null default now(),
  total_clicks integer not null default 0,
  total_sales integer not null default 0,
  total_revenue numeric(10, 2) not null default 0,
  commission_earned numeric(10, 2) not null default 0,
  commission_rate numeric(5, 2) not null default 10
);

-- ===========================================================================
-- BLOG POSTS
-- ===========================================================================
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text,
  excerpt text,
  featured_image jsonb,
  category text,
  tags text[] default '{}',
  author text,
  published_date date,
  status text not null default 'Draft' check (status in ('Draft', 'Published')),
  meta_description text,
  read_time integer,
  views integer not null default 0
);

create index idx_blog_posts_slug on blog_posts (slug);
create index idx_blog_posts_status_published on blog_posts (status, published_date desc) where status = 'Published';
create index idx_blog_posts_category on blog_posts (category);

-- ===========================================================================
-- HOMEPAGE BANNERS (three separate systems, as in the original Airtable base)
-- ===========================================================================
create table hero_banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  description text,
  cta_text text,
  cta_link text,
  image text,
  display_order integer not null default 0,
  active boolean not null default true
);

create table promo_banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  button_text text default 'Learn More',
  button_link text default '/shop',
  image text,
  image_alt text default 'Promotional Banner',
  height text default 'h-80 md:h-96',
  display_order integer not null default 0,
  active boolean not null default true
);

create table info_banners (
  id uuid primary key default gen_random_uuid(),
  message text,
  link text,
  link_text text,
  background_color text default 'bg-black',
  text_color text default 'text-white',
  dismissible boolean not null default false,
  storage_key text,
  priority integer not null default 0,
  active boolean not null default true
);

create index idx_hero_banners_active_order on hero_banners (display_order) where active = true;
create index idx_promo_banners_active_order on promo_banners (display_order) where active = true;
create index idx_info_banners_active_priority on info_banners (priority desc) where active = true;
