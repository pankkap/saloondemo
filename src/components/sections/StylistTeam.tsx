"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { STYLISTS } from "@/data/salonData";

function InstagramIcon({ className = "w-3 h-3" }: { className?: string }) {
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

interface StylistTeamProps {
  onSelectStylist?: (stylistId: string) => void;
}

export default function StylistTeam({ onSelectStylist }: StylistTeamProps) {
  return (
    <section id="stylists" className="py-24 sm:py-32 bg-[#0A0A0A] px-6 sm:px-8 border-t border-[#27272A] text-[#F4F4F5]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b border-[#27272A]">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-zinc-400 font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Master Artisans</span>
            </div>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
              Meet The Stylists
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-light leading-relaxed">
            Our team brings together international fashion week experience, classical cutting discipline, and chromatic mastery. Each stylist maintains a limited daily guest roster.
          </p>
        </div>

        {/* Stylists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {STYLISTS.map((stylist, index) => (
            <motion.div
              key={stylist.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group flex flex-col justify-between space-y-6 bg-[#121214] border border-[#27272A] p-6 shadow-lg hover:border-zinc-500 transition-colors"
            >
              <div className="space-y-5">
                {/* Portrait Frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden border border-[#27272A] bg-[#0A0A0A]">
                  <Image
                    src={stylist.image}
                    alt={stylist.name}
                    fill
                    className="object-cover img-zoom-hover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 right-3 bg-black/90 text-zinc-300 px-2.5 py-1 text-[10px] uppercase tracking-widest border border-[#27272A]">
                    {stylist.experience}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-editorial-serif text-2xl text-white group-hover:text-zinc-300 transition-colors">
                      {stylist.name}
                    </h3>
                  </div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                    {stylist.role}
                  </p>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed pt-1">
                    {stylist.bio}
                  </p>
                </div>

                {/* Specialties tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {stylist.specialties.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] bg-white/5 border border-zinc-800 px-2.5 py-1 text-zinc-300"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Booking CTA for specific stylist */}
              <div className="pt-4 border-t border-[#27272A] flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-light">
                  <InstagramIcon className="w-3 h-3 text-zinc-400" />
                  {stylist.instagram}
                </span>

                <button
                  onClick={() => {
                    if (onSelectStylist) {
                      onSelectStylist(stylist.id);
                    } else {
                      const el = document.getElementById("booking");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-white hover:text-zinc-300 transition-colors"
                >
                  <span>Book With {stylist.name.split(" ")[0]}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer Note */}
        <p className="text-[11px] text-zinc-500 text-center mt-12 font-light">
          * Stylist profiles and sample backgrounds can be customized in <code className="text-zinc-400">data/salonData.ts</code>
        </p>
      </div>
    </section>
  );
}
