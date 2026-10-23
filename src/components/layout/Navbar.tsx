"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Phone, Clock, Calendar } from "lucide-react";
import { SALON_INFO } from "@/data/salonData";

interface NavbarProps {
  onOpenBooking?: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "#services" },
    { label: "Our Work", href: "#work" },
    { label: "The Experience", href: "#experience" },
    { label: "Stylists", href: "#stylists" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0A0A0A]/95 backdrop-blur-md shadow-lg border-b border-[#27272A] py-3.5"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo / Wordmark */}
          <Link
            href="/"
            className="group flex flex-col items-start focus:outline-none focus:ring-1 focus:ring-white rounded-xs"
          >
            <span className="font-editorial-serif text-2xl sm:text-3xl tracking-tight text-white transition-colors group-hover:text-zinc-300">
              {SALON_INFO.brandName}
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-zinc-400 font-medium -mt-1 group-hover:text-white transition-colors">
              {SALON_INFO.brandSubtitle}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center space-x-8 text-xs tracking-[0.18em] uppercase font-medium text-zinc-400"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative py-1 transition-colors hover:text-white ${
                    isActive ? "text-white font-semibold" : ""
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}
          </nav>

          {/* Actions & Booking CTA */}
          <div className="hidden sm:flex items-center gap-5">
            <span className="hidden xl:inline-flex items-center gap-1.5 text-xs text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
              {SALON_INFO.openingHoursDisplay}
            </span>

            {onOpenBooking ? (
              <button
                onClick={onOpenBooking}
                id="header-booking-btn"
                className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 text-xs tracking-[0.16em] uppercase font-medium hover:bg-zinc-200 transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              >
                <Calendar className="w-3.5 h-3.5 text-black" />
                <span>Book Appointment</span>
              </button>
            ) : (
              <Link
                href="#booking"
                id="header-booking-btn"
                className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 text-xs tracking-[0.16em] uppercase font-medium hover:bg-zinc-200 transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              >
                <Calendar className="w-3.5 h-3.5 text-black" />
                <span>Book Appointment</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-zinc-300 transition-colors focus:outline-none focus:ring-1 focus:ring-white"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[#0A0A0A] border-l border-[#27272A] p-8 flex flex-col justify-between shadow-2xl md:hidden overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#27272A]">
                  <div className="flex flex-col">
                    <span className="font-editorial-serif text-2xl text-white">
                      {SALON_INFO.brandName}
                    </span>
                    <span className="text-[8px] tracking-[0.25em] uppercase text-zinc-400">
                      {SALON_INFO.brandSubtitle}
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Close navigation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-5 pt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-editorial-serif text-2xl text-white hover:text-zinc-300 transition-colors flex items-center justify-between group"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-8 border-t border-[#27272A] space-y-4">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Clock className="w-4 h-4" />
                  <span>{SALON_INFO.openingHoursDisplay}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  <a href={`tel:${SALON_INFO.phone}`} className="hover:underline">
                    {SALON_INFO.phone}
                  </a>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenBooking) onOpenBooking();
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-white text-black py-3.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-zinc-200 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
