"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  BookOpen, Newspaper, Wrench, MessageSquare,
  LayoutGrid, MousePointer, BadgeCheck,
  Linkedin, Twitter, Menu, X, Star,
  ChevronDown, ArrowUp, Package, Link2, Monitor,
  Users, BookMarked, Layers, Unlock, ChevronLeft, ChevronRight,
  Zap, Clock, TrendingUp,
} from "lucide-react";

// ─── Animation helpers ────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Supply Chain Illustration ─────────────────────────────────────────────────

function SupplyChainIllustration() {
  const nodes = [
    { id: "supplier",     label: "SUPPLIER",      x: 40,  y: 60 },
    { id: "warehouse",    label: "WAREHOUSE",     x: 155, y: 30 },
    { id: "manufacturer", label: "MANUFACTURER",  x: 270, y: 60 },
    { id: "distributor",  label: "DISTRIBUTOR",   x: 375, y: 30 },
    { id: "retailer",     label: "RETAILER",      x: 460, y: 60 },
  ];
  const edges: [number, number, number, number][] = [
    [40, 60, 155, 30], [155, 30, 270, 60], [270, 60, 375, 30], [375, 30, 460, 60],
  ];
  return (
    <svg viewBox="0 0 520 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <defs>
        <marker id="arrow-lp" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#D97706" />
        </marker>
      </defs>
      {edges.map(([x1, y1, x2, y2], i) => (
        <motion.line key={i} x1={x1 + 14} y1={y1} x2={x2 - 14} y2={y2}
          stroke="#E8E4DD" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow-lp)"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 + i * 0.15 }}
        />
      ))}
      {nodes.map((node, i) => (
        <motion.g key={node.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.12 }}
        >
          <circle cx={node.x} cy={node.y} r="14" fill="#f59e0b" />
          <circle cx={node.x} cy={node.y} r="14" fill="none" stroke="#D97706" strokeWidth="1.5" />
          <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="8" fontWeight="700" fill="white" fontFamily="var(--font-dm-sans),sans-serif">{i + 1}</text>
          <text x={node.x} y={node.y + 26} textAnchor="middle" fontSize="6.5" fill="#6B7280" fontFamily="var(--font-dm-sans),sans-serif" letterSpacing="0.05em">{node.label}</text>
        </motion.g>
      ))}
      <motion.circle cx={460} cy={60} r="14" stroke="#f59e0b" strokeWidth="1" fill="none"
        initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
      />
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Learn",     href: "#curriculum" },
  { label: "Platform",  href: "#platform" },
  { label: "Process",   href: "#process" },
  { label: "Community", href: "/community" },
];

