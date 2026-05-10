"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function TermsPage() {
  useEffect(() => {
    document.title = "Terms of Service — Operations Decoded";
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
          Terms of Service
        </h1>
        <p className="text-sm text-[#9CA3AF] mb-10">Last updated: March 2026</p>

        <div className="space-y-10 text-[#4B5563] text-base leading-relaxed">

          {/* Section 1 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              1. Acceptance of terms
            </h2>
            <p>
              By accessing or using the Operations Decoded platform at
              operationsdecoded.com (the &ldquo;Platform&rdquo;), you agree to be bound by
              these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these
              Terms, you must not use the Platform. These Terms apply to all
              visitors and users of the Platform. We reserve the right to modify
              these Terms at any time, and your continued use of the Platform
              after any such modification constitutes your acceptance of the
              updated Terms.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              2. Use of the platform
            </h2>
            <p className="mb-3">
              The Platform is made available for personal, non-commercial
              learning purposes only. By using the Platform, you agree that you
              will not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                Copy, reproduce, distribute, publish, or otherwise exploit any
                content on the Platform for commercial purposes without our
                express written permission.
              </li>
              <li>
                Scrape, crawl, or otherwise harvest content from the Platform
                using automated tools.
              </li>
              <li>
                Use the Platform in any way that violates applicable local,
                national, or international laws or regulations.
              </li>
              <li>
                Attempt to gain unauthorised access to any part of the Platform
                or its underlying systems.
              </li>
              <li>
                Share, redistribute, or sublicense access to Platform content to
                third parties without our written consent.
              </li>
            </ul>
            <p className="mt-3">
              Personal, non-commercial use includes using the Platform for your
              own professional development, education, or individual skill
              building. It does not include incorporating Platform content into
              training programmes, products, or services offered to others.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              3. Intellectual property
            </h2>
            <p>
              All content on the Platform — including but not limited to module
              text, scenarios, interactive exercises, characters, illustrations,
              diagrams, and underlying code — is owned by or licensed to
              Operations Decoded and is protected by applicable intellectual
              property laws. Nothing in these Terms grants you any right, title,
              or interest in the Platform&apos;s content beyond the limited personal
              use licence described in Section 2. The Operations Decoded name,
              logo, and any associated marks are the property of Operations
              Decoded and may not be used without our prior written permission.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              4. Disclaimer of warranties
            </h2>
            <p className="mb-3">
              The Platform is provided for educational purposes only. It is not
              intended to constitute, and should not be relied upon as,
              professional advice of any kind — including but not limited to
              legal, financial, procurement, or operational advice.
            </p>
            <p>
              The Platform is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any
              warranties of any kind, whether express or implied, including but
              not limited to warranties of merchantability, fitness for a
              particular purpose, accuracy, or non-infringement. We do not
              warrant that the Platform will be uninterrupted, error-free, or
              free of viruses or other harmful components. Your use of the
              Platform is at your sole risk.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              5. Limitation of liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, Operations
              Decoded and its operators, employees, and contributors shall not
              be liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of or in connection with your use of
              the Platform, even if advised of the possibility of such damages.
              Our total aggregate liability to you for any claim arising from or
              related to the Platform shall not exceed the greater of (a) the
              amount you paid to access the Platform in the twelve months
              preceding the claim, or (b) £50 (fifty pounds sterling). Some
              jurisdictions do not allow the exclusion or limitation of certain
              damages, so the above limitations may not apply to you.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              6. Changes to terms
            </h2>
            <p>
              We reserve the right to update or revise these Terms at any time.
              Changes will be effective immediately upon posting to the Platform.
              We will indicate the date of the most recent update at the top of
              this page. If we make material changes to these Terms, we may
              notify users via email (where we hold an email address) or by
              displaying a prominent notice on the Platform. Your continued use
              of the Platform after any changes constitutes your acceptance of
              the revised Terms.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2
              className="text-xl font-bold text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              7. Contact
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a
                href="mailto:legal@operationsdecoded.com"
                className="text-[#f59e0b] hover:text-[#d97706] underline underline-offset-2 transition-colors"
              >
                legal@operationsdecoded.com
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
