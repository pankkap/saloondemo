"use client";

import React from "react";
import Image from "next/image";
import { SALON_INFO } from "@/data/salonData";
import { Sparkles, ShieldCheck, HeartHandshake, Feather } from "lucide-react";

export default function BrandIntro() {
  const pillars = [
    {
      icon: Feather,
      title: "Individual Architecture",
      text: "No algorithmic formulas or one-size-fits-all cuts. Every silhouette is designed around your bone structure and morning ritual.",
    },
    {
      icon: ShieldCheck,
      title: "Non-Compromise Health",
      text: "Ammonia-free chromatic glazes and cold-pressed botanical scalp elixirs that preserve hair cuticle strength.",
    },
    {
      icon: HeartHandshake,
      title: "Unrushed Consultations",
      text: "Appointments designed with generous temporal cushions. Never double-booked, never pressured.",
    },
    {
      icon: Sparkles,
      title: "Tactile Sanctuary",
      text: "Acoustic insulation, warm fluted joinery, lie-flat wash basins, and ambient lighting to soothe your senses.",
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#0A0A0A] border-t border-[#27272A] px-6 sm:px-8 overflow-hidden text-[#F4F4F5]">
      <div className="max-w-7xl mx-auto">
        {/* Section Tag */}
        <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-zinc-400 font-medium mb-6">
          <span className="w-8 h-[1px] bg-zinc-600" />
          <span>The Atelier Ethos</span>
        </div>

        {/* Asymmetrical Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Headline & Statement (Span 7) */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.05]">
              {SALON_INFO.introHeadline}
            </h2>

            <p className="text-lg sm:text-xl text-zinc-300 font-light leading-relaxed">
              We founded Maison with a singular conviction: that entering a salon should feel like stepping into a serene private library, not a bustling factory.
            </p>

            <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
              In an era of hyper-accelerated beauty trends, our artisans practice the art of intentional hairdressing. We listen to the rhythm of your life, examine the crown whorls and natural texture of your hair, and compose cuts and chromatic balances that look as effortless on day sixty as they do when stepping out of our chair.
            </p>

            {/* 4 Brand Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-[#27272A]">
              {pillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div key={idx} className="space-y-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="font-editorial-serif text-xl text-white">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-light">
                      {pillar.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Editorial Imagery Stack (Span 5) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Primary Salon Experience Frame with Arch Geometry */}
            <div className="relative aspect-[4/5] w-full rounded-t-[120px] overflow-hidden border border-[#27272A] shadow-2xl bg-[#121214]">
              <Image
                src="/images/indian-hero-salon.jpg"
                alt="A salon experience, considered — Maison Hair Atelier"
                fill
                className="object-cover img-zoom-hover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />

              {/* Sanctuary Badge Bar */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#27272A] text-center">
                <span className="text-[9px] tracking-[0.25em] uppercase text-white font-medium block">
                  The Noida Sanctuary · DLF Mall of India
                </span>
                <span className="text-[10px] text-zinc-400 font-light">
                  Architectural Styling Stations · Bespoke Hairdressing
                </span>
              </div>
            </div>

            {/* Overlapping Secondary Still Life / Interior Frame */}
            <div className="relative sm:absolute -bottom-8 sm:-left-10 w-full sm:w-64 aspect-[4/3] border-4 border-[#121214] shadow-2xl mt-4 sm:mt-0 bg-[#0A0A0A] overflow-hidden">
              <Image
                src="/images/indian-salon-interior.jpg"
                alt="Salon interior stations and lighting"
                fill
                className="object-cover"
                sizes="260px"
              />
            </div>

            {/* Editorial Caption */}
            <div className="mt-12 sm:mt-14 text-right sm:text-left">
              <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-semibold block">
                Sanctuary Architecture
              </span>
              <p className="text-xs text-zinc-500 font-light italic mt-0.5">
                Bespoke ergonomic leather chairs & warm ambient backlighting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
