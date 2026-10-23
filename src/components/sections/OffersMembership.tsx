"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowUpRight, Crown } from "lucide-react";
import { MEMBERSHIP_OFFERS } from "@/data/salonData";

interface OffersMembershipProps {
  onClaimOffer?: (code?: string) => void;
}

export default function OffersMembership({ onClaimOffer }: OffersMembershipProps) {
  const activeOffers = MEMBERSHIP_OFFERS.filter((o) => o.active);

  if (activeOffers.length === 0) {
    return null;
  }

  return (
    <section className="py-24 sm:py-32 bg-[#0A0A0A] px-6 sm:px-8 border-t border-[#27272A] text-[#F4F4F5]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-zinc-400 font-medium">
            <Crown className="w-3.5 h-3.5 text-white" />
            <span>Privileges & Circles</span>
          </div>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl text-white tracking-tight">
            Exclusive Atelier Memberships
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-light">
            Designed for clients who value dedicated priority booking, seasonal scalp rituals, and curated salon privileges.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {activeOffers.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative bg-[#121214] border border-[#27272A] p-8 sm:p-10 flex flex-col justify-between shadow-lg hover:border-zinc-500 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white font-semibold bg-white/10 border border-zinc-700 px-3 py-1">
                    {offer.badge}
                  </span>
                  {offer.code && (
                    <span className="text-[10px] font-mono tracking-wider bg-black text-zinc-300 border border-zinc-800 px-2.5 py-1">
                      CODE: {offer.code}
                    </span>
                  )}
                </div>

                <h3 className="font-editorial-serif text-3xl text-white mb-1">
                  {offer.title}
                </h3>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-4">
                  {offer.subtitle}
                </p>

                <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                  {offer.description}
                </p>

                {/* Perks Checklist */}
                <ul className="space-y-2.5 pt-4 border-t border-[#27272A] mb-8 text-xs text-zinc-300 font-light">
                  {offer.perks.map((perk, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <a
                  href="#booking"
                  onClick={() => onClaimOffer && onClaimOffer(offer.code)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-black py-3 text-xs uppercase tracking-widest font-medium hover:bg-zinc-200 transition-colors"
                >
                  <span>{offer.ctaText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
