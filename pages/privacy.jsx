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
              Welcome to GirlSecret UK. We respect your privacy and are committed to protecting your personal
              data. This privacy policy explains how we collect, use, store, and protect your information in
              accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
            <p className="mt-4">
              <strong>Data Controller:</strong> GirlSecret UK Ltd<br />
              <strong>Registered in:</strong> England and Wales<br />
              <strong>Email:</strong> privacy@girlsecretuk.com<br />
              <strong>Data Protection Officer:</strong> dpo@girlsecretuk.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <p>
              We collect and process the following categories of personal data about you:
            </p>
            <p className="mt-4"><strong>Identity Data:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>First name and last name</li>
              <li>Username or similar identifier</li>
              <li>Title</li>
              <li>Date of birth (if provided)</li>
            </ul>
            <p className="mt-4"><strong>Contact Data:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Email address</li>
              <li>Telephone numbers</li>
              <li>Billing and delivery addresses</li>
            </ul>
            <p className="mt-4"><strong>Financial Data:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Payment card details (processed securely by our payment providers)</li>
              <li>Bank account details (if provided for refunds)</li>
            </ul>
            <p className="mt-4"><strong>Transaction Data:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Details about payments to and from you</li>
              <li>Products and services you have purchased</li>
              <li>Order history</li>
            </ul>
            <p className="mt-4"><strong>Technical Data:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type</li>
              <li>Operating system</li>
              <li>Time zone setting and location</li>
              <li>Cookie data</li>
            </ul>
            <p className="mt-4"><strong>Usage Data:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Information about how you use our website</li>
              <li>Pages viewed and time spent on pages</li>
              <li>Products viewed</li>
              <li>Search queries</li>
            </ul>
            <p className="mt-4"><strong>Marketing and Communications Data:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Your preferences for receiving marketing from us</li>
              <li>Your communication preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. How We Collect Your Data</h2>
            <p>We collect personal data through:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Direct interactions:</strong> When you create an account, place an order, subscribe to our newsletter, contact us, or complete forms on our website</li>
              <li><strong>Automated technologies:</strong> As you interact with our website, we automatically collect Technical and Usage Data through cookies and similar technologies</li>
              <li><strong>Third parties:</strong> We may receive data from analytics providers (such as Google Analytics), advertising networks, and payment processors</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your
              personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>To process and deliver your orders:</strong> Including managing payments, fees, and charges, and collecting money owed to us</li>
              <li><strong>To manage our relationship with you:</strong> Including notifying you about changes to our terms or privacy policy, and asking you to leave a review or take a survey</li>
              <li><strong>To provide customer service:</strong> Responding to your queries, complaints, and requests</li>
              <li><strong>To send you marketing communications:</strong> About products and services we think may interest you (only where you have consented or we have a legitimate interest)</li>
              <li><strong>To improve our website and services:</strong> Using data analytics to improve our website, products, services, marketing, and customer experience</li>
              <li><strong>To protect our business:</strong> Fraud prevention, security monitoring, and compliance with legal obligations</li>
              <li><strong>To personalize your experience:</strong> Showing you content and recommendations based on your preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Legal Basis for Processing</h2>
            <p>
              Under UK GDPR, we must have a lawful basis for processing your personal data. We rely on the
              following legal bases:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Contract performance:</strong> Processing necessary to fulfill our contract with you (e.g., processing orders)</li>
              <li><strong>Legitimate interests:</strong> Processing necessary for our legitimate business interests (e.g., improving our services, fraud prevention)</li>
              <li><strong>Consent:</strong> Where you have given clear consent for us to process your data for a specific purpose (e.g., marketing emails)</li>
              <li><strong>Legal obligation:</strong> Processing necessary to comply with the law (e.g., tax and accounting requirements)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Marketing Communications</h2>
            <p>
              We may send you marketing communications about our products and services if:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>You have created an account or made a purchase and have not opted out</li>
              <li>You have subscribed to our newsletter</li>
              <li>You have consented to receive marketing communications</li>
            </ul>
            <p className="mt-4">
              <strong>Your right to opt-out:</strong> You can unsubscribe from marketing communications at any time by:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Clicking the &quot;unsubscribe&quot; link in any marketing email</li>
              <li>Contacting us at unsubscribe@girlsecretuk.com</li>
              <li>Updating your preferences in your account settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
            <p>
              Our website uses cookies and similar tracking technologies to enhance your browsing experience.
              Cookies are small text files stored on your device.
            </p>
            <p className="mt-4"><strong>Types of cookies we use:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Essential cookies:</strong> Necessary for the website to function (e.g., shopping cart)</li>
              <li><strong>Performance cookies:</strong> Collect anonymous data about how visitors use our site (e.g., Google Analytics)</li>
              <li><strong>Functionality cookies:</strong> Remember your preferences and choices</li>
              <li><strong>Marketing cookies:</strong> Track your online activity to show you relevant ads</li>
            </ul>
            <p className="mt-4">
              <strong>Managing cookies:</strong> You can set your browser to refuse cookies or alert you when
              cookies are being sent. However, some parts of our website may not function properly without cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Sharing Your Data</h2>
            <p>
              We may share your personal data with third parties in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Service providers:</strong> Delivery companies, payment processors, email service providers, and website hosting companies who help us operate our business</li>
              <li><strong>Analytics providers:</strong> Such as Google Analytics to help us understand website usage</li>
              <li><strong>Marketing partners:</strong> With your consent, for targeted advertising</li>
              <li><strong>Legal requirements:</strong> When required by law, court order, or to protect our legal rights</li>
              <li><strong>Business transfers:</strong> In the event of a sale, merger, or acquisition of our business</li>
            </ul>
            <p className="mt-4">
              We require all third parties to respect the security of your personal data and to treat it in
              accordance with the law. We only permit them to process your data for specified purposes and in
              accordance with our instructions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. International Transfers</h2>
            <p>
              Your personal data may be transferred to and processed in countries outside the UK. When we transfer
              your data internationally, we ensure appropriate safeguards are in place, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Standard Contractual Clauses approved by the UK Information Commissioner&apos;s Office (ICO)</li>
              <li>Adequacy decisions recognizing countries with adequate data protection laws</li>
              <li>Binding Corporate Rules for transfers within multinational companies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Data Security</h2>
            <p>
              We have implemented appropriate security measures to prevent your personal data from being
              accidentally lost, used, accessed, altered, or disclosed in an unauthorized way. These include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>SSL/TLS encryption for all data transmission</li>
              <li>Secure servers with firewall protection</li>
              <li>Access controls limiting who can access your data</li>
              <li>Regular security assessments and updates</li>
              <li>Staff training on data protection</li>
            </ul>
            <p className="mt-4">
              <strong>Payment security:</strong> We do not store your complete payment card details. All payment
              transactions are processed securely by PCI-DSS compliant payment providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as necessary to fulfill the purposes for which
              it was collected, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Account data:</strong> Retained while your account is active, plus 2 years after closure (for legal and accounting purposes)</li>
              <li><strong>Transaction data:</strong> Retained for 7 years (to comply with tax and accounting laws)</li>
              <li><strong>Marketing data:</strong> Until you unsubscribe or request deletion</li>
              <li><strong>Technical data:</strong> Typically retained for 2 years</li>
            </ul>
            <p className="mt-4">
              When we no longer need your data, we will securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">12. Your Legal Rights</h2>
            <p>
              Under the UK GDPR and Data Protection Act 2018, you have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Right to access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to rectification:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Right to erasure:</strong> Request deletion of your personal data (&quot;right to be forgotten&quot;)</li>
              <li><strong>Right to restrict processing:</strong> Request that we limit how we use your data</li>
              <li><strong>Right to data portability:</strong> Receive your data in a portable format to transfer to another provider</li>
              <li><strong>Right to object:</strong> Object to processing based on legitimate interests or direct marketing</li>
              <li><strong>Right to withdraw consent:</strong> Withdraw consent for processing at any time (where consent is the legal basis)</li>
              <li><strong>Right to complain:</strong> Lodge a complaint with the Information Commissioner&apos;s Office (ICO)</li>
            </ul>
            <p className="mt-4">
              <strong>How to exercise your rights:</strong> Contact us at privacy@girlsecretuk.com. We will
              respond to your request within one month.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">13. Children&apos;s Privacy</h2>
            <p>
              Our website is not intended for children under the age of 16. We do not knowingly collect personal
              data from children under 16. If you are a parent or guardian and believe your child has provided
              us with personal data, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">14. Third-Party Websites</h2>
            <p>
              Our website may contain links to third-party websites, plug-ins, and applications. Clicking on
              those links may allow third parties to collect or share data about you. We do not control these
              third-party websites and are not responsible for their privacy practices. Please review their
              privacy policies before providing them with any information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">15. Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time to reflect changes in our practices or for
              legal, operational, or regulatory reasons. The updated policy will be posted on this page with a
              new &quot;Last updated&quot; date.
            </p>
            <p className="mt-4">
              We encourage you to review this privacy policy periodically. If we make significant changes, we
              will notify you by email or through a prominent notice on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">16. Contact Us & Complaints</h2>
            <p>
              If you have any questions about this privacy policy or how we handle your personal data, please
              contact us:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> privacy@girlsecretuk.com<br />
              <strong>Data Protection Officer:</strong> dpo@girlsecretuk.com<br />
              <strong>Phone:</strong> +44 (0) 20 1234 5678<br />
              <strong>Post:</strong> GirlSecret UK Ltd, Data Protection Enquiries, [Full Address to be provided]
            </p>
            <p className="mt-4">
              <strong>Right to complain to ICO:</strong> If you are unhappy with how we have handled your data,
              you have the right to complain to the Information Commissioner&apos;s Office (ICO):
            </p>
            <p className="mt-2">
              Information Commissioner&apos;s Office<br />
              Wycliffe House<br />
              Water Lane<br />
              Wilmslow<br />
              Cheshire<br />
              SK9 5AF<br />
              <br />
              Phone: 0303 123 1113<br />
              Website:{' '}
              <a href="https://ico.org.uk" className="text-rose-600 hover:text-rose-700">
                ico.org.uk
              </a>
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
        description: 'Read our privacy policy to learn how GirlSecret UK collects, uses, and protects your personal information in compliance with UK GDPR.',
        path: '/privacy',
      },
    },
  };
}
