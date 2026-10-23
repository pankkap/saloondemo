"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { EXPERIENCE_STEPS } from "@/data/salonData";

export default function ExperienceJourney() {
  return (
    <section id="experience" className="py-24 sm:py-32 bg-[#0D0D0E] text-[#F4F4F5] px-6 sm:px-8 border-t border-[#27272A]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-20 space-y-4">
          <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-zinc-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span>The Guest Journey</span>
          </div>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
            The Maison Protocol
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Hair is intimate. We designed every threshold of our studio to cultivate calmness, sensory satisfaction, and absolute technical excellence.
          </p>
        </div>

        {/* Steps Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {EXPERIENCE_STEPS.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative border-t border-[#27272A] pt-8 flex flex-col justify-between space-y-8 group hover:border-zinc-500 transition-colors"
            >
              <div>
                {/* Large Editorial Step Number */}
                <span className="font-editorial-serif text-5xl sm:text-6xl text-zinc-600 group-hover:text-white transition-colors font-light block mb-4">
                  {step.step}
                </span>

                <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-semibold block mb-1">
                  {step.subtitle}
                </span>

                <h3 className="font-editorial-serif text-2xl text-white mb-3 leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom decorative tick */}
              <div className="w-6 h-[1px] bg-zinc-700 group-hover:w-16 group-hover:bg-white transition-all duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Sensory Sanctuary Visual Feature */}
        <div className="mt-20 border border-[#27272A] bg-[#121214] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-lg">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-semibold block">
              Acoustic & Sensory Architecture
            </span>
            <h3 className="font-editorial-serif text-3xl sm:text-4xl text-white">
              Designed For Deep Restoration
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              Our quiet wash sanctuary features bespoke Italian lie-flat ergonomic beds, warm indirect 2700K lighting, and private soundproofing curtains so you can unplug completely during your treatment wash.
            </p>
            <div className="pt-2">
              <a
                href="#booking"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white hover:text-zinc-300 transition-colors font-medium"
              >
                <span>Reserve An Unrushed Visit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[16/9] lg:aspect-[4/3] overflow-hidden border border-[#27272A]">
            <Image
              src="/images/indian-treatment.jpg"
              alt="Sensory wash sanctuary botanical oils"
              fill
              className="object-cover img-zoom-hover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
