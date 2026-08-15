import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getProductBySlug } from '../../lib/db';
import { addToCart } from '../../lib/cart';
import { formatPrice } from '../../utils/format';
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  FireIcon,
  HandRaisedIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const SLUG = 'body-clothing-tape';

const HOW_TO_STEPS = [
  { title: 'Clean', detail: 'Clean skin and fabric thoroughly.' },
  { title: 'Peel', detail: 'Peel a strip from the backing paper.' },
  { title: 'Apply', detail: 'Apply to skin, press gently for 5 seconds.' },
  { title: 'Attach', detail: 'Attach to clothing, press for 10 seconds.' },
  { title: 'Remove', detail: 'Remove slowly at the end of the day.' },
];

const FEATURES = [
  { icon: ShieldCheckIcon, label: 'Invisible Hold' },
  { icon: HandRaisedIcon, label: 'Skin Safe' },
  { icon: SparklesIcon, label: 'No Residue' },
  { icon: FireIcon, label: 'Sweat Resistant' },
];

const SPECS = [
  ['Quantity', '72 Pre-cut Strips'],
  ['Material', 'Medical-grade Adhesive'],
  ['Type', 'Double-sided Tape'],
  ['Skin Type', 'Hypoallergenic & Latex-free'],
  ['Hold', 'Holds All Day'],
  ['Compatibility', 'Works on all fabrics'],
];

