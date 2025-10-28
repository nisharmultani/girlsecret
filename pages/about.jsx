import Image from 'next/image';
import { SparklesIcon, HeartIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="luxury-gradient py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="section-title">About GirlSecret</h1>
            <p className="section-subtitle max-w-3xl mx-auto">
              Your destination for luxury beauty and lifestyle products that celebrate individuality
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
                  GirlSecret was founded with a simple yet powerful vision: to provide women with access to
                  premium beauty and lifestyle products that enhance their natural beauty and boost their confidence.
                </p>
                <p>
                  We believe that every woman deserves to feel special, and that's why we carefully curate
                  each product in our collection. From luxurious skincare to elegant accessories, every item
                  is chosen with love and attention to detail.
                </p>
                <p>
                  Our commitment to quality, authenticity, and customer satisfaction has made us a trusted
                  name in the beauty industry. We're not just selling products; we're building a community
                  of confident, beautiful women who embrace their uniqueness.
                </p>
              </div>
            </div>

            <div className="relative h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800"
                alt="About GirlSecret"
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-luxury-100 mb-4">
                <SparklesIcon className="w-8 h-8 text-luxury-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product is carefully selected and tested
                to meet our high standards.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-luxury-100 mb-4">
                <HeartIcon className="w-8 h-8 text-luxury-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Love</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're committed to providing exceptional
                service and support.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-luxury-100 mb-4">
                <GlobeAltIcon className="w-8 h-8 text-luxury-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
              <p className="text-gray-600">
                We care about the planet and work with brands that share our commitment
                to sustainability.
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
        description: 'Learn about GirlSecret, our story, values, and the team behind our luxury beauty brand.',
        keywords: 'about girlsecret, our story, beauty brand, luxury cosmetics company',
        path: '/about',
      },
    },
  };
}
