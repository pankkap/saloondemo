"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Maximize2 } from "lucide-react";
import { GALLERY_ITEMS, GalleryItem } from "@/data/salonData";
import Lightbox from "../ui/Lightbox";

export default function TransformationGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ["All", "Cuts", "Colour", "Balayage", "Styling"];

  const filteredItems =
    selectedCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const handleNextLightbox = () => {
    if (!lightboxItem) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === lightboxItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setLightboxItem(filteredItems[nextIndex]);
  };

  const handlePrevLightbox = () => {
    if (!lightboxItem) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === lightboxItem.id);
    const prevIndex =
      (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setLightboxItem(filteredItems[prevIndex]);
  };

  return (
    <section id="work" className="py-24 sm:py-32 bg-[#0A0A0A] px-6 sm:px-8 border-t border-[#27272A] text-[#F4F4F5]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b border-[#27272A]">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-zinc-400 font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Editorial Portfolio</span>
            </div>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
              Our Transformations
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs tracking-wider uppercase transition-all rounded-xs border ${
                  selectedCategory === cat
                    ? "bg-white text-black border-white font-medium shadow-sm"
                    : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid (Asymmetric Editorial Layout) */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative cursor-pointer"
                onClick={() => setLightboxItem(item)}
              >
                {/* Image Frame */}
                <div className="relative aspect-[3/4] overflow-hidden border border-[#27272A] bg-[#121214] shadow-md">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover img-zoom-hover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                        Click to Inspect
                      </span>
                      <p className="font-editorial-serif text-lg leading-snug text-white">
                        {item.technique}
                      </p>
                    </div>
                  </div>

                  {/* Expand icon pill */}
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-xs text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full border border-zinc-700">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Editorial Caption Underneath */}
                <div className="pt-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-widest">
                    <span>{item.category}</span>
                    <span className="font-light text-zinc-500">{item.stylist}</span>
                  </div>
                  <h3 className="font-editorial-serif text-xl text-white group-hover:text-zinc-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-light line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        item={lightboxItem}
        items={filteredItems}
        onClose={() => setLightboxItem(null)}
        onNext={handleNextLightbox}
        onPrev={handlePrevLightbox}
      />
    </section>
  );
}
