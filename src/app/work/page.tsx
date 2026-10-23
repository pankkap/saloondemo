"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import TransformationGallery from "@/components/sections/TransformationGallery";
import BookingModal from "@/components/booking/BookingModal";

export default function WorkPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F4F4F5]">
      <Navbar onOpenBooking={() => setIsModalOpen(true)} />

      <main className="flex-1 pt-24">
        {/* Page Header */}
        <section className="py-20 px-6 sm:px-8 bg-[#0A0A0A] border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-medium block">
              Curated Portfolio
            </span>
            <h1 className="font-editorial-serif text-5xl sm:text-6xl md:text-7xl text-white tracking-tight">
              Selected Works
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
              Explore recent transformations created by our master stylists. From razor-sharp precision bobs to dimensional sun-lit French balayage.
            </p>
          </div>
        </section>

        <TransformationGallery />
      </main>

      <Footer />
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
