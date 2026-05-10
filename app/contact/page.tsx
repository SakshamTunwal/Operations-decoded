"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact — Operations Decoded";
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

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
          className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4 leading-tight"
          style={{ fontFamily: "var(--font-syne),sans-serif" }}
        >
          Get in Touch
        </h1>

        {/* Primary email */}
        <a
          href="mailto:hello@operationsdecoded.com"
          className="block text-2xl font-semibold text-[#f59e0b] hover:text-[#d97706] transition-colors mb-10"
          style={{ fontFamily: "var(--font-syne),sans-serif" }}
        >
          hello@operationsdecoded.com
        </a>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5">
            <p
              className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-2"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              General enquiries
            </p>
            <a
              href="mailto:hello@operationsdecoded.com"
              className="text-[#1A1A1A] font-medium hover:text-[#f59e0b] transition-colors text-sm break-all"
            >
              hello@operationsdecoded.com
            </a>
          </div>
          <div className="bg-white border border-[#E8E4DD] rounded-2xl p-5">
            <p
              className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-2"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              Legal
            </p>
            <a
              href="mailto:legal@operationsdecoded.com"
              className="text-[#1A1A1A] font-medium hover:text-[#f59e0b] transition-colors text-sm break-all"
            >
              legal@operationsdecoded.com
            </a>
          </div>
        </div>

        {/* Contact form */}
        {submitted ? (
          <div className="bg-[#ECFDF5] border border-green-200 rounded-2xl px-6 py-8 text-center">
            <p
              className="text-green-800 font-bold text-xl mb-2"
              style={{ fontFamily: "var(--font-syne),sans-serif" }}
            >
              Message received!
            </p>
            <p className="text-green-700 text-sm">
              Thanks for reaching out. We&apos;ll get back to you as soon as
              possible.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-[#1A1A1A] mb-1.5"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white border border-[#E8E4DD] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 focus:border-[#f59e0b] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#1A1A1A] mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-[#E8E4DD] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 focus:border-[#f59e0b] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-[#1A1A1A] mb-1.5"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                className="w-full bg-white border border-[#E8E4DD] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 focus:border-[#f59e0b] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-150 text-base"
            >
              Send Message →
            </button>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-[#E8E4DD]">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-[#f59e0b] hover:text-[#d97706] font-semibold transition-colors text-sm"
          >
            Browse Modules →
          </Link>
        </div>
      </div>
    </div>
  );
}
