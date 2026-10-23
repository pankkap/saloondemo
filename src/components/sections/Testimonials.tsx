"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { TESTIMONIALS } from "@/data/salonData";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-24 sm:py-32 bg-[#0D0D0E] text-[#F4F4F5] px-6 sm:px-8 border-t border-[#27272A] overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-zinc-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span>Client Impressions</span>
          </div>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl text-white tracking-tight">
            Words From Our Guests
          </h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            Sample client review copy for editorial preview
          </p>
        </div>

        {/* Big Editorial Quote Carousel */}
        <div className="relative min-h-[260px] sm:min-h-[220px] flex flex-col justify-between">
          <Quote className="w-12 h-12 text-white/20 mx-auto mb-6" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-6 max-w-3xl mx-auto"
            >
              <blockquote className="font-editorial-serif text-2xl sm:text-3xl md:text-4xl text-white font-light leading-snug">
                “{current.quote}”
              </blockquote>

              <div className="space-y-1">
                <p className="text-sm font-medium tracking-wide text-white">
                  {current.clientName}
                </p>
                <p className="text-xs text-zinc-400 tracking-wider uppercase font-light">
                  {current.service} · Stylist: {current.stylist}
                </p>
                <p className="text-[11px] text-zinc-500">{current.location}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              onClick={prevTestimonial}
              className="p-2.5 rounded-full border border-[#27272A] text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors focus:outline-none focus:ring-1 focus:ring-white"
              aria-label="Previous quote"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center space-x-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-white w-6"
                      : "bg-zinc-700 hover:bg-zinc-500"
                  }`}
                  aria-label={`Go to quote ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2.5 rounded-full border border-[#27272A] text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors focus:outline-none focus:ring-1 focus:ring-white"
              aria-label="Next quote"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
