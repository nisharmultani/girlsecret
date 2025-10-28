export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <div className="luxury-gradient py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="section-title text-center">Terms of Service</h1>
          <p className="text-center text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing and using GirlSecret&apos;s website, you agree to be bound by these Terms of Service.
              If you do not agree with any part of these terms, you may not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Use of Our Service</h2>
            <p>You agree to use our website only for lawful purposes and in a way that does not infringe the rights of others. You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the website in any way that causes damage to the website or impairs its availability</li>
              <li>Use the website for fraudulent purposes</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Transmit any harmful code or viruses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Product Information</h2>
            <p>
              We strive to provide accurate product descriptions and images. However, we do not warrant that
              product descriptions or other content is accurate, complete, or error-free. Colors may vary
              depending on your monitor settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Pricing and Payment</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are in USD and subject to change without notice</li>
              <li>We reserve the right to refuse or cancel any order</li>
              <li>Payment must be received before we dispatch your order</li>
              <li>We accept all major credit cards and PayPal</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Shipping and Delivery</h2>
            <p>
              We aim to process orders within 1-2 business days. Delivery times vary by location and shipping
              method selected. We are not responsible for delays caused by shipping carriers or customs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Returns and Refunds</h2>
            <p>
              We offer a 30-day return policy on most items. Products must be returned in their original
              condition and packaging. Refunds will be processed within 5-7 business days of receiving
              the returned item. Please see our Returns Policy for more details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software, is the
              property of GirlSecret and is protected by copyright and trademark laws. You may not
              reproduce, distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, GirlSecret shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of our website or products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States,
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately
              upon posting to the website. Your continued use of the website constitutes acceptance of the
              modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-2">
              Email: legal@girlsecret.com<br />
              Phone: +1 (555) 123-4567<br />
              Address: 123 Beauty Lane, Suite 456, New York, NY 10001
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      seo: {
        title: 'Terms of Service',
        description: 'Read our terms of service to understand the rules and regulations for using GirlSecret website and services.',
        path: '/terms',
      },
    },
  };
}
