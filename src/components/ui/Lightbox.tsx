"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, User, Scissors } from "lucide-react";
import { GalleryItem } from "@/data/salonData";

interface LightboxProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  item,
  items,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    if (item) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [item, onClose, onNext, onPrev]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
      >
        {/* Background Click to Dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 text-white hover:text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white border border-zinc-700"
          aria-label="Close image modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 p-3 text-white hover:text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white border border-zinc-700"
          aria-label="Previous artwork"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 p-3 text-white hover:text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white border border-zinc-700"
          aria-label="Next artwork"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl w-full max-h-[90vh] bg-[#121214] border border-[#27272A] flex flex-col md:flex-row overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Container */}
          <div className="relative w-full md:w-3/5 h-[340px] sm:h-[440px] md:h-[580px] bg-[#0A0A0A]">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
          </div>

          {/* Details Container */}
          <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between text-white bg-[#121214]">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400 tracking-[0.2em] uppercase">
                <span>{item.category}</span>
                <span>
                  {currentIndex + 1} / {items.length}
                </span>
              </div>

              <h2 className="font-editorial-serif text-2xl sm:text-3xl text-white leading-tight">
                {item.title}
              </h2>

              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                {item.description}
              </p>

              <div className="pt-4 border-t border-[#27272A] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-white">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-zinc-400">Stylist:</span>
                  <span className="font-medium text-white">{item.stylist}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Scissors className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-zinc-400">Technique:</span>
                  <span className="font-medium text-xs text-white">{item.technique}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href="#booking"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-black py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-zinc-200 transition-colors"
              >
                Book This Look
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
