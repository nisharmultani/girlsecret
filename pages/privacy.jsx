export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="luxury-gradient py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="section-title text-center">Privacy Policy</h1>
          <p className="text-center text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              Welcome to GirlSecret. We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data and tell you about
              your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identity Data: name, username, date of birth</li>
              <li>Contact Data: email address, telephone numbers, billing and delivery addresses</li>
              <li>Transaction Data: details about payments and products purchased</li>
              <li>Technical Data: IP address, browser type, time zone setting</li>
              <li>Usage Data: information about how you use our website</li>
              <li>Marketing Data: your preferences in receiving marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. How We Use Your Data</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process and deliver your orders</li>
              <li>To manage your account and provide customer support</li>
              <li>To send you marketing communications (with your consent)</li>
              <li>To improve our website and services</li>
              <li>To detect and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p>
              We have implemented appropriate security measures to prevent your personal data from being
              accidentally lost, used, or accessed in an unauthorized way. We use SSL encryption for all
              data transmission and secure servers for data storage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Your Rights</h2>
            <p>Under data protection laws, you have rights including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The right to access your personal data</li>
              <li>The right to request correction of your personal data</li>
              <li>The right to request erasure of your personal data</li>
              <li>The right to object to processing of your personal data</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Cookies</h2>
            <p>
              We use cookies and similar technologies to improve your browsing experience. You can set your
              browser to refuse all cookies, but this may limit your ability to use certain features of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Third-Party Links</h2>
            <p>
              Our website may include links to third-party websites. We are not responsible for the privacy
              practices of these external sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <p className="mt-2">
              Email: privacy@girlsecret.com<br />
              Phone: +1 (555) 123-4567
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
        title: 'Privacy Policy',
        description: 'Read our privacy policy to learn how GirlSecret collects, uses, and protects your personal information.',
        path: '/privacy',
      },
    },
  };
}
