export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <div className="luxury-gradient py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="section-title text-center">Terms & Conditions</h1>
          <p className="text-center text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. About Us</h2>
            <p>
              Welcome to GirlSecret UK. These Terms and Conditions govern your use of our website and the
              purchase of products from us. By using our website and placing an order, you agree to be bound
              by these Terms and Conditions.
            </p>
            <p className="mt-4">
              <strong>Company Name:</strong> GirlSecret UK Ltd<br />
              <strong>Registered in:</strong> England and Wales<br />
              <strong>Website:</strong> www.girlsecretuk.com<br />
              <strong>Email:</strong> info@girlsecretuk.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Your Consumer Rights</h2>
            <p>
              As a UK consumer, you have statutory rights under the Consumer Rights Act 2015. These Terms
              and Conditions do not affect your statutory rights. Key consumer rights include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Right to return:</strong> You have 14 days from receipt to change your mind and return items</li>
              <li><strong>Right to refund:</strong> We will refund you within 14 days of receiving your return</li>
              <li><strong>Quality guarantee:</strong> Products must be of satisfactory quality, fit for purpose, and as described</li>
              <li><strong>Faulty goods:</strong> You can request repair, replacement, or refund for faulty products</li>
            </ul>
            <p className="mt-4">
              For more information about your consumer rights, visit{' '}
              <a href="https://www.citizensadvice.org.uk" className="text-rose-600 hover:text-rose-700">Citizens Advice</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Placing an Order</h2>
            <p>When you place an order through our website:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>You are making an offer to purchase products subject to these Terms and Conditions</li>
              <li>We will send you an order confirmation email acknowledging receipt of your order</li>
              <li>A contract is formed when we send you a dispatch confirmation email</li>
              <li>We reserve the right to refuse or cancel orders at our discretion</li>
              <li>All orders are subject to availability and acceptance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Pricing and Payment</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Currency:</strong> All prices are displayed in British Pounds Sterling (GBP £) and include VAT at the current rate</li>
              <li><strong>Price accuracy:</strong> We strive to ensure prices are correct, but errors may occur. If we discover an error, we will contact you</li>
              <li><strong>Price changes:</strong> Prices may change without notice, but changes will not affect confirmed orders</li>
              <li><strong>Payment methods:</strong> We accept major credit/debit cards, PayPal, Apple Pay, and Google Pay</li>
              <li><strong>Payment security:</strong> All payments are processed securely using industry-standard encryption</li>
              <li><strong>VAT:</strong> VAT is included in all prices. VAT invoices are available upon request</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Product Information</h2>
            <p>
              We take great care to ensure product descriptions, images, and specifications are accurate.
              However:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Colours may vary slightly due to screen settings and lighting in photographs</li>
              <li>Sizes may vary slightly between manufacturers and styles</li>
              <li>Product images may include accessories or styling items not included in the purchase</li>
              <li>We reserve the right to update product information without notice</li>
              <li>Always refer to product care labels for accurate material and care information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Delivery</h2>
            <p>
              Delivery terms are covered in detail in our Shipping Policy. Key points:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>We deliver throughout the UK and to selected international destinations</li>
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Risk of loss passes to you upon delivery</li>
              <li>Failed deliveries due to incorrect address information provided by you are your responsibility</li>
              <li>Delivery charges are as stated at checkout and are non-refundable except for faulty goods</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Returns and Refunds</h2>
            <p>
              <strong>14-Day Cooling Off Period:</strong> Under the Consumer Contracts Regulations 2013,
              you have the right to cancel your order within 14 days of receiving your items, for any reason.
            </p>
            <p className="mt-4">
              <strong>How to exercise your right to cancel:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Contact us at returns@girlsecretuk.com within 14 days of receipt</li>
              <li>Return items within 14 days of notifying us of your cancellation</li>
              <li>Items must be unworn, unwashed, with hygiene seals intact</li>
              <li>We will refund you within 14 days of receiving your return</li>
            </ul>
            <p className="mt-4">
              <strong>Exceptions:</strong> For hygiene reasons, intimate apparel cannot be returned if hygiene
              seals have been broken or removed. Full details in our Returns Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Faulty or Misdescribed Items</h2>
            <p>
              If you receive faulty, damaged, or misdescribed items, you have additional rights under the
              Consumer Rights Act 2015:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>First 30 days:</strong> You can reject items and receive a full refund</li>
              <li><strong>After 30 days:</strong> You can request repair or replacement</li>
              <li><strong>After one failed repair:</strong> You can request a refund or price reduction</li>
              <li>We will cover all costs associated with returning faulty items</li>
            </ul>
            <p className="mt-4">
              Contact us immediately at support@girlsecretuk.com if you receive faulty or incorrect items.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Use of Our Website</h2>
            <p>You agree to use our website only for lawful purposes. You must not:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Use the website in any way that breaches applicable laws or regulations</li>
              <li>Use the website in any way that causes damage or impairs its availability</li>
              <li>Use the website for fraudulent purposes or in connection with any criminal offence</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Transmit any harmful code, viruses, or malicious software</li>
              <li>Collect or harvest any information from the website without permission</li>
              <li>Use automated systems to access the website without our written consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Intellectual Property Rights</h2>
            <p>
              All content on this website, including but not limited to text, graphics, logos, images,
              photographs, audio, video, and software, is the property of GirlSecret UK Ltd or its content
              suppliers and is protected by UK and international copyright, trademark, and other intellectual
              property laws.
            </p>
            <p className="mt-4">
              You may not reproduce, distribute, modify, transmit, or use any content from this website
              for commercial purposes without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. Product Availability</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All products are subject to availability</li>
              <li>If ordered items are unavailable, we will notify you and offer alternatives or a refund</li>
              <li>We do not guarantee that products will remain in stock</li>
              <li>Product ranges and availability may change without notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">12. Limitation of Liability</h2>
            <p>
              Nothing in these Terms and Conditions excludes or limits our liability for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Death or personal injury caused by our negligence</li>
              <li>Fraud or fraudulent misrepresentation</li>
              <li>Any matter for which it would be illegal to exclude or limit liability</li>
            </ul>
            <p className="mt-4">
              Subject to the above, we shall not be liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Loss of profits, sales, business, or revenue</li>
              <li>Business interruption or loss of business opportunity</li>
              <li>Loss of anticipated savings or goodwill</li>
              <li>Any indirect or consequential losses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">13. Data Protection and Privacy</h2>
            <p>
              We are committed to protecting your personal data in accordance with the UK General Data
              Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
            <p className="mt-4">
              Please read our Privacy Policy to understand how we collect, use, and protect your personal
              information. By using our website, you consent to our use of your data as described in our
              Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">14. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites for your convenience. We do not control
              or endorse these websites and are not responsible for their content, privacy practices, or
              terms of use. Accessing third-party websites is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">15. Force Majeure</h2>
            <p>
              We shall not be liable for any failure to perform our obligations where such failure is due
              to circumstances beyond our reasonable control, including but not limited to acts of God,
              war, terrorism, pandemic, strikes, lockouts, or severe weather conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">16. Changes to These Terms</h2>
            <p>
              We may update these Terms and Conditions from time to time. Changes will be posted on this
              page with an updated revision date. Continued use of the website after changes constitutes
              acceptance of the modified terms. We recommend you review these terms regularly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">17. Severability</h2>
            <p>
              If any provision of these Terms and Conditions is found to be invalid or unenforceable by a
              court of law, the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">18. Governing Law and Jurisdiction</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of England
              and Wales. Any disputes arising from these terms or your use of our website shall be subject
              to the exclusive jurisdiction of the courts of England and Wales.
            </p>
            <p className="mt-4">
              If you are a consumer, you may also have the right to bring proceedings in the courts of the
              country where you live.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">19. Alternative Dispute Resolution</h2>
            <p>
              If you have a complaint, please contact us first at complaints@girlsecretuk.com and we will
              do our best to resolve the issue.
            </p>
            <p className="mt-4">
              You may also use the EU Online Dispute Resolution platform at{' '}
              <a href="https://ec.europa.eu/consumers/odr" className="text-rose-600 hover:text-rose-700">
                ec.europa.eu/consumers/odr
              </a>{' '}
              to resolve disputes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">20. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> legal@girlsecretuk.com<br />
              <strong>Customer Service:</strong> support@girlsecretuk.com<br />
              <strong>Phone:</strong> +44 (0) 20 1234 5678<br />
              <strong>Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM GMT
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
        title: 'Terms & Conditions',
        description: 'Read our terms and conditions to understand the rules and regulations for using GirlSecret UK website and purchasing our luxury intimate apparel.',
        path: '/terms',
      },
    },
  };
}
