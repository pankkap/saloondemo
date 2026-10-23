"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight, Sparkles } from "lucide-react";
import { SERVICES } from "@/data/salonData";

interface SignatureServicesProps {
  onSelectService?: (serviceId: string) => void;
}

export default function SignatureServices({ onSelectService }: SignatureServicesProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Cuts", "Colour", "Balayage", "Treatments", "Styling", "Occasion"];

  const filteredServices =
    activeCategory === "All"
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);

  return (
    <section id="services" className="py-24 sm:py-32 bg-[#0D0D0E] text-[#F4F4F5] px-6 sm:px-8 border-t border-[#27272A]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b border-[#27272A]">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-zinc-400 font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Atelier Menu</span>
            </div>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
              Signature Services
            </h2>
          </div>

          <p className="text-sm text-zinc-400 max-w-md font-light leading-relaxed">
            Every service is custom-composed around your lifestyle. Prices reflect starting estimates; your stylist will provide a transparent consultation before beginning.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-all rounded-xs border ${
                activeCategory === cat
                  ? "bg-white text-black border-white font-medium shadow-sm"
                  : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Refined Editorial Services Layout (Magazine List & Offset Feature) */}
        <div className="space-y-12">
          {filteredServices.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={service.id}
                id={`service-${service.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group relative border-t border-[#27272A] pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:bg-[#161618]/70 p-4 transition-colors"
              >
                {/* Visual Thumbnail (Span 4) */}
                <div
                  className={`lg:col-span-4 relative aspect-[4/3] overflow-hidden border border-[#27272A] bg-[#121214] ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover img-zoom-hover opacity-90 group-hover:opacity-100 transition-opacity"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 bg-[#0A0A0A]/90 backdrop-blur-xs px-2.5 py-1 text-[10px] tracking-widest uppercase text-zinc-300 border border-[#27272A]">
                    {service.category}
                  </div>
                </div>

                {/* Details & Copy (Span 8) */}
                <div
                  className={`lg:col-span-8 flex flex-col justify-between space-y-4 ${
                    isEven ? "lg:order-2 lg:pl-6" : "lg:order-1 lg:pr-6"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <h3 className="font-editorial-serif text-2xl sm:text-3xl md:text-4xl text-white group-hover:text-zinc-300 transition-colors">
                        {service.name}
                      </h3>
                      <div className="text-right">
                        <span className="font-editorial-serif text-xl sm:text-2xl text-white block font-light">
                          {service.startingPrice}
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                          Starting Guide
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-400 font-medium tracking-wide">
                      {service.tagline}
                    </p>

                    <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-2xl">
                      {service.description}
                    </p>
                  </div>

                  {/* Service Footer / Duration & CTA */}
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#27272A]">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Estimated Duration: {service.duration}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (onSelectService) {
                          onSelectService(service.id);
                        } else {
                          const el = document.getElementById("booking");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-zinc-200 transition-colors"
                    >
                      <span>Book Service</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
