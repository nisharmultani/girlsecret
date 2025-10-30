export default function Shipping() {
  return (
    <div className="min-h-screen bg-white">
      <div className="luxury-gradient py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="section-title text-center">Delivery Information</h1>
          <p className="text-center text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. UK Delivery Options</h2>
            <p>
              At GirlSecret UK, we offer flexible delivery options to get your luxury intimate apparel to you
              quickly and discreetly. All prices include VAT.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Standard Delivery (Royal Mail):</strong> £4.95 (3-5 working days)</li>
              <li><strong>Next Day Delivery (DPD):</strong> £7.95 (Order by 8pm for next working day delivery)</li>
              <li><strong>Saturday Delivery (DPD):</strong> £9.95 (Order by Friday 8pm)</li>
              <li><strong>FREE Standard Delivery:</strong> On all orders over £50</li>
              <li><strong>Click & Collect:</strong> FREE - Collect from selected locations (coming soon)</li>
            </ul>
            <p className="mt-4">
              <em>Note:</em> Delivery times are working days (Monday-Friday, excluding bank holidays).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Order Processing Time</h2>
            <p>
              We aim to dispatch your order within 24 hours of receiving it (for orders placed before 2pm on
              working days). Orders placed after 2pm or on weekends will be processed the next working day.
            </p>
            <p className="mt-4">
              <strong>Same Day Dispatch:</strong> Orders placed before 2pm Monday-Friday will typically be
              dispatched the same day, subject to stock availability.
            </p>
            <p className="mt-4">
              <strong>Peak Periods:</strong> During busy periods such as Black Friday, Christmas, and sale events,
              processing may take up to 48 hours. We&apos;ll keep you updated via email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. UK Mainland Delivery</h2>
            <p>
              We deliver to all UK mainland addresses including residential homes, workplaces, and PO Boxes.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>England, Wales & Scotland:</strong> Full delivery service available</li>
              <li><strong>Northern Ireland:</strong> Standard delivery only (5-7 working days)</li>
              <li><strong>Scottish Highlands & Islands:</strong> May take 1-2 days longer</li>
              <li><strong>PO Boxes:</strong> Accepted for Royal Mail services only</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. International Delivery</h2>
            <p>
              We ship to over 50 countries worldwide. International delivery charges are calculated at checkout
              based on your location and order weight.
            </p>
            <div className="mt-4">
              <p><strong>Europe (EU & Non-EU):</strong></p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Standard International: £9.95 (5-10 working days)</li>
                <li>Express International: £19.95 (3-5 working days)</li>
              </ul>
            </div>
            <div className="mt-4">
              <p><strong>Rest of World:</strong></p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>USA, Canada, Australia: £14.95 (7-14 working days)</li>
                <li>Other countries: From £12.95 (varies by location)</li>
              </ul>
            </div>
            <p className="mt-4">
              <strong>Important:</strong> International orders may be subject to customs duties and import taxes,
              which are the responsibility of the customer. These charges are determined by your local customs
              authority and are not included in our prices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Order Tracking</h2>
            <p>
              Once your order is dispatched, you&apos;ll receive a shipping confirmation email containing:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Your tracking number</li>
              <li>Estimated delivery date</li>
              <li>Link to track your parcel online</li>
            </ul>
            <p className="mt-4"><strong>Track Your Order:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Royal Mail: <a href="https://www.royalmail.com/track-your-item" className="text-rose-600 hover:text-rose-700">www.royalmail.com/track</a></li>
              <li>DPD: <a href="https://www.dpd.co.uk/tracking" className="text-rose-600 hover:text-rose-700">www.dpd.co.uk/tracking</a></li>
              <li>International: Varies by carrier (details in dispatch email)</li>
            </ul>
            <p className="mt-4">
              Please allow 24 hours after receiving your dispatch confirmation for tracking information to
              become active.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Discreet & Secure Packaging</h2>
            <p>
              We understand privacy is important. All orders are packaged discreetly:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Plain, unmarked packaging with no indication of contents</li>
              <li>Sender shown as &quot;GS UK&quot; on delivery labels</li>
              <li>No external branding or product descriptions</li>
              <li>Secure, tamper-evident packaging</li>
              <li>Items wrapped in tissue paper for protection and presentation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Delivery Requirements</h2>
            <p><strong>Providing Your Address:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Please ensure your delivery address is complete and accurate</li>
              <li>Include flat/apartment numbers where applicable</li>
              <li>Provide a contact phone number for delivery updates</li>
              <li>If delivering to a workplace, include company name</li>
            </ul>
            <p className="mt-4"><strong>Signature Required:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Standard delivery: No signature required (safe place delivery available)</li>
              <li>Next Day & Saturday delivery: Signature required</li>
              <li>Orders over £100: Signature always required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Failed Delivery Attempts</h2>
            <p><strong>If you&apos;re not home when delivery is attempted:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Royal Mail:</strong> A &quot;Sorry We Missed You&quot; card will be left. Collect from your local Post Office within 18 days</li>
              <li><strong>DPD:</strong> They&apos;ll attempt delivery on the next working day. You can also redirect via their app</li>
              <li>Safe place delivery: You can specify a safe location during checkout or with the courier</li>
            </ul>
            <p className="mt-4">
              If your parcel is returned to us after failed delivery attempts, we&apos;ll contact you to arrange
              redelivery. Additional delivery charges may apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Delivery Issues</h2>
            <p><strong>Lost or Missing Parcels:</strong></p>
            <p className="mt-2">
              If your tracking shows delivered but you haven&apos;t received your order:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Check with household members, neighbors, or building reception</li>
              <li>Look in safe places (porch, garage, recycling bins)</li>
              <li>Wait 24 hours as sometimes scans are recorded early</li>
              <li>Contact us at delivery@girlsecretuk.com within 48 hours</li>
            </ul>
            <p className="mt-4"><strong>Damaged Parcels:</strong></p>
            <p className="mt-2">
              If your parcel arrives damaged:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Take photos of the packaging and any damaged items</li>
              <li>Contact us immediately at support@girlsecretuk.com</li>
              <li>Include your order number and photos</li>
              <li>We&apos;ll arrange a replacement or refund promptly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Changing Your Delivery</h2>
            <p><strong>Before Dispatch:</strong></p>
            <p className="mt-2">
              Contact us immediately at orders@girlsecretuk.com if you need to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Change your delivery address</li>
              <li>Upgrade or downgrade delivery method</li>
              <li>Cancel your order</li>
            </ul>
            <p className="mt-4">
              We&apos;ll do our best to help, but cannot guarantee changes once an order enters our dispatch process.
            </p>
            <p className="mt-4"><strong>After Dispatch:</strong></p>
            <p className="mt-2">
              Once dispatched, you may be able to redirect delivery through the courier&apos;s tracking system:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Royal Mail: Use their &quot;Delivery to Neighbour&quot; service</li>
              <li>DPD: Redirect via their app or website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. Delivery During Adverse Weather</h2>
            <p>
              In cases of severe weather (heavy snow, storms, flooding), courier services may be disrupted.
              While we&apos;ll do everything possible to meet delivery times, we cannot be held responsible for
              delays caused by circumstances beyond our control.
            </p>
            <p className="mt-4">
              We&apos;ll notify you of any significant delays and keep you updated throughout.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">12. Bank Holidays & Peak Periods</h2>
            <p><strong>Bank Holidays:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>No dispatches or deliveries on UK bank holidays</li>
              <li>Orders placed on bank holidays processed the next working day</li>
              <li>Next Day Delivery not available when next day is a bank holiday</li>
            </ul>
            <p className="mt-4"><strong>Christmas & Peak Periods:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Order early to guarantee delivery before Christmas</li>
              <li>Last order dates will be published on our website</li>
              <li>Extended processing times may apply during sales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">13. Gift Messages</h2>
            <p>
              Sending a gift? Add a complimentary gift message at checkout. Your message will be printed on
              premium card and included in the package. Pricing information and invoices are never included
              in gift deliveries.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">14. Contact Us</h2>
            <p>
              Questions about delivery or need assistance with your order?
            </p>
            <p className="mt-2">
              <strong>Email:</strong> delivery@girlsecretuk.com<br />
              <strong>Customer Service:</strong> support@girlsecretuk.com<br />
              <strong>Phone:</strong> +44 (0) 20 1234 5678<br />
              <strong>Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM GMT
            </p>
            <p className="mt-4">
              Please have your order number ready when contacting us for faster assistance.
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
        title: 'Delivery Information',
        description: 'Learn about GirlSecret UK delivery options, costs, and delivery times for luxury intimate apparel across the UK and internationally.',
        path: '/shipping',
      },
    },
  };
}
