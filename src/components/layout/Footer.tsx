"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SALON_INFO, SERVICES } from "@/data/salonData";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.75"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#050505] text-zinc-400 pt-20 pb-12 border-t border-[#27272A]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-[#27272A]">
          {/* Brand Column (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="font-editorial-serif text-3xl sm:text-4xl tracking-tight text-white">
                {SALON_INFO.brandName}
              </span>
              <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium mt-0.5">
                {SALON_INFO.brandSubtitle}
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm font-light">
              An architectural beauty studio dedicated to personalized craftsmanship, healthy hair integrity, and quiet luxury.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white font-medium block mb-2">
                The Atelier Journal
              </span>
              <p className="text-xs text-zinc-400 mb-3">
                Seasonal care notes, guest styling residency releases, and private invitations.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-zinc-300 bg-white/5 border border-zinc-700 px-3.5 py-2.5">
                  <CheckCircle className="w-4 h-4 text-zinc-300 shrink-0" />
                  <span>Thank you. You are now welcomed to our private circulation.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      aria-label="Email address for newsletter"
                      className="w-full bg-[#121214] border border-[#27272A] px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
                    />
                    <button
                      type="submit"
                      className="bg-white hover:bg-zinc-200 text-black px-4 py-2.5 text-xs tracking-wider uppercase font-medium transition-colors shrink-0"
                    >
                      Join
                    </button>
                  </div>
                  {error && <p className="text-[11px] text-zinc-300">{error}</p>}
                </form>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-semibold">
              Exploration
            </h3>
            <ul className="space-y-2.5 text-xs tracking-wider text-zinc-400 font-light">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-white transition-colors">
                  Services & Pricing
                </Link>
              </li>
              <li>
                <Link href="#work" className="hover:text-white transition-colors">
                  Portfolio Gallery
                </Link>
              </li>
              <li>
                <Link href="#experience" className="hover:text-white transition-colors">
                  The Experience Journey
                </Link>
              </li>
              <li>
                <Link href="#stylists" className="hover:text-white transition-colors">
                  Master Stylists
                </Link>
              </li>
              <li>
                <Link href="#booking" className="hover:text-white transition-colors">
                  Book Online
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Menu */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-semibold">
              Atelier Rituals
            </h3>
            <ul className="space-y-2.5 text-xs tracking-wider text-zinc-400 font-light">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`#service-${s.id}`}
                    className="hover:text-white transition-colors line-clamp-1"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sanctuary Location & Hours */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-semibold">
              The Sanctuary
            </h3>
            <div className="space-y-2.5 text-xs text-zinc-400 font-light">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <span>{SALON_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <a href={`tel:${SALON_INFO.phone}`} className="hover:text-white transition-colors">
                  {SALON_INFO.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <a href={`mailto:${SALON_INFO.email}`} className="hover:text-white transition-colors">
                  {SALON_INFO.email}
                </a>
              </p>

              <div className="pt-2 border-t border-[#27272A] text-[11px] space-y-1">
                <p className="text-white font-medium">Atelier Hours:</p>
                {SALON_INFO.schedule.map((item, idx) => (
                  <p key={idx} className="flex justify-between text-zinc-400">
                    <span>{item.days}</span>
                    <span>{item.hours}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-light">
          <p>© 2026 {SALON_INFO.brandName} {SALON_INFO.brandSubtitle}. All rights reserved.</p>

          <div className="flex items-center space-x-6 text-[11px]">
            <a
              href={SALON_INFO.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <span className="text-zinc-700">|</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms & Cancellations</span>
            <span className="text-zinc-700">|</span>
            <Link href="/admin" className="text-zinc-400 hover:text-white flex items-center gap-1 font-mono transition-colors">
              <span>Staff Admin Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
