"use client";

import React from "react";
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ArrowUpRight,
  Navigation,
  Compass,
} from "lucide-react";
import { SALON_INFO } from "@/data/salonData";

export default function LocationContact() {
  return (
    <section id="contact" className="py-24 sm:py-32 bg-[#0D0D0E] text-[#F4F4F5] px-6 sm:px-8 border-t border-[#27272A]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Contact details & schedule (Span 6) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-zinc-400 font-medium mb-3">
                <Compass className="w-3.5 h-3.5 text-white" />
                <span>Sanctuary & Concierge</span>
              </div>
              <h2 className="font-editorial-serif text-4xl sm:text-5xl text-white tracking-tight">
                Visit The Atelier
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light mt-2 max-w-md leading-relaxed">
                Situated at DLF Mall of India, Level 2, Sector 18, Noida. Premier luxury retail destination with multi-level covered parking and dedicated valet arrival.
              </p>
            </div>

            {/* Direct Connect Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${SALON_INFO.phone}`}
                className="p-4 border border-[#27272A] bg-[#121214] hover:border-zinc-500 transition-colors flex items-start gap-3.5 group shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
                    Concierge Line
                  </span>
                  <span className="text-xs font-medium text-white">
                    {SALON_INFO.phone}
                  </span>
                </div>
              </a>

              <a
                href={`https://wa.me/${SALON_INFO.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-[#27272A] bg-[#121214] hover:border-zinc-500 transition-colors flex items-start gap-3.5 group shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
                    WhatsApp Chat
                  </span>
                  <span className="text-xs font-medium text-white">
                    {SALON_INFO.whatsapp}
                  </span>
                </div>
              </a>
            </div>

            {/* Opening Hours Schedule */}
            <div className="bg-[#121214] border border-[#27272A] p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-300 font-medium border-b border-[#27272A] pb-3">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Atelier Hours & Schedule</span>
              </div>
              <div className="space-y-2 text-xs">
                {SALON_INFO.schedule.map((slot, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex justify-between items-center text-zinc-400 font-light"
                  >
                    <span>{slot.days}</span>
                    <span className="font-mono text-white">{slot.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Directions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-zinc-400">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>{SALON_INFO.address}</span>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  SALON_INFO.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-white hover:text-zinc-300 transition-colors font-medium"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Right Column: Stylized Architectural Map & Transit Guide (Span 6) */}
          <div className="lg:col-span-6 bg-[#121214] border border-[#27272A] p-8 sm:p-10 relative overflow-hidden shadow-lg">
            {/* Map Placeholder Graphic */}
            <div className="relative aspect-[4/3] w-full bg-[#0A0A0A] border border-[#27272A] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              {/* Minimalist stylistic gridlines */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Pin indicator */}
              <div className="relative z-10 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>

              <div className="relative z-10 mt-4 space-y-1">
                <p className="font-editorial-serif text-xl text-white">
                  {SALON_INFO.brandName} {SALON_INFO.brandSubtitle}
                </p>
                <p className="text-xs text-zinc-400">{SALON_INFO.address}</p>
                <span className="inline-block mt-2 text-[10px] tracking-widest uppercase bg-[#121214] px-3 py-1 text-zinc-400 border border-[#27272A] font-mono">
                  28.5677° N, 77.3211° E
                </span>
              </div>

              {/* Map Action Button */}
              <div className="relative z-10 mt-5">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    SALON_INFO.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-black px-5 py-2 text-xs uppercase tracking-widest font-medium hover:bg-zinc-200 transition-colors"
                >
                  <span>Open In Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Transit & Parking Details */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#0A0A0A] border border-[#27272A]">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
                  Nearest Metro Station
                </span>
                <p className="text-white">Noida Sector 18 (Blue Line)</p>
                <p className="text-[11px] text-zinc-500">3 mins walk / Direct skywalk</p>
              </div>

              <div className="p-3 bg-[#0A0A0A] border border-[#27272A]">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
                  Mall Parking & Valet
                </span>
                <p className="text-white">Covered Multi-Level Bays</p>
                <p className="text-[11px] text-zinc-500">Dedicated Gate 2 VIP drop-off</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
