"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SignatureServices from "@/components/sections/SignatureServices";
import BookingModal from "@/components/booking/BookingModal";

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F4F4F5]">
      <Navbar onOpenBooking={() => setIsModalOpen(true)} />

      <main className="flex-1 pt-24">
        {/* Page Header */}
        <section className="py-20 px-6 sm:px-8 bg-[#0A0A0A] border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-medium block">
              Atelier Offerings
            </span>
            <h1 className="font-editorial-serif text-5xl sm:text-6xl md:text-7xl text-white tracking-tight">
              Services & Rituals
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
              Every appointment at Maison is tailored to the individual. Explore our precision cuts, bespoke chromatic balancing, and restorative head spa treatments.
            </p>
          </div>
        </section>

        <SignatureServices
          onSelectService={(id) => {
            setSelectedServiceId(id);
            setIsModalOpen(true);
          }}
        />
      </main>

      <Footer />
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialServiceId={selectedServiceId}
      />
    </div>
  );
}
