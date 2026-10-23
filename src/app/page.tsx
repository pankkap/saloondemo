"use client";

import React, { useState } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import BrandIntro from "@/components/sections/BrandIntro";
import SignatureServices from "@/components/sections/SignatureServices";
import TransformationGallery from "@/components/sections/TransformationGallery";
import ExperienceJourney from "@/components/sections/ExperienceJourney";
import StylistTeam from "@/components/sections/StylistTeam";
import Testimonials from "@/components/sections/Testimonials";
import OffersMembership from "@/components/sections/OffersMembership";
import LocationContact from "@/components/sections/LocationContact";
import Footer from "@/components/layout/Footer";
import BookingWizard from "@/components/booking/BookingWizard";
import BookingModal from "@/components/booking/BookingModal";
import { Calendar } from "lucide-react";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();

  const handleOpenBooking = (serviceId?: string) => {
    setSelectedServiceId(serviceId);
    setIsModalOpen(true);
  };

  const handleSelectServiceFromSection = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    // Smooth scroll to in-page booking wizard
    const el = document.getElementById("booking");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#F4F4F5]">
      {/* Responsive Sticky Nav */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main className="flex-1">
        {/* 3. Cinematic 3D Hero */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* 4. Brand Introduction */}
        <BrandIntro />

        {/* 5. Signature Services */}
        <SignatureServices onSelectService={handleSelectServiceFromSection} />

        {/* 6. Interactive Transformation Gallery */}
        <TransformationGallery />

        {/* 7. The Experience Protocol */}
        <ExperienceJourney />

        {/* 8. Master Stylists */}
        <StylistTeam onSelectStylist={() => handleOpenBooking()} />

        {/* 9. Client Testimonials */}
        <Testimonials />

        {/* 10. Offers & Atelier Membership */}
        <OffersMembership onClaimOffer={() => handleOpenBooking()} />

        {/* Dedicated In-Page Reservation Atelier Section */}
        <section
          id="booking"
          className="py-24 sm:py-32 bg-[#0D0D0E] text-[#F4F4F5] px-6 sm:px-8 border-t border-[#27272A]"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-zinc-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-white" />
                <span>Online Reservation Desk</span>
              </div>
              <h2 className="font-editorial-serif text-4xl sm:text-5xl text-white tracking-tight">
                Reserve Your Appointment
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-light leading-relaxed">
                Choose your ritual, select your preferred stylist, and pick an appointment slot. Our concierge will review and confirm your reservation.
              </p>
            </div>

            <BookingWizard initialServiceId={selectedServiceId} />
          </div>
        </section>

        {/* 11. Location & Contact */}
        <LocationContact />
      </main>

      {/* 12. Editorial Footer */}
      <Footer />

      {/* Global Quick Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialServiceId={selectedServiceId}
      />
    </div>
  );
}