const SAFETY_NOTES = [
  'For external use only',
  'Test on a small area first',
  'Not for sensitive skin',
  'Keep away from children',
  'Store in a cool, dry place',
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export async function getStaticProps() {
  const product = await getProductBySlug(SLUG);

  return {
    props: {
      product: product || null,
      seo: {
        title: product ? product.name : 'Body & Clothing Tape',
        description: 'GirlSecret Body & Clothing Tape keeps your outfits in place with confidence. Discreet, skin-friendly, double-sided fashion tape that works with any outfit.',
        path: `/products/${SLUG}`,
        image: product?.images?.[0]?.url,
      },
    },
    revalidate: 60,
  };
}

export default function BodyClothingTapePage({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [email, setEmail] = useState('');
  const [notifySubmitting, setNotifySubmitting] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 640);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    addToCart(product, quantity);
    toast.success('Added to your bag ✨');
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleNotifyMe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setNotifySubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'body-clothing-tape-waitlist' }),
      });
      if (res.ok) {
        setNotifySuccess(true);
        setEmail('');
      } else {
        toast.error('Something went wrong - try again in a moment.');
      }
    } catch {
      toast.error('Something went wrong - try again in a moment.');
    } finally {
      setNotifySubmitting(false);
    }
  };

  const images = product?.images || [];
  const heroImage = images[0]?.url;
  const hasDiscount = product?.salePrice && product.salePrice < product.price;

  // Product not created in the database yet - waitlist page instead of a crash.
  if (!product) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-black text-white px-6">
        <div className="max-w-lg text-center">
          <p className="uppercase tracking-[0.3em] text-rose-300 text-xs mb-4">GirlSecret London</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Body &amp; Clothing Tape</h1>
          <p className="text-white/70 mb-8">
            This product isn&apos;t live yet. Once it&apos;s added in the admin panel with the
            slug <code className="text-rose-300">{SLUG}</code>, this page will automatically show
            it in full.
          </p>
          {!notifySuccess ? (
            <form onSubmit={handleNotifyMe} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 rounded-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-rose-300"
              />
              <button
                type="submit"
                disabled={notifySubmitting}
                className="rounded-full px-6 py-3 bg-rose-300 text-black font-medium hover:bg-rose-200 transition disabled:opacity-50"
              >
                Notify me
              </button>
            </form>
          ) : (
            <p className="text-rose-300">You&apos;re on the list - we&apos;ll let you know.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="theme-color" content="#1a0e12" />
      </Head>

      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-b from-[#150a0d] via-[#1f1015] to-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,#c9748d_0%,transparent_45%),radial-gradient(circle_at_80%_70%,#7a2b3a_0%,transparent_45%)]" />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p variants={fadeUp} className="uppercase tracking-[0.35em] text-rose-300 text-xs mb-5">
              GirlSecret London
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl leading-[1.05] mb-4">
              Confidence That<br />Stays Invisible
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/70 text-lg mb-8 max-w-md">
              Double-sided fashion tape for all-day hold - discreet, skin-friendly,
              and ready for any outfit.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
              {FEATURES.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide bg-white/10 border border-white/15 rounded-full px-3 py-1.5"
                >
                  <Icon className="w-4 h-4 text-rose-300" />
                  {label}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-semibold">{formatPrice(hasDiscount ? product.salePrice : product.price)}</span>
              {hasDiscount && (
                <span className="text-white/40 line-through text-lg">{formatPrice(product.price)}</span>
              )}
              <span className="text-white/50 text-sm">· 72 pre-cut strips</span>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <div className="flex items-center border border-white/20 rounded-full">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:text-rose-300 transition"
                  aria-label="Decrease quantity"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 hover:text-rose-300 transition"
                  aria-label="Increase quantity"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAddToCart}
                disabled={isAdding || !product.inStock}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-300 text-black font-medium rounded-full px-8 py-3.5 hover:bg-rose-200 transition disabled:opacity-50"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {product.inStock ? (isAdding ? 'Added!' : 'Add to Bag') : 'Out of Stock'}
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative aspect-square"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full h-full"
            >
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
                  Add product photos in /admin/products
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== HOW TO USE ===== */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="uppercase tracking-[0.3em] text-rose-500 text-xs mb-3">How To Use</p>
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900">Five steps to all-day hold</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 relative"
          >
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-gray-200" />
            {HOW_TO_STEPS.map((step, i) => (
              <motion.div key={step.title} variants={fadeUp} className="relative text-center">
                <div className="relative z-10 w-12 h-12 mx-auto rounded-full bg-black text-white flex items-center justify-center font-serif text-lg mb-4">
                  {i + 1}
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="bg-[#faf6f7] py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={stagger}
            className="grid sm:grid-cols-2 gap-x-8 gap-y-12"
          >
            {[
              { icon: ShieldCheckIcon, title: 'Strong & Reliable Hold', body: 'Medical-grade adhesive keeps outfits exactly where you put them, all day long.' },
              { icon: HandRaisedIcon, title: 'Skin Friendly', body: 'Hypoallergenic and latex-free, formulated to be gentle even with repeated use.' },
              { icon: SparklesIcon, title: 'Easy Peel, No Residue', body: 'Removes cleanly at the end of the day - no sticky marks left behind.' },
              { icon: FireIcon, title: 'Sweat Resistant', body: 'Built to hold through warm rooms, long events, and everything in between.' },
            ].map(({ icon: Icon, title, body }) => (
              <motion.div key={title} variants={fadeUp} className="flex gap-4">
                <div className="shrink-0 w-11 h-11 rounded-full bg-black text-white flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500">{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      {images.length > 1 && (
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeUp}
              className="font-serif text-3xl md:text-4xl text-gray-900 text-center mb-12"
            >
              A closer look
            </motion.h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="grid sm:grid-cols-2 gap-6"
            >
              {images.slice(0, 4).map((img, i) => (
                <motion.div
                  key={img.url || i}
                  variants={fadeUp}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
                >
                  <Image
                    src={img.url}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 90vw, 45vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ===== SPECS + SAFETY ===== */}
      <section className="bg-black text-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <p className="uppercase tracking-[0.3em] text-rose-300 text-xs mb-3">Product Details</p>
            <h2 className="font-serif text-2xl md:text-3xl mb-8">What&apos;s inside</h2>
            <dl className="space-y-4">
              {SPECS.map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-white/10 pb-3">
                  <dt className="text-white/50">{label}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <p className="uppercase tracking-[0.3em] text-rose-300 text-xs mb-3">Good To Know</p>
            <h2 className="font-serif text-2xl md:text-3xl mb-8">Safety information</h2>
            <ul className="space-y-3">
              {SAFETY_NOTES.map((note) => (
                <li key={note} className="flex items-start gap-3 text-white/70">
                  <ExclamationTriangleIcon className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
                  {note}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative bg-gradient-to-b from-black to-[#1f1015] text-white py-24 text-center overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="relative max-w-xl mx-auto px-6"
        >
          <CheckBadgeIcon className="w-10 h-10 text-rose-300 mx-auto mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Confidence That Stays Invisible</h2>
          <p className="text-white/60 mb-8">72 pre-cut strips. All-day hold. No residue.</p>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !product.inStock}
            className="inline-flex items-center gap-2 bg-rose-300 text-black font-medium rounded-full px-10 py-4 hover:bg-rose-200 transition disabled:opacity-50"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            {product.inStock ? `Add to Bag - ${formatPrice(hasDiscount ? product.salePrice : product.price)}` : 'Out of Stock'}
          </button>
        </motion.div>
      </section>

      {/* ===== STICKY MOBILE/SCROLL BAR ===== */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
              {heroImage && (
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                  <Image src={heroImage} alt={product.name} fill sizes="44px" className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-sm text-gray-500">{formatPrice(hasDiscount ? product.salePrice : product.price)}</p>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAdding || !product.inStock}
                className="inline-flex items-center gap-2 bg-black text-white font-medium rounded-full px-6 py-2.5 hover:bg-gray-800 transition disabled:opacity-50 shrink-0"
              >
                <ShoppingBagIcon className="w-4 h-4" />
                {product.inStock ? 'Add to Bag' : 'Out of Stock'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
