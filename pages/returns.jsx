export default function Returns() {
  return (
    <div className="min-h-screen bg-white">
      <div className="luxury-gradient py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="section-title text-center">Returns & Refunds</h1>
          <p className="text-center text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Your Statutory Rights</h2>
            <p>
              At GirlSecret UK, we want you to love every purchase. If you&apos;re not completely satisfied,
              we offer hassle-free returns within 14 days under the Consumer Contracts Regulations 2013.
            </p>
            <p className="mt-4">
              <strong>Your Rights:</strong> As a UK consumer, you have the right to cancel your order within
              14 days of receiving your items, for any reason. This does not affect your statutory rights
              under the Consumer Rights Act 2015.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. 14-Day Returns Policy</h2>
            <p>
              You have 14 calendar days from the date you receive your order to decide if you wish to keep
              your items.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>No questions asked:</strong> Return for any reason within 14 days</li>
              <li><strong>Easy process:</strong> Simple online returns portal</li>
              <li><strong>Full refund:</strong> Refund of the purchase price (excluding original delivery charge)</li>
              <li><strong>Extended for faulty items:</strong> Up to 30 days for defective products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Return Eligibility</h2>
            <p>
              For hygiene and health reasons, intimate apparel must meet specific conditions for return:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Hygiene seals intact:</strong> All protective hygiene liners must be attached and undamaged</li>
              <li><strong>Unworn and unwashed:</strong> Items must be in their original condition</li>
              <li><strong>Original packaging:</strong> Returned with tags attached where possible</li>
              <li><strong>Proof of purchase:</strong> Order confirmation or receipt must be provided</li>
            </ul>
            <p className="mt-4">
              <strong>Important:</strong> Once hygiene seals are removed or damaged, intimate apparel cannot
              be returned for hygiene reasons (except for faulty items). You may try items on but please
              ensure hygiene protection remains intact.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Non-Returnable Items</h2>
            <p>The following items cannot be returned or exchanged:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Items with removed, broken, or missing hygiene seals</li>
              <li>Worn, washed, stained, or altered items</li>
              <li>Items marked as &quot;Final Sale&quot; or clearance (clearly marked on product pages)</li>
              <li>Pierced earrings (for hygiene reasons)</li>
              <li>Gift cards and e-vouchers</li>
              <li>Items without original tags</li>
              <li>Customized or personalized products</li>
            </ul>
            <p className="mt-4">
              <strong>Exception:</strong> Faulty or misdescribed items can always be returned, regardless
              of the above conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. How to Return Your Order</h2>
            <p><strong>Step 1: Notify Us</strong></p>
            <p className="mt-2">
              Email returns@girlsecretuk.com within 14 days of receiving your order with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Your order number</li>
              <li>Items you wish to return</li>
              <li>Reason for return (optional but helps us improve)</li>
            </ul>
            <p className="mt-4"><strong>Step 2: Receive Return Authorization</strong></p>
            <p className="mt-2">
              We&apos;ll email you within 1 business day with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Return Authorization (RA) number</li>
              <li>Return address</li>
              <li>Returns label (for UK addresses)</li>
              <li>Instructions for packaging</li>
            </ul>
            <p className="mt-4"><strong>Step 3: Package Your Return</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Securely pack items in suitable packaging</li>
              <li>Include the RA number on/in the package</li>
              <li>Ensure hygiene seals are intact</li>
              <li>Attach the returns label if provided</li>
            </ul>
            <p className="mt-4"><strong>Step 4: Ship Your Return</strong></p>
            <p className="mt-2">
              You must return items within 14 days of notifying us of your cancellation.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Use a tracked delivery service (we recommend Royal Mail Signed For)</li>
              <li>Keep your proof of postage</li>
              <li>You are responsible for return postage costs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. UK Return Address</h2>
            <p>
              Returns should be sent to the address provided in your Return Authorization email. For security
              reasons, we do not publish our returns address publicly.
            </p>
            <p className="mt-4">
              <strong>Important:</strong> Always request a Return Authorization before sending items back.
              We cannot accept returns without an RA number, and they may not be processed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Return Shipping Costs</h2>
            <p><strong>Standard Returns (Change of Mind):</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Customers are responsible for return postage costs</li>
              <li>Royal Mail 2nd Class Signed For: Approximately £3.50</li>
              <li>Royal Mail 1st Class Signed For: Approximately £4.50</li>
              <li>We recommend using a tracked service for your protection</li>
            </ul>
            <p className="mt-4"><strong>Faulty, Damaged, or Incorrect Items:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>We&apos;ll provide a prepaid Freepost returns label</li>
              <li>No cost to you</li>
              <li>Full refund including original delivery charge</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Refunds</h2>
            <p><strong>Processing Time:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Returns inspected within 2 business days of receipt</li>
              <li>Refunds processed within 14 days of receiving your return</li>
              <li>Refunds appear in your account within 3-5 business days after processing</li>
              <li>Email confirmation sent once refund is issued</li>
            </ul>
            <p className="mt-4"><strong>Refund Amount:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Full product price refunded</li>
              <li>Original standard delivery charge: Non-refundable</li>
              <li>If you used free delivery (over £50): £4.95 deducted from refund if order total drops below £50</li>
              <li>Express/Next Day delivery charges: Non-refundable</li>
              <li>Faulty items: All charges refunded including delivery</li>
            </ul>
            <p className="mt-4"><strong>Refund Method:</strong></p>
            <p className="mt-2">
              Refunds are issued to your original payment method:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Credit/Debit Card: 3-5 business days</li>
              <li>PayPal: 1-2 business days</li>
              <li>Apple Pay/Google Pay: 3-5 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Exchanges</h2>
            <p>
              Need a different size or colour? We&apos;re happy to help!
            </p>
            <p className="mt-4"><strong>Free Size Exchange Programme:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>First size exchange per order: We cover return and redelivery postage</li>
              <li>Must be same item, different size only</li>
              <li>Request within 14 days of receipt</li>
              <li>Subject to stock availability</li>
              <li>Email exchanges@girlsecretuk.com to request</li>
            </ul>
            <p className="mt-4"><strong>Other Exchanges (Colour, Different Items):</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Return the original item following our returns process</li>
              <li>Place a new order for the desired item</li>
              <li>Customer pays return postage on original item</li>
              <li>Standard delivery charges apply to new order</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Faulty or Damaged Items</h2>
            <p>
              We carefully inspect all items before dispatch, but if you receive a faulty or damaged item,
              we&apos;ll make it right immediately.
            </p>
            <p className="mt-4"><strong>Under Consumer Rights Act 2015:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>First 30 days:</strong> Full refund, no questions asked</li>
              <li><strong>Up to 6 months:</strong> Free repair or replacement</li>
              <li><strong>After 6 months:</strong> We&apos;ll still help resolve the issue</li>
            </ul>
            <p className="mt-4"><strong>How to Report a Fault:</strong></p>
            <ol className="list-decimal pl-6 space-y-2 mt-2">
              <li>Contact support@girlsecretuk.com within 30 days of receipt</li>
              <li>Provide photos clearly showing the fault or damage</li>
              <li>Include your order number and description of the issue</li>
              <li>We&apos;ll arrange collection or provide a Freepost label</li>
              <li>Replacement sent immediately or full refund processed</li>
            </ol>
            <p className="mt-4">
              <strong>Our Promise:</strong> Faulty items are returned at our expense, and you&apos;ll receive
              a full refund including original delivery charges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. Wrong Item Received</h2>
            <p>
              If we&apos;ve sent you the wrong item, we sincerely apologize. We&apos;ll resolve this immediately:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Email support@girlsecretuk.com immediately</li>
              <li>Keep the incorrect item in original condition</li>
              <li>We&apos;ll send the correct item via Next Day Delivery at no charge</li>
              <li>Prepaid return label provided for the incorrect item</li>
              <li>No need to wait for us to receive the return before we send the replacement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">12. International Returns</h2>
            <p>
              International customers can return items following the same 14-day policy:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Email returns@girlsecretuk.com for Return Authorization</li>
              <li>Customer responsible for international return shipping costs</li>
              <li>Use a tracked, insured service for protection</li>
              <li>Original international shipping charges are non-refundable</li>
              <li>Customs duties and taxes cannot be refunded</li>
              <li>Mark package as &quot;Returned Goods&quot; to avoid additional charges</li>
              <li>Processing may take longer for international returns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">13. Store Credit Option</h2>
            <p>
              Prefer store credit instead of a refund? We offer an enhanced credit option:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>110% credit value:</strong> Get 10% extra on eligible returns within 14 days</li>
              <li><strong>Instant processing:</strong> Credit issued immediately upon return inspection</li>
              <li><strong>Never expires:</strong> Use your credit anytime</li>
              <li><strong>Flexible use:</strong> Valid on any future purchase</li>
              <li><strong>Easy to redeem:</strong> Automatically applied at checkout</li>
            </ul>
            <p className="mt-4">
              Request store credit when initiating your return to take advantage of this bonus.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">14. Lost or Undelivered Returns</h2>
            <p>
              We strongly recommend using a tracked delivery service for all returns. If your return goes missing:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Contact the courier with your tracking number</li>
              <li>File a claim with Royal Mail or your chosen carrier</li>
              <li>Provide us with proof of postage (tracking receipt)</li>
              <li>We&apos;ll investigate and work with you to resolve the issue</li>
            </ul>
            <p className="mt-4">
              <strong>Important:</strong> We cannot accept responsibility for returns lost in transit without
              proof of postage or tracking. Always retain your postal receipt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">15. Partial Returns</h2>
            <p>
              You don&apos;t need to return your entire order. You can return one or more items from a multi-item order:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Specify which items you&apos;re returning when requesting your RA number</li>
              <li>If partial return brings order total below £50, free delivery discount (£4.95) will be deducted</li>
              <li>Remaining items are yours to keep</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">16. Sale & Promotional Items</h2>
            <p><strong>Sale Items:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Regular sale items can be returned as normal</li>
              <li>&quot;Final Sale&quot; items clearly marked and cannot be returned (except if faulty)</li>
              <li>All other terms apply</li>
            </ul>
            <p className="mt-4"><strong>Items Purchased with Promo Codes:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Discount applied to the refund amount</li>
              <li>If returning part of a &quot;Buy X Get Y&quot; offer, the discount may be adjusted</li>
              <li>Promo codes cannot be reused once items are returned</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">17. Refused or Rejected Returns</h2>
            <p>
              We reserve the right to refuse returns that don&apos;t meet our policy:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Items returned after 14 days (except faulty items up to 30 days)</li>
              <li>Hygiene seals removed or damaged</li>
              <li>Items that have been worn, washed, or altered</li>
              <li>Items sent without a Return Authorization number</li>
              <li>Non-returnable items (final sale, customized, etc.)</li>
            </ul>
            <p className="mt-4">
              Refused returns will be sent back to you at your expense. We&apos;ll contact you before returning
              the items to explain why the return was refused.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">18. Contact Us</h2>
            <p>
              Questions about returns or need assistance? We&apos;re here to help!
            </p>
            <p className="mt-2">
              <strong>Email:</strong> returns@girlsecretuk.com<br />
              <strong>Customer Service:</strong> support@girlsecretuk.com<br />
              <strong>Phone:</strong> +44 (0) 20 1234 5678<br />
              <strong>Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM GMT
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
        title: 'Returns & Refunds',
        description: 'Learn about GirlSecret UK return and refund policy for luxury intimate apparel. Easy 14-day returns with full refund or exchange options.',
        path: '/returns',
      },
    },
  };
}
