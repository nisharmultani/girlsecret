export default function Shipping() {
  return (
    <div className="min-h-screen bg-white">
      <div className="luxury-gradient py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="section-title text-center">Shipping Policy</h1>
          <p className="text-center text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Shipping Methods & Costs</h2>
            <p>
              At GirlSecret, we offer flexible shipping options to meet your needs. We strive to get your
              luxury intimate apparel to you as quickly and safely as possible.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Standard Shipping:</strong> $10.00 (5-7 business days)</li>
              <li><strong>Express Shipping:</strong> $20.00 (2-3 business days)</li>
              <li><strong>Overnight Shipping:</strong> $35.00 (1 business day)</li>
              <li><strong>Free Standard Shipping:</strong> On orders over $50.00</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Processing Time</h2>
            <p>
              Orders are typically processed within 1-2 business days (Monday-Friday, excluding holidays).
              Orders placed after 2:00 PM EST will be processed the next business day.
            </p>
            <p className="mt-2">
              During peak seasons (holidays, special promotions), processing time may extend to 2-3 business days.
              You will receive an email confirmation when your order has been shipped with tracking information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Shipping Destinations</h2>
            <p>We currently ship to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Domestic (USA):</strong> All 50 states including Alaska, Hawaii, and US territories</li>
              <li><strong>International:</strong> Canada, UK, Australia, and select European countries</li>
            </ul>
            <p className="mt-4">
              <em>Note:</em> International orders may be subject to customs duties and import taxes, which are
              the responsibility of the customer. We are not responsible for delays caused by customs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Order Tracking</h2>
            <p>
              Once your order has shipped, you will receive a shipping confirmation email with a tracking number.
              You can track your package through the carrier&apos;s website:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>USPS: <a href="https://www.usps.com" className="text-rose-600 hover:text-rose-700">www.usps.com</a></li>
              <li>FedEx: <a href="https://www.fedex.com" className="text-rose-600 hover:text-rose-700">www.fedex.com</a></li>
              <li>UPS: <a href="https://www.ups.com" className="text-rose-600 hover:text-rose-700">www.ups.com</a></li>
            </ul>
            <p className="mt-4">
              Please allow up to 24 hours after receiving your shipping confirmation for tracking information
              to become available.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Discreet Packaging</h2>
            <p>
              We understand the personal nature of our products. All orders are shipped in plain, unmarked
              packaging with no indication of the contents or company name on the exterior. Your privacy
              is our priority.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Address Requirements</h2>
            <p>Please ensure your shipping address is complete and accurate:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>We ship to both residential and commercial addresses</li>
              <li>PO Boxes are accepted for Standard Shipping only</li>
              <li>APO/FPO addresses are supported</li>
              <li>Address corrections after shipment may incur additional fees</li>
            </ul>
            <p className="mt-4">
              We are not responsible for packages shipped to incorrect addresses provided by the customer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Delivery Issues</h2>
            <p><strong>Lost or Stolen Packages:</strong></p>
            <p className="mt-2">
              If your tracking shows the package was delivered but you did not receive it, please:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Check with neighbors or household members</li>
              <li>Check all possible delivery locations (front/back door, mailroom, etc.)</li>
              <li>Contact the carrier directly</li>
              <li>Contact us within 48 hours at support@girlsecret.com</li>
            </ul>
            <p className="mt-4"><strong>Damaged Packages:</strong></p>
            <p className="mt-2">
              If your package arrives damaged, please take photos of the packaging and damaged items, and
              contact us immediately at support@girlsecret.com. We will work with you to resolve the issue.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. International Shipping</h2>
            <p>
              International shipping times vary by destination (typically 7-21 business days). Additional
              information for international customers:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>International shipping costs are calculated at checkout based on destination</li>
              <li>Customers are responsible for all customs duties, taxes, and brokerage fees</li>
              <li>Delivery times are estimates and not guaranteed</li>
              <li>International orders cannot be expedited</li>
              <li>Some items may not be eligible for international shipping</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Order Changes & Cancellations</h2>
            <p>
              Once an order is placed, we begin processing immediately. If you need to cancel or modify
              your order, please contact us at support@girlsecret.com as soon as possible.
            </p>
            <p className="mt-2">
              We cannot guarantee changes or cancellations once the order has entered the shipping process.
              If your order has already shipped, you may return it following our Returns Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Holiday Shipping</h2>
            <p>
              During major holidays, we recommend ordering early to ensure timely delivery. Holiday shipping
              deadlines will be posted on our website. Please note that carriers do not operate on major
              holidays, which may affect delivery times.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p>
              If you have questions about shipping or need assistance with your order, please contact us:
            </p>
            <p className="mt-2">
              Email: support@girlsecret.com<br />
              Phone: +1 (555) 123-4567<br />
              Hours: Monday-Friday, 9:00 AM - 6:00 PM EST
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
        title: 'Shipping Policy',
        description: 'Learn about GirlSecret shipping methods, costs, delivery times, and international shipping options for luxury intimate apparel.',
        path: '/shipping',
      },
    },
  };
}
