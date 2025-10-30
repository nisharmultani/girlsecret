export default function Returns() {
  return (
    <div className="min-h-screen bg-white">
      <div className="luxury-gradient py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="section-title text-center">Return Policy</h1>
          <p className="text-center text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Our Return Promise</h2>
            <p>
              At GirlSecret, your satisfaction is our priority. We want you to love your purchase, but if
              you&apos;re not completely satisfied, we&apos;ll make it right. We offer a 30-day return policy on
              eligible items.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Return Eligibility</h2>
            <p>To be eligible for a return, items must meet the following conditions:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Returned within 30 days of delivery date</li>
              <li>Unworn, unwashed, and in original condition</li>
              <li>All original tags and hygiene liners must be attached and intact</li>
              <li>Returned in original packaging when possible</li>
              <li>Accompanied by proof of purchase (order confirmation or receipt)</li>
            </ul>
            <p className="mt-4">
              <strong>Important:</strong> For health and hygiene reasons, intimate apparel must have all
              protective hygiene liners intact and undamaged. Items without intact hygiene liners cannot
              be accepted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Non-Returnable Items</h2>
            <p>The following items cannot be returned or exchanged:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Items marked as &quot;Final Sale&quot; or purchased during clearance events</li>
              <li>Items with removed, damaged, or missing hygiene liners</li>
              <li>Worn, washed, or altered items</li>
              <li>Items without original tags</li>
              <li>Gift cards and promotional items</li>
              <li>Items damaged due to misuse or normal wear</li>
              <li>Customized or personalized items</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. How to Initiate a Return</h2>
            <p>Starting a return is easy:</p>
            <ol className="list-decimal pl-6 space-y-2 mt-4">
              <li>
                <strong>Contact Us:</strong> Email support@girlsecret.com with your order number and reason
                for return. You&apos;ll receive a Return Authorization (RA) number within 1-2 business days.
              </li>
              <li>
                <strong>Package Your Items:</strong> Securely pack the items in their original packaging
                when possible. Include the RA number on the package.
              </li>
              <li>
                <strong>Ship Your Return:</strong> Send your return to the address provided in your RA email.
                We recommend using a trackable shipping method.
              </li>
              <li>
                <strong>Receive Your Refund:</strong> Once we receive and inspect your return, we&apos;ll process
                your refund within 5-7 business days.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Return Shipping Costs</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Defective or Incorrect Items:</strong> If you received a defective or incorrect item,
                we&apos;ll provide a prepaid return shipping label at no cost to you.
              </li>
              <li>
                <strong>Change of Mind:</strong> Customers are responsible for return shipping costs. We
                recommend using a trackable shipping service.
              </li>
              <li>
                <strong>Exchanges:</strong> Return shipping is the customer&apos;s responsibility; we&apos;ll cover
                shipping for the replacement item.
              </li>
            </ul>
            <p className="mt-4">
              <strong>Return Address:</strong> (Will be provided with your RA number)
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Refund Method & Timeline</h2>
            <p><strong>Processing Time:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Returns are inspected within 2-3 business days of receipt</li>
              <li>Refunds are processed within 5-7 business days after approval</li>
              <li>Refunds appear on your original payment method within 7-10 business days</li>
            </ul>
            <p className="mt-4"><strong>Refund Amount:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Original product cost will be refunded in full</li>
              <li>Original shipping charges are non-refundable (except for defective/incorrect items)</li>
              <li>Free shipping promotions: actual shipping cost will be deducted from refund</li>
            </ul>
            <p className="mt-4">
              You will receive an email confirmation once your refund has been processed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Exchanges</h2>
            <p>
              We want you to find the perfect fit! If you need a different size or color:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mt-4">
              <li>Contact us at support@girlsecret.com to request an exchange</li>
              <li>Return the original item following our return process</li>
              <li>We&apos;ll ship your replacement item once we receive your return</li>
              <li>Exchanges are subject to availability</li>
            </ol>
            <p className="mt-4">
              <strong>Size Exchange Program:</strong> For size exchanges only, we&apos;ll cover shipping both ways
              on your first exchange per order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Defective or Damaged Items</h2>
            <p>
              While we carefully inspect all items before shipping, if you receive a defective or damaged
              item:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Contact us within 7 days of receiving your order</li>
              <li>Provide photos of the defect or damage</li>
              <li>Include your order number and description of the issue</li>
              <li>We&apos;ll provide a prepaid return label and ship a replacement immediately</li>
            </ul>
            <p className="mt-4">
              We stand behind the quality of our products and will resolve any defect issues promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Wrong Item Received</h2>
            <p>
              If you received an incorrect item, we sincerely apologize! Please:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Contact us immediately at support@girlsecret.com</li>
              <li>Keep the incorrect item in its original condition</li>
              <li>We&apos;ll send a prepaid return label and ship the correct item right away</li>
              <li>The correct item will ship before we receive the return</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. International Returns</h2>
            <p>
              International customers may return items following the same guidelines. Please note:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Customers are responsible for return shipping costs</li>
              <li>We recommend using a trackable international shipping method</li>
              <li>Original international shipping charges are non-refundable</li>
              <li>Customs duties and taxes are non-refundable</li>
              <li>Processing may take longer for international returns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. Store Credit Option</h2>
            <p>
              Prefer store credit instead of a refund? We offer:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>110% store credit value for eligible returns (within 30 days)</li>
              <li>Instant store credit processing (no waiting for refund)</li>
              <li>Store credit never expires</li>
              <li>Can be used on any future purchase</li>
            </ul>
            <p className="mt-4">
              Request store credit when initiating your return for this bonus option.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">12. Lost Return Packages</h2>
            <p>
              We recommend using a trackable shipping method for all returns. If your return package is
              lost in transit:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Contact the carrier with your tracking number</li>
              <li>File a claim with the shipping carrier if insured</li>
              <li>Contact us with proof of shipment, and we&apos;ll work with you to resolve the issue</li>
            </ul>
            <p className="mt-4">
              We are not responsible for return packages lost without tracking information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p>
              Questions about returns or need assistance? We&apos;re here to help!
            </p>
            <p className="mt-2">
              Email: support@girlsecret.com<br />
              Phone: +1 (555) 123-4567<br />
              Hours: Monday-Friday, 9:00 AM - 6:00 PM EST
            </p>
            <p className="mt-4">
              Please include your order number in all correspondence for faster assistance.
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
        title: 'Return Policy',
        description: 'Learn about GirlSecret return and exchange policy for luxury intimate apparel. Easy 30-day returns with full refund or exchange.',
        path: '/returns',
      },
    },
  };
}