function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [activeSection, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver for active section
  useEffect(() => {
    const ids = ["curriculum", "platform", "process", "forum", "testimonials", "faq"];
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(`#${id}`); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 border-b border-[#E8E4DD] transition-all duration-300 ${
        scrolled ? "bg-[#FAFAF7]/80 backdrop-blur-md shadow-sm" : "bg-[#FAFAF7]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group flex-shrink-0">
          <span className="w-2.5 h-2.5 bg-[#f59e0b] rounded-sm flex-shrink-0 group-hover:shadow-[0_0_6px_rgba(245,158,11,0.6)] transition-shadow" />
          <span className="text-[#1A1A1A] text-[15px] tracking-tight" style={{ fontFamily: "var(--font-syne),sans-serif", fontWeight: 700 }}>
            Operations Decoded
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}
              className={`relative text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2 rounded ${
                activeSection === link.href ? "text-[#D97706] font-semibold" : "text-[#6B7280] hover:text-amber-600"
              }`}
            >
              {link.label}
              {activeSection === link.href && (
                <motion.span layoutId="nav-indicator" className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[#f59e0b] rounded-full" />
              )}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a href="/login" className="text-sm text-[#6B7280] hover:text-amber-600 transition-colors duration-200">Login</a>
          <a href="/learn/procure-to-pay"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f59e0b] text-black text-sm font-semibold rounded hover:bg-[#D97706] hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
          >
            Start Learning <span className="text-xs">→</span>
          </a>
        </div>

        <button suppressHydrationWarning className="md:hidden p-2 text-[#6B7280] hover:text-[#1A1A1A] transition-colors cursor-pointer rounded"
          onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <motion.div initial={false} animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="md:hidden overflow-hidden bg-[#FAFAF7] border-b border-[#E8E4DD]"
      >
        <div className="p-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 text-[#6B7280] text-sm hover:text-[#1A1A1A] hover:bg-[#F5F0E8] rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a href="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-[#6B7280] text-sm hover:text-[#1A1A1A] hover:bg-[#F5F0E8] rounded-lg transition-colors">Login</a>
          <a href="/learn/procure-to-pay" className="mt-2 px-4 py-2.5 bg-[#f59e0b] text-black text-sm font-semibold rounded text-center hover:bg-[#D97706] transition-colors">
            Start Learning →
          </a>
        </div>
      </motion.div>
    </motion.header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const heroMetrics = [
  { icon: Users,      value: "500+",   label: "Professionals Learning" },
  { icon: BookMarked, value: "10",     label: "Interactive Modules" },
  { icon: Layers,     value: "3",      label: "Industry Domains" },
  { icon: Unlock,     value: "100%",   label: "Free to Start" },
];

function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubmitted(true); setEmail(""); }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-[#FAFAF7] overflow-hidden pt-16" aria-label="Hero">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 60% 40%, rgba(245,158,11,0.05) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
        {/* Left */}
        <div>
          <motion.div custom={0.05} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8E4DD] bg-[#F5F0E8] text-[#6B7280] text-xs mb-8"
          >
            <motion.span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
            />
            ✨ New: Interactive Procure-to-Pay Module
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl lg:text-[64px] leading-[1.05] tracking-tight mb-4 text-[#1A1A1A] max-w-lg"
            style={{ fontFamily: "var(--font-syne),sans-serif", fontWeight: 800 }}
          >
            Supply Chain, Decoded.{" "}
            <span style={{ background: "linear-gradient(90deg,#D97706,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Learn It By Doing.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#6B7280] text-lg leading-relaxed max-w-lg mb-8"
          >
            The only interactive platform where ops professionals and industrial SME owners learn how supply chains actually break and how to fix them. No theory. No fluff.
          </motion.p>

          {/* Metric badges */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8"
          >
            {heroMetrics.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E8E4DD] rounded-lg">
                <Icon size={13} className="text-[#D97706] flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A] leading-tight">{value}</p>
                  <p className="text-[10px] text-[#9CA3AF] leading-tight">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <a href="/learn/procure-to-pay"
              className="px-6 py-3 bg-[#f59e0b] text-black text-sm font-bold rounded hover:bg-[#D97706] hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            >
              Start Learning Free
            </a>
            <a href="#process"
              className="px-6 py-3 border border-[#D1CBC2] text-[#1A1A1A] text-sm font-medium rounded hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50 transition-all duration-200 cursor-pointer"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Email capture */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            {submitted ? (
              <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-green-600 font-medium">
                ✓ You&apos;re on the list! We&apos;ll notify you about new modules.
              </motion.p>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <p className="text-xs text-[#9CA3AF] flex-shrink-0">or get notified about new modules:</p>
                <div className="flex gap-2">
                  <input suppressHydrationWarning type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                    className="text-xs px-3 py-2 border border-[#E8E4DD] rounded bg-white text-[#1A1A1A] placeholder-[#C4BDB5] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 focus:border-[#f59e0b] w-48 transition-all"
                    required
                  />
                  <button suppressHydrationWarning type="submit" className="text-xs px-3 py-2 bg-[#1A1A1A] text-white rounded hover:bg-[#292524] transition-colors cursor-pointer font-medium">
                    Notify me
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>

        {/* Right: platform preview — visible on md+ */}
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <div className="relative w-full max-w-md">
            {/* Floating badge */}
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 -right-3 z-20 bg-white border border-[#E8E4DD] rounded-xl shadow-md px-3 py-2 flex items-center gap-2"
            >
              <span className="text-base">⚡</span>
              <div>
                <p className="text-[10px] font-bold text-[#1A1A1A] leading-none">Interactive</p>
                <p className="text-[9px] text-[#9CA3AF] leading-none">module active</p>
              </div>
            </motion.div>

            {/* Main card */}
            <div className="relative rounded-2xl border border-[#E8E4DD] bg-white shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#E8E4DD] bg-[#FAFAF7]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] opacity-80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-80" />
                <span className="flex-1 text-center text-[9px] text-[#9CA3AF]">Procure-to-Pay Module — Step 2/7</span>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-semibold text-[#f59e0b] uppercase tracking-widest mb-2">Diana's Office · 9:20am</p>
                {/* Fake dialogue bubble */}
                <div className="flex items-start gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] border-2 border-[#818CF8] flex items-center justify-center flex-shrink-0 text-sm">👩‍💼</div>
                  <div className="bg-[#F8F9FF] border border-[#E8E4DD] rounded-xl px-3 py-2 flex-1">
                    <p className="text-xs text-[#1A1A1A]">Marcus flagged TiO₂ at 12% stock. Do I approve this PR?</p>
                  </div>
                </div>
                {/* Fake decision cards */}
                <div className="grid grid-cols-3 gap-1.5 mb-4">
                  {[{ label: "Approve", color: "bg-green-50 border-green-200 text-green-700" }, { label: "Query", color: "bg-amber-50 border-[#f59e0b]/40 text-[#D97706]" }, { label: "Reject", color: "bg-red-50 border-red-200 text-red-600" }].map(({ label, color }) => (
                    <div key={label} className={`text-[10px] font-semibold border rounded-lg px-2 py-1.5 text-center ${color}`}>{label}</div>
                  ))}
                </div>
                {/* Progress */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#E8E4DD] rounded-full overflow-hidden">
                    <motion.div className="h-full bg-[#f59e0b] rounded-full" initial={{ width: 0 }} animate={{ width: "28%" }} transition={{ duration: 1.2, delay: 1, ease: "easeOut" }} />
                  </div>
                  <p className="text-[9px] text-[#9CA3AF] flex-shrink-0">2/7 steps</p>
                </div>
              </div>
              <div className="px-5 py-2.5 border-t border-[#E8E4DD] bg-[#FAFAF7] flex items-center justify-between">
                <span className="text-[9px] text-[#9CA3AF]">5 nodes · 4 handoffs</span>
                <span className="text-[9px] font-semibold text-[#D97706]">TiO₂: 3 days left ●</span>
              </div>
            </div>

            {/* Supply chain mini */}
            <div className="mt-4 rounded-xl border border-[#E8E4DD] bg-white shadow-sm p-4">
              <p className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3">Supply Chain Flow</p>
              <div style={{ height: 80 }}><SupplyChainIllustration /></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

const stats = [
  { icon: BookMarked,   value: "10",            label: "Modules" },
  { icon: Layers,       value: "3",             label: "Domain Areas" },
  { icon: MousePointer, value: "20+",           label: "Interactive Scenarios" },
  { icon: Unlock,       value: "Zero",          label: "Prerequisites" },
];

function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <section ref={ref} className="border-t border-b border-[#E8E4DD] bg-white py-6" aria-label="Platform stats">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex flex-col items-center text-center gap-2 py-2"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#f59e0b]/20 flex items-center justify-center">
                <Icon size={18} className="text-[#D97706]" />
              </div>
              <p className="text-xl font-black text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>{value}</p>
              <p className="text-xs text-[#6B7280] font-medium">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Logo Ticker ──────────────────────────────────────────────────────────────

const logoNames = [
  "TechMfg Co", "Global Logistics Ltd", "AutoParts Inc", "FreshFoods Dist",
  "MetalWorks Corp", "SwiftShip Logistics", "PrimePack Industries", "NexaManufacturing",
];

function LogoTicker() {
  const doubled = [...logoNames, ...logoNames];
  return (
    <section className="py-10 border-b border-[#E8E4DD] bg-[#FAFAF7] overflow-hidden" aria-label="Trusted by">
      <div className="max-w-7xl mx-auto px-6 mb-5">
        <p className="text-[10px] font-semibold text-[#C4BDB5] uppercase tracking-widest text-center">
          Trusted by teams at
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #FAFAF7, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #FAFAF7, transparent)" }} />
        <div className="flex animate-marquee" style={{ width: "max-content" }}>
          {doubled.map((name, i) => (
            <div key={i} className="flex-shrink-0 mx-8 flex items-center gap-2 opacity-30 hover:opacity-60 transition-opacity">
              <div className="w-7 h-7 rounded-md bg-[#D1CBC2]" />
              <span className="text-sm font-semibold text-[#6B7280] whitespace-nowrap">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Curriculum ───────────────────────────────────────────────────────────────

const curriculumGroups = [
  {
    label: "Core Concepts",
    icon: Package,
    count: 5,
    chips: [
      { name: "Purchase Orders", live: true, href: "/learn/procure-to-pay", desc: "Understand the full purchase order lifecycle — creation, approval, dispatch and acknowledgement.", difficulty: "Beginner" },
      { name: "Sales Invoices", live: false, desc: "Trace an invoice from issuance to payment, including dispute handling.", difficulty: "Beginner" },
      { name: "Inventory Management", live: false, desc: "Learn reorder points, safety stock, and ABC analysis hands-on.", difficulty: "Intermediate" },
      { name: "Safety Stock Calculation", live: false, desc: "Calculate safety stock buffers based on demand variability and lead time.", difficulty: "Intermediate" },
      { name: "Bill of Materials", live: false, desc: "Decode multi-level BoMs and how they drive procurement decisions.", difficulty: "Advanced" },
    ],
  },
  {
    label: "Supply Chain",
    icon: Link2,
    count: 6,
    chips: [
      { name: "Demand Forecasting", live: false, desc: "Apply time-series techniques to generate accurate demand forecasts.", difficulty: "Intermediate" },
      { name: "Bullwhip Effect", live: false, desc: "See how small demand changes amplify upstream. Interactive simulation.", difficulty: "Intermediate" },
      { name: "Lead Time Optimization", live: false, desc: "Identify and reduce bottlenecks across your supplier network.", difficulty: "Advanced" },
      { name: "Last Mile Delivery", live: true, href: "/learn/last-mile", desc: "Maya Chatterjee transforms delivery operations — true cost modelling, POD recovery, and SLA negotiation.", difficulty: "Intermediate" },
      { name: "3PL vs In-house", live: false, desc: "Decision framework for outsourcing logistics vs. keeping it internal.", difficulty: "Beginner" },
      { name: "Cost of Carrying Inventory", live: false, desc: "Calculate true holding costs including capital, storage, and obsolescence.", difficulty: "Intermediate" },
    ],
  },
  {
    label: "ERP & Systems",
    icon: Monitor,
    count: 4,
    chips: [
      { name: "ERP Systems", live: false, desc: "How ERP connects procurement, finance, and operations in one system.", difficulty: "Beginner" },
      { name: "MRP Logic", live: false, desc: "Step through Material Requirements Planning calculations with real data.", difficulty: "Advanced" },
      { name: "Warehouse Operations", live: true, href: "/learn/concrete-floors", desc: "ABC slotting, zone picking, WMS accuracy, error reduction, and surviving a flash sale.", difficulty: "Intermediate" },
      { name: "Supplier Management", live: false, desc: "Supplier scorecarding, audits, and relationship management.", difficulty: "Intermediate" },
    ],
  },
];

const difficultyColor: Record<string, string> = {
  Beginner:     "bg-green-50 text-green-700 border-green-200",
  Intermediate: "bg-[#FEF3C7] text-[#92400E] border-[#f59e0b]/30",
  Advanced:     "bg-red-50 text-red-700 border-red-200",
};

function Curriculum() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [expandedChip, setExpandedChip] = useState<string | null>(null);

  const toggle = (chipName: string) =>
    setExpandedChip((prev) => (prev === chipName ? null : chipName));

  return (
    <section id="curriculum" ref={ref} className="py-20 border-t border-[#E8E4DD] relative" aria-label="Curriculum"
      style={{ background: "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.03) 0%, transparent 60%), #FAFAF7" }}
    >
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(#1A1A1A 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4 }}
          className="text-[#f59e0b] text-xs font-semibold tracking-widest uppercase mb-4"
        >Curriculum</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold mb-12 tracking-tight max-w-lg"
          style={{ fontFamily: "var(--font-syne),sans-serif" }}
        >
          Everything that actually matters{" "}<span className="text-[#9CA3AF]">in operations.</span>
        </motion.h2>

        <div className="flex flex-col gap-10">
          {curriculumGroups.map((group, gi) => {
            const GroupIcon = group.icon;
            return (
              <motion.div key={group.label} initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.15 + gi * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <GroupIcon size={14} className="text-[#D97706]" />
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">{group.label}</p>
                  <span className="text-[10px] text-[#C4BDB5]">({group.count} lessons)</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {group.chips.map((chip) => {
                    const isOpen = expandedChip === chip.name;
                    return (
                      <div key={chip.name} className="inline-block">
                        <button suppressHydrationWarning onClick={() => toggle(chip.name)}
                          className={`group inline-flex items-center gap-1.5 px-4 py-2 border rounded-full cursor-pointer transition-all duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2 ${
                            isOpen
                              ? "border-[#D97706] bg-[#FEF3C7] text-[#D97706] font-semibold"
                              : "border-[#E8E4DD] bg-[#F5F0E8] text-[#4B5563] hover:border-[#D97706] hover:text-[#D97706] hover:bg-[#FEF3C7]"
                          }`}
                        >
                          {chip.name}
                          {!chip.live && <span className="text-[9px] bg-[#E8E4DD] text-[#9CA3AF] px-1.5 py-0.5 rounded-full font-medium">Soon</span>}
                          <ChevronDown size={11} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ opacity: 0, height: 0, y: -4 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -4 }}
                              transition={{ duration: 0.25 }} className="overflow-hidden mt-2"
                            >
                              <div className="bg-white border border-[#E8E4DD] rounded-xl p-4 shadow-sm max-w-sm">
                                <p className="text-xs text-[#4B5563] leading-relaxed mb-3">{chip.desc}</p>
                                <div className="flex items-center justify-between">
                                  <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${difficultyColor[chip.difficulty]}`}>{chip.difficulty}</span>
                                  {chip.live && chip.href ? (
                                    <a href={chip.href} className="text-xs text-[#D97706] hover:text-[#f59e0b] font-semibold transition-colors">Start Module →</a>
                                  ) : (
                                    <span className="text-[10px] text-[#9CA3AF]">Coming soon</span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <FadeUp delay={0.3} className="mt-10 flex justify-center">
          <a href="/learn" className="text-sm text-[#D97706] hover:text-[#f59e0b] font-semibold transition-colors inline-flex items-center gap-1.5">
            View Full Curriculum <span>→</span>
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Platform / Features ──────────────────────────────────────────────────────

const features = [
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    description: "Step through real supply chain scenarios. Move purchase orders, sign invoices, track shipments. Learn by doing, not reading.",
    link: "/learn/procure-to-pay",
    featured: true,
    preview: (
      <div className="mt-4 flex items-center gap-3 p-3 bg-[#FAFAF7] rounded-lg border border-[#E8E4DD]">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`w-4 h-4 rounded-sm text-[8px] flex items-center justify-center font-bold ${s <= 2 ? "bg-[#f59e0b] text-black" : "bg-[#E8E4DD] text-[#9CA3AF]"}`}>{s}</div>
          ))}
        </div>
        <div className="flex-1">
          <div className="h-1.5 bg-[#E8E4DD] rounded-full overflow-hidden">
            <div className="h-full w-2/7 bg-[#f59e0b] rounded-full" style={{ width: "28%" }} />
          </div>
        </div>
        <span className="text-[9px] text-[#9CA3AF]">Step 2 of 7</span>
      </div>
    ),
  },
  {
    icon: Newspaper,
    title: "Industry News",
    description: "Latest developments in global supply chains, logistics, and ERP — curated and credited. Stay ahead of what's shifting.",
    link: "/news",
    featured: false,
    preview: (
      <div className="mt-3 p-2.5 bg-[#FAFAF7] border border-[#E8E4DD] rounded-lg">
        <p className="text-[10px] text-[#4B5563] leading-snug">"China port congestion impacts Q1 lead times across electronics..."</p>
        <p className="text-[9px] text-[#9CA3AF] mt-1">Mar 21, 2026</p>
      </div>
    ),
  },
  {
    icon: Wrench,
    title: "ERP & Ops Solutions",
    description: "Documented failure patterns from real ERP implementations and supply chain breakdowns. Know what goes wrong before it does.",
    link: "/solutions",
    featured: false,
    preview: (
      <div className="mt-3 flex flex-wrap gap-1">
        {["SAP", "Oracle", "Odoo", "Custom ERP"].map((t) => (
          <span key={t} className="text-[9px] font-medium px-1.5 py-0.5 bg-[#F5F0E8] text-[#6B7280] border border-[#E8E4DD] rounded">{t}</span>
        ))}
      </div>
    ),
  },
  {
    icon: MessageSquare,
    title: "Community Forum",
    description: "Post your operational challenge. Get structured responses from practitioners who've been in the same situation.",
    link: "/community",
    featured: false,
    preview: (
      <div className="mt-3 flex items-center gap-2">
        <div className="flex -space-x-1.5">
          {["#f59e0b", "#818CF8", "#34D399"].map((c, i) => (
            <div key={i} className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: c }}>
              <span className="text-[7px] font-bold text-white">{["R", "P", "A"][i]}</span>
            </div>
          ))}
        </div>
        <span className="text-[10px] text-[#6B7280]">142 active discussions</span>
      </div>
    ),
  },
];

function Features() {
  return (
    <section id="platform" className="py-20 border-t border-[#E8E4DD] bg-[#FAFAF7]" aria-label="Platform features">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="mb-12">
          <p className="text-[#f59e0b] text-xs font-semibold tracking-widest uppercase mb-4">Platform</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-lg" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
            Built for the way{" "}<span className="text-[#9CA3AF]">operations actually works.</span>
          </h2>
        </FadeUp>

        {/* Featured card */}
        <FadeUp delay={0.05} className="mb-4">
          <div className="group relative rounded-xl border border-[#E8E4DD] border-l-4 border-l-[#f59e0b] bg-[#FEF3C7]/40 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
            {/* Animated glow border */}
            <motion.div className="absolute inset-0 rounded-xl pointer-events-none" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} style={{ boxShadow: "inset 0 0 0 1px rgba(245,158,11,0.2)" }} />
            <div className="p-8 flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] border border-[#f59e0b]/30 flex items-center justify-center flex-shrink-0">
                <BookOpen size={22} className="text-[#D97706]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#1A1A1A] text-xl font-bold mb-3 tracking-tight" style={{ fontFamily: "var(--font-syne),sans-serif" }}>Interactive Lessons</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed max-w-xl">Step through real supply chain scenarios. Move purchase orders, sign invoices, track shipments. Learn by doing, not reading.</p>
                {features[0].preview}
                <a href="/learn/procure-to-pay" className="inline-block mt-4 text-sm text-[#D97706] hover:text-[#f59e0b] transition-colors font-medium">Explore →</a>
              </div>
            </div>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.slice(1).map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeUp key={f.title} delay={0.1 + i * 0.08}>
                <div className="group relative rounded-xl border border-[#E8E4DD] bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer h-full">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
                  <div className="p-6 flex flex-col h-full">
                    <div className="w-10 h-10 rounded-lg bg-[#F5F0E8] border border-[#E8E4DD] flex items-center justify-center mb-5">
                      <Icon size={18} className="text-[#D97706]" />
                    </div>
                    <h3 className="text-[#1A1A1A] text-lg font-semibold mb-3 tracking-tight" style={{ fontFamily: "var(--font-syne),sans-serif" }}>{f.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed flex-1">{f.description}</p>
                    {f.preview}
                    <div className="mt-4 pt-4 border-t border-[#E8E4DD] flex justify-end">
                      <a href={f.link} className="text-sm text-[#D97706] hover:text-[#f59e0b] transition-colors font-medium">Explore →</a>
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Module ──────────────────────────────────────────────────────────

const p2pFlow = [
  { label: "Purchase Requisition", short: "PR",     color: "bg-[#FEF3C7] border-[#f59e0b]/40 text-[#92400E]" },
  { label: "Purchase Order",       short: "PO",     color: "bg-[#EFF6FF] border-blue-200 text-blue-700" },
  { label: "Goods Receipt",        short: "GRN",    color: "bg-[#F0FDF4] border-green-200 text-green-700" },
  { label: "Invoice Verification", short: "INV",    color: "bg-[#FFF7ED] border-orange-200 text-orange-700" },
  { label: "Payment",              short: "PAY",    color: "bg-[#F5F3FF] border-purple-200 text-purple-700" },
];

function FeaturedModule() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} className="py-20 border-t border-[#E8E4DD]" aria-label="Featured Module"
      style={{ background: "linear-gradient(135deg, #FFFDF5 0%, #FAFAF7 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
            <p className="text-[#f59e0b] text-xs font-semibold tracking-widest uppercase mb-4">Featured</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
              Start with Procure-to-Pay
            </h2>
            <p className="text-[#6B7280] text-base leading-relaxed mb-8">
              In 7 interactive steps, you&apos;ll follow Marcus, Diana, and Leon as Nexara Industrial Coatings runs low on titanium dioxide. From raising a purchase requisition to authorising a bank payment — you make the decisions, spot the errors, and see exactly why each document matters.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                <Clock size={14} className="text-[#D97706]" />
                <span>~25 min</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                <TrendingUp size={14} className="text-[#D97706]" />
                <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-xs rounded-full font-semibold">Beginner</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                <Zap size={14} className="text-[#D97706]" />
                <span>7 interactive steps</span>
              </div>
            </div>
            <a href="/learn/procure-to-pay"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#f59e0b] text-black text-sm font-bold rounded hover:bg-[#D97706] hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            >
              Start This Module →
            </a>
          </motion.div>

          {/* Right: P2P flow visual */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="relative p-6 bg-white rounded-2xl border border-[#E8E4DD] shadow-md">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#f59e0b] to-[#f97316] rounded-t-2xl" />
              <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-6">Procure-to-Pay Flow</p>
              <div className="flex flex-col gap-2">
                {p2pFlow.map((step, i) => (
                  <motion.div key={step.label} initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`flex-shrink-0 w-10 h-8 rounded-lg border flex items-center justify-center text-[9px] font-black ${step.color}`}>
                      {step.short}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="h-px flex-1 border-t border-dashed border-[#E8E4DD]" />
                      <p className="text-xs text-[#4B5563] font-medium">{step.label}</p>
                      <div className="h-px flex-1 border-t border-dashed border-[#E8E4DD]" />
                    </div>
                    <div className="w-4 h-4 rounded-full bg-[#F5F0E8] border border-[#E8E4DD] flex items-center justify-center text-[8px] text-[#9CA3AF] font-bold">{i + 1}</div>
                    {i < p2pFlow.length - 1 && (
                      <div className="absolute left-[1.375rem] mt-8" style={{ marginTop: `${(i + 1) * 42}px`, position: "absolute" }} />
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-[#E8E4DD] flex items-center justify-between">
                <span className="text-[10px] text-[#9CA3AF]">3 characters · $370,000 transaction</span>
                <span className="text-[10px] font-semibold text-green-600">✓ Fully interactive</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Module 2 teaser */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 p-5 bg-white border border-[#E8E4DD] rounded-2xl shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-green-200 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🌴</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Module 2 — Now Available</p>
              </div>
              <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                The Palm Oil Problem — Vendor Comparison
              </p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Sarah Chen · 7 steps · RFQ → Scorecard → Negotiation → Dual Approval → PO</p>
            </div>
          </div>
          <a
            href="/learn/vendor-comparison"
            className="flex-shrink-0 px-5 py-2.5 bg-[#f59e0b] text-black text-xs font-bold rounded-xl hover:bg-[#D97706] transition-colors whitespace-nowrap"
          >
            Start Module 2 →
          </a>
        </motion.div>

        {/* Module 3 teaser */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-4 p-5 bg-white border border-[#E8E4DD] rounded-2xl shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">📦</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Module 3 — Now Available</p>
              </div>
              <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                Twelve Wrong Laptops — GRN &amp; 3-Way Match
              </p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Neil Kapoor · 7 steps · PO → Delivery → GRN → Dispute → 3-Way Match → Resolution</p>
            </div>
          </div>
          <a
            href="/learn/grn-three-way-match"
            className="flex-shrink-0 px-5 py-2.5 bg-[#f59e0b] text-black text-xs font-bold rounded-xl hover:bg-[#D97706] transition-colors whitespace-nowrap"
          >
            Start Module 3 →
          </a>
        </motion.div>

        {/* Module 4 teaser */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-4 p-5 bg-white border border-[#E8E4DD] rounded-2xl shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-amber-200 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🚢</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Module 4 — Now Available</p>
              </div>
              <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                Four Days on the Dock — Incoterms &amp; Trade
              </p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Elena Vasquez · 7 steps · Quote → Incoterm → FOB → Port → Customs → Cost → Matrix</p>
            </div>
          </div>
          <a
            href="/learn/incoterms-dock"
            className="flex-shrink-0 px-5 py-2.5 bg-[#f59e0b] text-black text-xs font-bold rounded-xl hover:bg-[#D97706] transition-colors whitespace-nowrap"
          >
            Start Module 4 →
          </a>
        </motion.div>

        {/* Module 5 teaser */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-4 p-5 bg-white border border-[#E8E4DD] rounded-2xl shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🚨</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Module 5 — Now Available</p>
              </div>
              <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                Friday at Four-Thirty — Emergency Procurement
              </p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Ryan Torres · 7 steps · Call → Decision → Emergency PO → Justification → Pickup → Audit → Framework</p>
            </div>
          </div>
          <a
            href="/learn/emergency-po"
            className="flex-shrink-0 px-5 py-2.5 bg-[#f59e0b] text-black text-xs font-bold rounded-xl hover:bg-[#D97706] transition-colors whitespace-nowrap"
          >
            Start Module 5 →
          </a>
        </motion.div>

        {/* Module 6 teaser */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="mt-4 p-5 bg-white border border-[#E8E4DD] rounded-2xl shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🔄</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Module 6 — Now Available</p>
                <span className="text-[8px] font-bold bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5">NEW</span>
              </div>
              <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                The Other Side of the Table — Order-to-Cash
              </p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Nina Rao · 7 steps · Sales Order → ATP → Dispatch → Invoice → AR Aging → Credit Terms</p>
            </div>
          </div>
          <a
            href="/learn/order-to-cash"
            className="flex-shrink-0 px-5 py-2.5 bg-[#f59e0b] text-black text-xs font-bold rounded-xl hover:bg-[#D97706] transition-colors whitespace-nowrap"
          >
            Start Module 6 →
          </a>
        </motion.div>

        {/* Module 7 teaser */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="mt-4 p-5 bg-white border border-[#E8E4DD] rounded-2xl shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-emerald-200 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">📊</span>
            </div>
            <div>
                  <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Module 7 — Now Available</p>
                <span className="text-[8px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">NEW</span>
              </div>
              <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                Counting What Counts — Inventory Management
              </p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Zara Okafor · 7 steps · Audit → Stockout → Overstock → ROP Formula → Bullwhip → ABC Analysis → Recovery</p>
            </div>
          </div>
          <a
            href="/learn/inventory-management"
            className="flex-shrink-0 px-5 py-2.5 bg-[#10B981] text-white text-xs font-bold rounded-xl hover:bg-[#059669] transition-colors whitespace-nowrap"
          >
            Start Module 7 →
          </a>
        </motion.div>

        {/* Module 8 teaser */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-4 p-5 bg-white border border-[#E8E4DD] rounded-2xl shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">📈</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Module 8 — Now Available</p>
                <span className="text-[8px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5">NEW</span>
              </div>
              <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                The Number Everyone Argues About — Demand Planning
              </p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Tom Kessler · 7 steps · Baseline → Seasonality → Intelligence Gap → MAPE → S&OP → Assumptions → Results</p>
            </div>
          </div>
          <a
            href="/learn/demand-planning"
            className="flex-shrink-0 px-5 py-2.5 bg-[#3B82F6] text-white text-xs font-bold rounded-xl hover:bg-[#2563EB] transition-colors whitespace-nowrap"
          >
            Start Module 8 →
          </a>
        </motion.div>

        {/* Module 9 teaser */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-4 p-5 bg-white border border-[#E8E4DD] rounded-2xl shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-orange-200 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🏭</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Module 9 — Now Available</p>
                <span className="text-[8px] font-bold bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-2 py-0.5">NEW</span>
              </div>
              <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                Concrete Floors — Warehouse Operations
              </p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Andre &amp; Fatima · 7 steps · Layout → Receiving → Pick → WMS → Errors → Returns → Flash Sale</p>
            </div>
          </div>
          <a
            href="/learn/concrete-floors"
            className="flex-shrink-0 px-5 py-2.5 bg-[#EA580C] text-white text-xs font-bold rounded-xl hover:bg-[#C2410C] transition-colors whitespace-nowrap"
          >
            Start Module 9 →
          </a>
        </motion.div>

        {/* Module 10 teaser */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-4 p-5 bg-white border border-[#E8E4DD] rounded-2xl shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] border border-teal-200 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🚛</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Module 10 — Now Available</p>
                <span className="text-[8px] font-bold bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-2 py-0.5">NEW</span>
              </div>
              <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
                The Last Mile — Logistics &amp; Delivery
              </p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Maya Chatterjee · 7 steps · Modes → True Cost → Scorecard → POD Crisis → Claims → 3PL Decision → SLA</p>
            </div>
          </div>
          <a
            href="/learn/last-mile"
            className="flex-shrink-0 px-5 py-2.5 bg-[#0F766E] text-white text-xs font-bold rounded-xl hover:bg-[#0D6A63] transition-colors whitespace-nowrap"
          >
            Start Module 10 →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Process ──────────────────────────────────────────────────────────────────

const steps = [
  {
    num: "01", icon: LayoutGrid, title: "Pick a Module",
    description: "Choose from basic to advanced supply chain concepts — structured by domain, not complexity.",
    time: "Takes about 2 min to pick",
  },
  {
    num: "02", icon: MousePointer, title: "Play Through Scenarios",
    description: "Click, drag, decide. Interactive stories that mirror real ops situations without the career risk.",
    time: "~20–30 min per module",
  },
  {
    num: "03", icon: BadgeCheck, title: "Apply with Confidence",
    description: "Walk into your next ERP implementation or ops review ready. Know what breaks and why.",
    time: "Knowledge that sticks",
  },
];

function Process() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section id="process" ref={ref} className="py-20 border-t border-[#E8E4DD] bg-[#FAFAF7]" aria-label="How it works">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4 }}
          className="text-[#f59e0b] text-xs font-semibold tracking-widest uppercase mb-4"
        >Process</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold mb-16 tracking-tight max-w-lg" style={{ fontFamily: "var(--font-syne),sans-serif" }}
        >
          Three steps to operational{" "}<span className="text-[#9CA3AF]">clarity.</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative mb-14">
          {/* Amber dashed connector */}
          <div className="hidden md:block absolute top-[36px] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] border-t-2 border-dashed border-[#f59e0b]/40" style={{ top: 36 }} />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }} className="relative flex flex-col items-start"
              >
                {/* Filled circle */}
                <div className="w-[52px] h-[52px] rounded-full bg-[#f59e0b] flex items-center justify-center mb-5 shadow-md relative z-10 flex-shrink-0">
                  <span className="text-base font-black text-black" style={{ fontFamily: "var(--font-syne),sans-serif" }}>{step.num}</span>
                </div>
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#f59e0b]/20 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#D97706]" />
                </div>
                <h3 className="text-[#1A1A1A] text-xl font-semibold mb-3 tracking-tight" style={{ fontFamily: "var(--font-syne),sans-serif" }}>{step.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed max-w-xs mb-2">{step.description}</p>
                <p className="text-[10px] text-[#C4BDB5] font-medium">{step.time}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center"
        >
          <a href="/learn"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1A1A1A] text-white text-sm font-bold rounded hover:bg-[#292524] hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
          >
            Ready to start? Pick Your First Module →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Testimonials Carousel ────────────────────────────────────────────────────

const testimonials = [
  { quote: "Finally something that shows how a PO actually flows — not just what it is.", name: "Rohan Mehta", initials: "RM", title: "Procurement Lead", company: "Auto Components Manufacturer" },
  { quote: "The ERP failure patterns section saved us from repeating the same mistakes our last vendor made.", name: "Priya Nair", initials: "PN", title: "Operations Manager", company: "FMCG Distributor" },
  { quote: "I sent this to my entire team. The supply chain simulator alone is worth bookmarking.", name: "Amit Srivastava", initials: "AS", title: "Supply Chain Consultant", company: "" },
  { quote: "We used the bullwhip effect module for our team training. Better than any consulting deck.", name: "Vikram Patel", initials: "VP", title: "Head of Planning", company: "Steel Manufacturing Co." },
  { quote: "The inventory management walkthrough helped me ace my operations interview at a Fortune 500.", name: "Sneha Reddy", initials: "SR", title: "MBA Graduate", company: "IIM Bangalore" },
  { quote: "Finally, a platform that speaks the language of people who actually run warehouses.", name: "Karthik Iyer", initials: "KI", title: "Warehouse Operations Lead", company: "E-commerce Fulfillment" },
];

function TestimonialCarousel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setCurrent((c) => (c + 1) % total), 5000);
    return () => clearTimeout(t);
  }, [current, paused, total]);

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  // Show 3 at a time on desktop, 1 on mobile
  const visible = [current, (current + 1) % total, (current + 2) % total];

  return (
    <section ref={ref} id="testimonials" className="py-20 border-t border-[#E8E4DD] bg-[#FAFAF7]" aria-label="Testimonials"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4 }}
          className="text-[#f59e0b] text-xs font-semibold tracking-widest uppercase mb-4"
        >Testimonials</motion.p>
        <div className="flex items-end justify-between mb-12">
          <motion.h2 initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold tracking-tight max-w-lg" style={{ fontFamily: "var(--font-syne),sans-serif" }}
          >
            From the people{" "}<span className="text-[#9CA3AF]">on the ground.</span>
          </motion.h2>
          <div className="hidden md:flex items-center gap-2">
            <button suppressHydrationWarning onClick={prev} aria-label="Previous testimonial"
              className="w-9 h-9 rounded-full border border-[#E8E4DD] bg-white flex items-center justify-center hover:border-[#D97706] hover:text-[#D97706] transition-colors cursor-pointer"
            ><ChevronLeft size={16} /></button>
            <button suppressHydrationWarning onClick={next} aria-label="Next testimonial"
              className="w-9 h-9 rounded-full border border-[#E8E4DD] bg-white flex items-center justify-center hover:border-[#D97706] hover:text-[#D97706] transition-colors cursor-pointer"
            ><ChevronRight size={16} /></button>
          </div>
        </div>

        {/* Desktop: 3 cards */}
        <div className="hidden md:grid grid-cols-3 gap-4 items-start">
          {visible.map((idx, pos) => {
            const t = testimonials[idx];
            return (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: pos * 0.06 }}
                className="bg-white border border-[#E8E4DD] shadow-sm rounded-xl p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-0.5">{[1,2,3,4,5].map((s) => <Star key={s} size={12} className="text-[#f59e0b] fill-[#f59e0b]" />)}</div>
                <p className="text-[#4B5563] text-sm leading-relaxed italic flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="pt-4 border-t border-[#E8E4DD] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FEF3C7] border border-[#f59e0b]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#D97706]">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-[#1A1A1A] font-semibold text-sm" style={{ fontFamily: "var(--font-syne),sans-serif" }}>{t.name}</p>
                    <p className="text-[#6B7280] text-[10px]">{t.title}{t.company ? `, ${t.company}` : ""}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Mobile: single card */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.article key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-[#E8E4DD] shadow-sm rounded-xl p-6 flex flex-col gap-4"
            >
              <div className="flex gap-0.5">{[1,2,3,4,5].map((s) => <Star key={s} size={12} className="text-[#f59e0b] fill-[#f59e0b]" />)}</div>
              <p className="text-[#4B5563] text-sm leading-relaxed italic">&ldquo;{testimonials[current].quote}&rdquo;</p>
              <div className="pt-4 border-t border-[#E8E4DD] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FEF3C7] border border-[#f59e0b]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#D97706]">{testimonials[current].initials}</span>
                </div>
                <div>
                  <p className="text-[#1A1A1A] font-semibold text-sm">{testimonials[current].name}</p>
                  <p className="text-[#6B7280] text-[10px]">{testimonials[current].title}{testimonials[current].company ? `, ${testimonials[current].company}` : ""}</p>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
          <div className="flex justify-center gap-3 mt-4">
            <button suppressHydrationWarning onClick={prev} aria-label="Previous testimonial" className="w-8 h-8 rounded-full border border-[#E8E4DD] bg-white flex items-center justify-center cursor-pointer"><ChevronLeft size={14} /></button>
            <button suppressHydrationWarning onClick={next} aria-label="Next testimonial" className="w-8 h-8 rounded-full border border-[#E8E4DD] bg-white flex items-center justify-center cursor-pointer"><ChevronRight size={14} /></button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {testimonials.map((_, i) => (
            <button suppressHydrationWarning key={i} onClick={() => setCurrent(i)} aria-label={`Go to testimonial ${i + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${i === current ? "w-5 h-1.5 bg-[#f59e0b]" : "w-1.5 h-1.5 bg-[#E8E4DD] hover:bg-[#D1CBC2]"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqs = [
  { q: "Is Operations Decoded really free?", a: "Yes. The core learning modules are completely free. We believe operations knowledge shouldn't be gatekept. Premium features like certifications and team dashboards will be available later." },
  { q: "Who is this platform for?", a: "Operations professionals, supply chain managers, procurement teams, industrial SME owners, ERP consultants, and MBA students who want practical, hands-on understanding of how supply chains actually work." },
  { q: "How is this different from a textbook or YouTube course?", a: "We don't lecture. Every module is interactive — you click through real scenarios, make decisions, and see consequences. It's the closest thing to on-the-job experience without the job." },
  { q: "What topics are covered?", a: "We cover the full operations spectrum: procurement (P2P), inventory management, demand forecasting, ERP systems, warehouse operations, supplier management, and more. New modules are added regularly." },
  { q: "Do I need any prior experience?", a: "No. Modules are tagged by difficulty level. Start with Beginner modules if you're new, or jump straight to Advanced if you're experienced." },
  { q: "Can I use this for team training?", a: "Absolutely. Many teams use our modules for onboarding and upskilling. Team features with progress tracking are coming soon." },
];

function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section ref={ref} id="faq" className="py-20 border-t border-[#E8E4DD] bg-white" aria-label="Frequently asked questions">
      <div className="max-w-3xl mx-auto px-6">
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4 }}
          className="text-[#f59e0b] text-xs font-semibold tracking-widest uppercase mb-4 text-center"
        >FAQ</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold mb-12 tracking-tight text-center" style={{ fontFamily: "var(--font-syne),sans-serif" }}
        >
          Common questions,{" "}<span className="text-[#9CA3AF]">straight answers.</span>
        </motion.h2>

        <div className="flex flex-col divide-y divide-[#E8E4DD]">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}>
              <button suppressHydrationWarning onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2 rounded"
                aria-expanded={openIdx === i}
              >
                <span className={`text-sm font-semibold pr-4 transition-colors ${openIdx === i ? "text-[#D97706]" : "text-[#1A1A1A] group-hover:text-[#D97706]"}`}>{faq.q}</span>
                <motion.span animate={{ rotate: openIdx === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                  className={`text-xl font-light flex-shrink-0 transition-colors ${openIdx === i ? "text-[#D97706]" : "text-[#9CA3AF]"}`}
                >+</motion.span>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }} className="overflow-hidden"
                  >
                    <p className="text-[#6B7280] text-sm leading-relaxed pb-5">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubmitted(true); setEmail(""); }
  };

  return (
    <section ref={ref} className="py-20 border-t border-[#E8E4DD]" aria-label="Get started"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%), #FAFAF7" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="relative rounded-2xl border border-[#E8E4DD] p-12 md:p-20 text-center overflow-hidden"
          style={{ background: "linear-gradient(145deg, #FEF3C7 0%, #FFFDF5 50%, #FAFAF7 100%)" }}
        >
          {/* Dot pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(#1A1A1A 1px, transparent 1px)", backgroundSize: "18px 18px" }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/50 to-transparent" />

          <div className="relative z-10">
            <p className="text-[#f59e0b] text-xs font-semibold tracking-widest uppercase mb-4">Get started</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-[#1A1A1A] max-w-2xl mx-auto" style={{ fontFamily: "var(--font-syne),sans-serif" }}>
              Stop learning theory. Start learning ops.
            </h2>
            <p className="text-[#92400E] text-base max-w-xl mx-auto mb-8 italic">
              Join ops professionals who are done with textbooks and ready to understand how things actually work.
            </p>

            {/* Social proof avatars */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex -space-x-2">
                {["#f59e0b", "#818CF8", "#34D399", "#F87171"].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: c }}>
                    <span className="text-[8px] font-bold text-white">{["RM", "PN", "AS", "VP"][i]}</span>
                  </div>
                ))}
              </div>
              <span className="text-sm text-[#6B7280]">Join 500+ operations professionals already learning</span>
            </div>

            {/* Email form */}
            {submitted ? (
              <motion.p initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-green-600 font-semibold">
                ✓ You&apos;re in! We&apos;ll keep you updated on new modules.
              </motion.p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-5">
                <input suppressHydrationWarning type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                  className="flex-1 px-4 py-3 border border-[#E8E4DD] rounded bg-white text-sm text-[#1A1A1A] placeholder-[#C4BDB5] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/40 focus:border-[#f59e0b] transition-all"
                  required
                />
                <button suppressHydrationWarning type="submit"
                  className="px-6 py-3 bg-[#1A1A1A] text-white text-sm font-bold rounded hover:bg-[#292524] hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  Get Started Free →
                </button>
              </form>
            )}

            <a href="/learn/procure-to-pay"
              className="inline-flex items-center gap-2 text-sm text-[#D97706] hover:text-[#f59e0b] font-medium transition-colors"
            >
              Or start the P2P module now →
            </a>
            <p className="text-[10px] text-[#C4BDB5] mt-3">New modules added every week</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const [footerEmail, setFooterEmail] = useState("");
  const [footerSub, setFooterSub] = useState(false);

  return (
    <footer id="forum" className="border-t border-[#E8E4DD] py-16 bg-[#FAFAF7]" aria-label="Footer">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 bg-[#f59e0b] rounded-sm flex-shrink-0" />
              <span className="text-[#1A1A1A] text-[15px] tracking-tight" style={{ fontFamily: "var(--font-syne),sans-serif", fontWeight: 700 }}>
                Operations Decoded
              </span>
            </div>
            <p className="text-[#6B7280] text-sm leading-relaxed max-w-xs mb-5">Where ops professionals learn what actually happens.</p>
            <div className="flex gap-3 mb-6">
              <a href="https://linkedin.com/company/operations-decoded" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-[#E8E4DD] bg-white flex items-center justify-center text-[#6B7280] hover:text-[#D97706] hover:border-[#D97706]/40 transition-all duration-200 cursor-pointer"
              ><Linkedin size={15} /></a>
              <a href="https://twitter.com/opsdecoded" aria-label="Twitter" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-[#E8E4DD] bg-white flex items-center justify-center text-[#6B7280] hover:text-[#D97706] hover:border-[#D97706]/40 transition-all duration-200 cursor-pointer"
              ><Twitter size={15} /></a>
            </div>
            {/* Footer newsletter */}
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Stay updated</p>
              {footerSub ? (
                <p className="text-xs text-green-600">✓ Subscribed!</p>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if (footerEmail.trim()) setFooterSub(true); }} className="flex gap-1.5">
                  <input suppressHydrationWarning type="email" value={footerEmail} onChange={(e) => setFooterEmail(e.target.value)} placeholder="Email"
                    className="text-xs px-2.5 py-2 border border-[#E8E4DD] rounded bg-white text-[#1A1A1A] placeholder-[#C4BDB5] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]/40 focus:border-[#f59e0b] flex-1 transition-all"
                    required
                  />
                  <button suppressHydrationWarning type="submit" className="text-xs px-2.5 py-2 bg-[#f59e0b] text-black font-bold rounded hover:bg-[#D97706] transition-colors cursor-pointer">→</button>
                </form>
              )}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <p className="text-[#9CA3AF] text-xs font-semibold tracking-widest uppercase mb-5">Platform</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Learn",          href: "/learn" },
                { label: "About Us",       href: "/about" },
                { label: "Blog",           href: "/blog" },
                { label: "Solutions",      href: "/solutions" },
                { label: "News",           href: "/news" },
                { label: "Certifications", href: "/certifications" },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="text-[#6B7280] text-sm hover:text-[#1A1A1A] hover:text-amber-600 transition-colors">{label}</a>
              ))}
            </div>
          </div>

          {/* Community links */}
          <div>
            <p className="text-[#9CA3AF] text-xs font-semibold tracking-widest uppercase mb-5">Community</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Forum",      href: "/community" },
                { label: "Community",  href: "/community" },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="text-[#6B7280] text-sm hover:text-amber-600 transition-colors">{label}</a>
              ))}
            </div>
          </div>

          {/* Legal links */}
          <div>
            <p className="text-[#9CA3AF] text-xs font-semibold tracking-widest uppercase mb-5">Legal</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Privacy Policy",  href: "/privacy" },
                { label: "Terms of Service",href: "/terms" },
                { label: "Contact",         href: "/contact" },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="text-[#6B7280] text-sm hover:text-amber-600 transition-colors">{label}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#E8E4DD] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#9CA3AF]">© {new Date().getFullYear()} Operations Decoded · All rights reserved</p>
          <p className="text-xs text-[#C4BDB5]">Built for people who move things.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Back to Top ──────────────────────────────────────────────────────────────

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollTop = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-[#f59e0b] text-black flex items-center justify-center shadow-lg hover:bg-[#D97706] hover:scale-110 transition-all duration-200 cursor-pointer"
        >
          <ArrowUp size={16} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

function StructuredData() {
  const orgData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Operations Decoded",
    "description": "Interactive supply chain learning platform for operations professionals and industrial SME owners.",
    "url": "https://operationsdecoded.com",
    "educationalCredentialAwarded": "Module Completion Certificate",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Supply Chain Learning Modules",
      "itemListElement": [{ "@type": "Course", "name": "Procure-to-Pay", "description": "Interactive end-to-end procure-to-pay simulation", "educationalLevel": "Beginner" }],
    },
  };
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "Is Operations Decoded really free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The core learning modules are completely free. We believe operations knowledge shouldn't be gatekept. Premium features like certifications and team dashboards will be available later." } },
      { "@type": "Question", "name": "Who is this platform for?", "acceptedAnswer": { "@type": "Answer", "text": "Operations professionals, supply chain managers, procurement teams, industrial SME owners, ERP consultants, and MBA students who want practical, hands-on understanding of how supply chains actually work." } },
      { "@type": "Question", "name": "How is this different from a textbook or YouTube course?", "acceptedAnswer": { "@type": "Answer", "text": "We don't lecture. Every module is interactive — you click through real scenarios, make decisions, and see consequences. It's the closest thing to on-the-job experience without the job." } },
      { "@type": "Question", "name": "What topics are covered?", "acceptedAnswer": { "@type": "Answer", "text": "We cover the full operations spectrum: procurement (P2P), inventory management, demand forecasting, ERP systems, warehouse operations, supplier management, and more. New modules are added regularly." } },
      { "@type": "Question", "name": "Do I need any prior experience?", "acceptedAnswer": { "@type": "Answer", "text": "No. Modules are tagged by difficulty level. Start with Beginner modules if you're new, or jump straight to Advanced if you're experienced." } },
      { "@type": "Question", "name": "Can I use this for team training?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. Many teams use our modules for onboarding and upskilling. Team features with progress tracking are coming soon." } },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
      <StructuredData />
      <Navbar />
      <Hero />
      <StatsBar />
      <LogoTicker />
      <Curriculum />
      <Features />
      <FeaturedModule />
      <Process />
      <TestimonialCarousel />
      <FAQ />
      <CTABanner />
      <Footer />
      <BackToTop />
    </div>
  );
}
