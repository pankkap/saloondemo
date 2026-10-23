"use client";

import React, { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import BookingWizard from "@/components/booking/BookingWizard";
import { Calendar } from "lucide-react";

export default function BookPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F4F4F5]">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <section className="py-16 px-6 sm:px-8 bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-zinc-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span>Reservation Atelier</span>
            </div>
            <h1 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
              Book Your Appointment
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-light leading-relaxed">
              Select your preferred service, stylist, and appointment time. Our concierge will review your reservation request promptly.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-500">Loading reservation desk...</div>}>
              <BookingWizard />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
