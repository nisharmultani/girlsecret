-- Sample data for local/staging testing. Run this in the Supabase SQL
-- Editor after supabase/schema.sql. Safe to re-run: it deletes its own
-- rows first (matched by fixed IDs below) rather than accumulating dupes.
--
-- Test login created by this seed:
--   email:    test@girlsecret.co.uk
--   password: Password123
-- (the hash below is a real pbkdf2 hash for that password, generated with
-- the same lib/auth.js#hashPassword this app uses, so login actually works.)

delete from wishlists where user_id = '11111111-1111-1111-1111-111111111111';
delete from addresses where user_id = '11111111-1111-1111-1111-111111111111';
delete from order_items where order_id = '55555555-5555-5555-5555-555555555555';
delete from orders where id = '55555555-5555-5555-5555-555555555555';
delete from reviews where product_id in (
  '22222222-2222-2222-2222-222222222201',
  '22222222-2222-2222-2222-222222222202',
  '22222222-2222-2222-2222-222222222203',
  '22222222-2222-2222-2222-222222222204',
  '22222222-2222-2222-2222-222222222205',
  '22222222-2222-2222-2222-222222222206'
);
delete from products where id in (
  '22222222-2222-2222-2222-222222222201',
  '22222222-2222-2222-2222-222222222202',
  '22222222-2222-2222-2222-222222222203',
  '22222222-2222-2222-2222-222222222204',
  '22222222-2222-2222-2222-222222222205',
  '22222222-2222-2222-2222-222222222206'
);
delete from users where id = '11111111-1111-1111-1111-111111111111';
delete from promo_codes where code in ('WELCOME10', 'SUMMER20');
delete from referrals where referral_code = 'JANE10';
delete from blog_posts where slug in ('summer-essentials', 'care-guide');
delete from hero_banners where id in ('33333333-3333-3333-3333-333333333301', '33333333-3333-3333-3333-333333333302');
delete from promo_banners where id = '44444444-4444-4444-4444-444444444401';
delete from info_banners where id = '44444444-4444-4444-4444-444444444402';
delete from newsletter_subscribers where email = 'subscriber@example.com';
delete from contact_messages where email = 'curious@example.com';

-- === USERS ===
insert into users (id, email, password_hash, first_name, last_name, phone, active, email_verified) values
('11111111-1111-1111-1111-111111111111', 'test@girlsecret.co.uk',
 'cd59da6692244c2292cdbac6c9f9aea6:97390502e073f36b181b197bd1ee45bd9be9b5b0786eaaf9a4312d374ee7031f9235bae9724b9811ad1d23301a5179cc9c39e6e972b87524dd82f12e368cef33',
 'Jane', 'Doe', '+44 7700 900000', true, true);

insert into addresses (user_id, full_name, label, address_line1, city, postcode, country, phone, is_default) values
('11111111-1111-1111-1111-111111111111', 'Jane Doe', 'Home', '221B Baker Street', 'London', 'NW1 6XE', 'United Kingdom', '+44 7700 900000', true);

-- === PRODUCTS ===
insert into products (id, name, description, price, sale_price, category, slug, images, in_stock, featured, keywords, sizes, colors, sold_count, specifications) values
('22222222-2222-2222-2222-222222222201', 'Silk Slip Dress', 'A luxuriously soft silk slip dress, cut on the bias for an effortless drape.', 89.00, 69.00, 'Dresses', 'silk-slip-dress',
 '[{"url":"https://picsum.photos/seed/gs-dress1/800/800"},{"url":"https://picsum.photos/seed/gs-dress1b/800/800"}]'::jsonb,
 true, true, 'silk, slip dress, evening', array['XS','S','M','L'], array['Black','Champagne'], 42, '100% mulberry silk, dry clean only'),

('22222222-2222-2222-2222-222222222202', 'Lace Trim Cami Set', 'A matching cami and shorts set finished with delicate lace trim.', 45.00, null, 'Sets', 'lace-trim-cami-set',
 '[{"url":"https://picsum.photos/seed/gs-cami1/800/800"}]'::jsonb,
 true, true, 'lace, cami, loungewear', array['S','M','L'], array['Ivory','Blush'], 27, '95% cotton, 5% elastane'),

('22222222-2222-2222-2222-222222222203', 'Satin Robe', 'Floor-length satin robe with a self-tie waist belt.', 65.00, null, 'Loungewear', 'satin-robe',
 '[{"url":"https://picsum.photos/seed/gs-robe1/800/800"}]'::jsonb,
 true, false, 'satin, robe, loungewear', array['One Size'], array['Rose Gold','Navy'], 15, '100% polyester satin'),

('22222222-2222-2222-2222-222222222204', 'Ribbed Bralette', 'Soft ribbed bralette with adjustable straps and no underwire.', 25.00, 19.00, 'Lingerie', 'ribbed-bralette',
 '[{"url":"https://picsum.photos/seed/gs-bra1/800/800"}]'::jsonb,
 true, true, 'bralette, ribbed, everyday', array['XS','S','M','L','XL'], array['Black','Nude','White'], 88, '92% nylon, 8% elastane'),

('22222222-2222-2222-2222-222222222205', 'High-Waist Lace Briefs', 'High-waisted briefs in stretch lace for full coverage.', 18.00, null, 'Lingerie', 'high-waist-lace-briefs',
 '[{"url":"https://picsum.photos/seed/gs-briefs1/800/800"}]'::jsonb,
 true, false, 'briefs, lace, high-waist', array['S','M','L','XL'], array['Black','Ivory'], 61, '85% nylon, 15% spandex'),

('22222222-2222-2222-2222-222222222206', 'Velvet Kimono', 'Statement velvet kimono with tassel tie belt.', 75.00, null, 'Loungewear', 'velvet-kimono',
 '[{"url":"https://picsum.photos/seed/gs-kimono1/800/800"}]'::jsonb,
 false, false, 'velvet, kimono, robe', array['One Size'], array['Emerald','Burgundy'], 9, '100% velvet polyester');

-- === REVIEWS ===
insert into reviews (product_id, name, email, rating, comment, approved) values
('22222222-2222-2222-2222-222222222201', 'Amelia H.', 'amelia@example.com', 5, 'Gorgeous drape and true to size - wear it as both loungewear and out for dinner.', true),
('22222222-2222-2222-2222-222222222201', 'Priya S.', 'priya@example.com', 4, 'Lovely fabric, runs slightly small so size up.', true),
('22222222-2222-2222-2222-222222222202', 'Grace L.', 'grace@example.com', 5, 'Softer than expected and the lace holds up after washing.', true),
('22222222-2222-2222-2222-222222222204', 'Nina K.', 'nina@example.com', 5, 'My new everyday bra, so comfortable.', true),
('22222222-2222-2222-2222-222222222204', 'Sophie T.', 'sophie@example.com', 3, 'Good but straps stretch out after a few months.', true);

-- === PROMO CODES ===
insert into promo_codes (code, discount_type, discount_value, min_purchase, max_discount, active, description) values
('WELCOME10', 'percentage', 10, 0, 20, true, '10% off for new customers'),
('SUMMER20', 'fixed', 20, 75, null, true, '£20 off orders over £75');

-- === REFERRALS (influencer) ===
insert into referrals (referral_code, influencer_name, influencer_email, promo_code, commission_rate, is_active, type) values
('JANE10', 'Jane Influencer', 'jane.influencer@example.com', 'WELCOME10', 12, true, 'Influencer');

-- === SAMPLE ORDER (for the test user, so account/orders has something to show) ===
insert into orders (id, order_number, user_id, customer_name, customer_email, subtotal, shipping_cost, discount, total, status, shipping_address, billing_address) values
('55555555-5555-5555-5555-555555555555', 'ORD-SEED-0001', '11111111-1111-1111-1111-111111111111', 'Jane Doe', 'test@girlsecret.co.uk',
 89.00, 4.95, 0, 93.95, 'Delivered',
 '{"fullName":"Jane Doe","addressLine1":"221B Baker Street","city":"London","postcode":"NW1 6XE","country":"United Kingdom","phone":"+44 7700 900000"}'::jsonb,
 '{"fullName":"Jane Doe","addressLine1":"221B Baker Street","city":"London","postcode":"NW1 6XE","country":"United Kingdom"}'::jsonb);

insert into order_items (order_id, product_id, product_name, product_slug, image, quantity, unit_price) values
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222201', 'Silk Slip Dress', 'silk-slip-dress', 'https://picsum.photos/seed/gs-dress1/800/800', 1, 89.00);

-- === WISHLIST ===
insert into wishlists (user_id, product_id) values
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222203');

-- === BLOG POSTS ===
insert into blog_posts (title, slug, content, excerpt, category, tags, author, published_date, status, read_time) values
('Summer Essentials', 'summer-essentials', 'Full article content about summer essentials goes here.', 'Our edit of the pieces you need for warm-weather nights in.', 'Lifestyle', array['summer','edit'], 'GirlSecret Team', current_date, 'Published', 4),
('Silk Care Guide', 'care-guide', 'Full article content about caring for silk garments goes here.', 'How to keep your silk pieces looking new for years.', 'Guides', array['care','silk'], 'GirlSecret Team', current_date - 7, 'Published', 3);

-- === HOMEPAGE BANNERS ===
insert into hero_banners (id, title, subtitle, description, cta_text, cta_link, image, display_order, active) values
('33333333-3333-3333-3333-333333333301', 'New In: Silk Edit', 'Effortless luxury', 'Discover our new silk collection.', 'Shop Now', '/shop?category=Dresses', 'https://picsum.photos/seed/gs-hero1/1600/900', 1, true),
('33333333-3333-3333-3333-333333333302', 'Loungewear Essentials', 'Comfort meets style', 'Soft, everyday pieces for staying in.', 'Shop Loungewear', '/shop?category=Loungewear', 'https://picsum.photos/seed/gs-hero2/1600/900', 2, true);

insert into promo_banners (id, title, subtitle, button_text, button_link, image, display_order, active) values
('44444444-4444-4444-4444-444444444401', 'Summer Sale', 'Up to 30% off selected lines', 'Shop Sale', '/shop', 'https://picsum.photos/seed/gs-promo1/1600/700', 1, true);

insert into info_banners (id, message, link, link_text, dismissible, priority, active) values
('44444444-4444-4444-4444-444444444402', 'Free UK shipping on orders over £50', '/shop', 'Shop Now', true, 10, true);

-- === NEWSLETTER + CONTACT (for admin views) ===
insert into newsletter_subscribers (email, first_name, source, is_active) values
('subscriber@example.com', 'Alex', 'website', true);

insert into contact_messages (name, email, subject, message, status) values
('Curious Customer', 'curious@example.com', 'Sizing question', 'Does the silk slip dress run true to size?', 'New');
