"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy Policy — Operations Decoded";
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "var(--font-dm-sans),sans-serif" }}>
      {/* Top bar */}
      <nav className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E8E4DD]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] group-hover:scale-110 transition-transform" />
            <span
              className="text-[#1A1A1A] font-semibold text-sm tracking-tight"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              Operations Decoded
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-16 pb-24">
        <h1
          className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-3 leading-tight"
          style={{ fontFamily: "var(--font-syne),sans-serif" }}
        >
          Privacy Policy
        </h1>
        <p className="text-sm text-[#9CA3AF] mb-10">Last updated: March 2026</p>

        <div className="space-y-10 text-[#4B5563] text-base leading-relaxed">

          {/* Section 1 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              1. What information we collect
            </h2>
            <p className="mb-3">
              We collect information in the following limited ways:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-[#1A1A1A]">Email addresses</strong> — only when you
                voluntarily submit your email address to us (for example, via a
                newsletter sign-up or contact form). We do not require an email
                address to access any part of the platform.
              </li>
              <li>
                <strong className="text-[#1A1A1A]">Anonymous usage analytics</strong> — we
                collect anonymised data about how visitors interact with the
                platform, such as pages visited, time on page, and browser type.
                This data cannot be used to identify you personally.
              </li>
              <li>
                <strong className="text-[#1A1A1A]">No account data</strong> — Operations
                Decoded does not currently offer user accounts. We do not collect
                passwords, usernames, or profile information.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              2. How we use your information
            </h2>
            <p className="mb-3">
              We use the information we collect for the following purposes only:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                To notify you about new modules, platform updates, and relevant
                content — where you have provided your email address for this
                purpose.
              </li>
              <li>
                To improve the platform by understanding how users navigate and
                engage with the content.
              </li>
              <li>
                We do not sell, rent, or otherwise transfer your personal
                information to third parties for marketing or commercial
                purposes.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              3. Cookies
            </h2>
            <p>
              We use a minimal number of cookies to support analytics
              functionality. These cookies are used to track aggregate, anonymous
              usage patterns and do not store personally identifiable
              information. You can disable cookies in your browser settings at
              any time, although this may affect some functionality of the
              platform.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              4. Third-party services
            </h2>
            <p>
              We may use third-party analytics services (such as Plausible
              Analytics or similar privacy-respecting tools) to help us
              understand platform usage. These services may set their own
              cookies or collect data in accordance with their own privacy
              policies. We select third-party services that prioritise user
              privacy and, where possible, process data in an anonymised form.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              5. Your rights
            </h2>
            <p className="mb-3">
              If you have submitted your email address to us, you have the right
              to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Request access to the personal data we hold about you.</li>
              <li>
                Request deletion of your email address from our records at any
                time.
              </li>
              <li>
                Withdraw consent for communications at any time by using the
                unsubscribe link in any email we send, or by contacting us
                directly.
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at{" "}
              <a
                href="mailto:privacy@operationsdecoded.com"
                className="text-[#f59e0b] hover:text-[#d97706] underline underline-offset-2 transition-colors"
              >
                privacy@operationsdecoded.com
              </a>
              .
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              6. Contact
            </h2>
            <p>
              If you have questions or concerns about this privacy policy or how
              we handle your data, please contact us at{" "}
              <a
                href="mailto:privacy@operationsdecoded.com"
                className="text-[#f59e0b] hover:text-[#d97706] underline underline-offset-2 transition-colors"
              >
                privacy@operationsdecoded.com
              </a>
              .
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              7. Changes to this policy
            </h2>
            <p>
              We may update this privacy policy from time to time to reflect
              changes in our practices or for legal, operational, or regulatory
              reasons. When we make material changes, we will update the "last
              updated" date at the top of this page. We encourage you to review
              this policy periodically. Your continued use of the platform after
              any changes constitutes your acceptance of the updated policy.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
