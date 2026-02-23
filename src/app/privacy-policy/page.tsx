export default function PrivacyPolicyPage() {
    return (
      <div className="min-h-screen bg-white px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
  
          <p className="text-sm text-gray-600">
            Effective Date: March 2026
          </p>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>
              This Privacy Policy describes how we collect, use, and protect your
              information when you visit or make a purchase from our website.
              By using this website, you agree to the terms outlined below.
            </p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
  
            <h3 className="font-medium">Personal Information</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Shipping and Billing Address</li>
              <li>Payment Information (processed securely via Razorpay)</li>
            </ul>
  
            <h3 className="font-medium mt-4">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Browser and device information</li>
              <li>Pages visited and timestamps</li>
            </ul>
  
            <h3 className="font-medium mt-4">Newsletter Subscription</h3>
            <p>
              If you subscribe to our newsletter, we collect your email address.
              You may unsubscribe at any time.
            </p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To process and fulfill orders</li>
              <li>To send order confirmations and updates</li>
              <li>To provide customer support</li>
              <li>To improve website performance</li>
              <li>To send marketing emails (if subscribed)</li>
              <li>To prevent fraud and ensure security</li>
            </ul>
            <p>We do not sell your personal information.</p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Payment Processing</h2>
            <p>
              All payments are processed securely through Razorpay.
              We do not store your card details on our servers.
            </p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Data Storage and Security</h2>
            <p>
              We use secure third-party services such as Supabase (for database and authentication)
              and Razorpay (for payments). While we implement reasonable security
              measures, no method of transmission over the internet is completely secure.
            </p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">6. Cookies</h2>
            <p>
              We may use cookies to maintain login sessions, analyze traffic,
              and improve user experience. You can disable cookies in your browser settings.
            </p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">7. Your Rights</h2>
            <p>
              You may request access, correction, or deletion of your personal data.
              You may also withdraw consent for marketing communications at any time.
            </p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">8. Data Retention</h2>
            <p>
              We retain personal data only as long as necessary to fulfill orders,
              comply with legal obligations, and resolve disputes.
            </p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time.
              Changes will be posted on this page with a revised effective date.
            </p>
          </section>
  
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy,
              please contact us at:
            </p>
            <p className="font-medium">support@posterboys.store</p>
          </section>
        </div>
      </div>
    );
  }