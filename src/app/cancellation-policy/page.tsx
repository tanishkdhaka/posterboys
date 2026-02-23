export default function CancellationReturnPolicy() {
    return (
      <div className="min-h-screen bg-white px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Cancellation & Return Policy</h1>
  
          <p className="text-sm text-gray-600">
            Effective Date: March 2026
          </p>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Order Cancellation</h2>
            <p>
              Orders may be cancelled within 24 hours of placing the order,
              provided the order has not been shipped or entered the production stage.
            </p>
            <p>
              Since many of our posters are printed on demand, once production begins,
              the order cannot be cancelled.
            </p>
            <p>
              To request a cancellation, please contact us at
              <span className="font-medium"> support@posterboys.store </span>
              with your order ID.
            </p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Print-on-Demand & Custom Products</h2>
            <p>
              Many of our products are made-to-order or personalized.
              Custom or personalized posters are non-refundable and non-returnable,
              except in cases where the product arrives damaged or incorrect.
            </p>
            <p>
              Custom orders must be paid in full at the time of purchase.
            </p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. Returns & Replacements</h2>
            <p>
              We accept returns or offer replacements only in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The product received is damaged during shipping.</li>
              <li>You received the wrong product.</li>
            </ul>
  
            <p>
              To request a return or replacement, you must notify us within 48 hours
              of delivery and provide clear photos of the product and packaging.
            </p>
            <p>
              Requests submitted after 48 hours of delivery may not be eligible for return.
            </p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Return Process</h2>
            <p>
              Once your return request is approved, we will guide you through the return process.
              Depending on the case, we may offer:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Replacement of the product</li>
              <li>Refund to the original payment method</li>
            </ul>
            <p>
              Refunds, if approved, will be processed within 5–7 business days.
            </p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Shipping Timeline</h2>
            <p>
              Delivery timelines may vary depending on product availability and location.
              In-stock items are typically dispatched faster.
              Print-on-demand products may require additional production time before shipping.
            </p>
            <p>
              We partner with trusted logistics providers such as Delhivery for delivery across India.
              Delivery times may vary based on destination and courier performance.
            </p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">6. Non-Returnable Situations</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Change of mind after delivery</li>
              <li>Incorrect address provided by the customer</li>
              <li>Minor color variations due to screen differences</li>
              <li>Custom or personalized posters (unless damaged or incorrect)</li>
            </ul>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">7. Contact Us</h2>
            <p>
              For any cancellation or return-related queries, please contact:
            </p>
            <p className="font-medium">
              support@posterboys.store
            </p>
          </section>
        </div>
      </div>
    );
  }