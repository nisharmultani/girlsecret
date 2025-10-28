import Image from 'next/image';
import { SparklesIcon, HeartIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="intimate-gradient py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="section-title">About GirlSecret</h1>
            <p className="section-subtitle max-w-3xl mx-auto">
              Beautiful intimate apparel designed for comfort, confidence, and celebrating your unique beauty
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  GirlSecret was founded with a simple yet powerful vision: to help every woman feel beautiful
                  and confident in her own skin, starting with the intimates she wears every day.
                </p>
                <p>
                  We believe that comfort and beauty should never be compromised. That&apos;s why we carefully design
                  and curate each piece in our collection—from supportive everyday bras to delicate lace lingerie.
                  Every item features soft fabrics, thoughtful construction, and styles that celebrate your body.
                </p>
                <p>
                  Our commitment to the perfect fit, premium quality, and your privacy has made us a trusted
                  destination for intimate apparel. We&apos;re not just selling underwear; we&apos;re empowering women
                  to feel confident and beautiful from the inside out.
                </p>
              </div>
            </div>

            <div className="relative h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
                alt="Beautiful Intimate Apparel"
                fill
                className="object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                <SparklesIcon className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Perfect Fit</h3>
              <p className="text-gray-600">
                We offer comprehensive size guides, fit assistance, and easy exchanges to ensure
                you find your perfect fit every time.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                <HeartIcon className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy & Discretion</h3>
              <p className="text-gray-600">
                All orders ship in discreet, unmarked packaging. Your privacy and comfort
                are our top priorities.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                <GlobeAltIcon className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Soft fabrics, delicate lace, and exceptional craftsmanship in every piece.
                Quality you can feel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              The passionate people behind GirlSecret
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={`https://images.unsplash.com/photo-${1580489944761 + i}-87df1b04c3ea?w=400`}
                    alt={`Team member ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Team Member {i}</h3>
                <p className="text-gray-600">Position Title</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      seo: {
        title: 'About Us',
        description: 'Learn about GirlSecret, our story, values, and our mission to provide beautiful, comfortable intimate apparel.',
        keywords: 'about girlsecret, our story, intimate apparel brand, lingerie company, bra company',
        path: '/about',
      },
    },
  };
}
