"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import BrandIntro from "@/components/sections/BrandIntro";
import ExperienceJourney from "@/components/sections/ExperienceJourney";
import StylistTeam from "@/components/sections/StylistTeam";
import BookingModal from "@/components/booking/BookingModal";

export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F4F4F5]">
      <Navbar onOpenBooking={() => setIsModalOpen(true)} />

      <main className="flex-1 pt-24">
        {/* Page Header */}
        <section className="py-20 px-6 sm:px-8 bg-[#0A0A0A] border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-medium block">
              The Story & Ethos
            </span>
            <h1 className="font-editorial-serif text-5xl sm:text-6xl md:text-7xl text-white tracking-tight">
              About Maison Atelier
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
              Founded on the belief that hairdressing is an intimate architectural craft. We blend classical discipline with modern minimalism to create hair that moves with effortless grace.
            </p>
          </div>
        </section>

        <BrandIntro />
        <ExperienceJourney />
        <StylistTeam onSelectStylist={() => setIsModalOpen(true)} />
      </main>

      <Footer />
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
