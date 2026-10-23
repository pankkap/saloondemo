"use client";

import React from "react";
import { MessageCircle, Phone } from "lucide-react";
import { SALON_INFO } from "@/data/salonData";
import { getDirectWhatsAppUrl } from "@/services/whatsappService";

export default function FloatingWhatsApp() {
  const directText = `Hello ${SALON_INFO.brandName} Hair Atelier, I would like to inquire about booking an appointment at your DLF Mall of India, Noida atelier.`;
  const directUrl = getDirectWhatsAppUrl(SALON_INFO.whatsapp, directText);
  const cleanPhone = SALON_INFO.phone.replace(/[^0-9+]/g, "");

  return (
    <aside
      aria-label="Quick contact actions"
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5"
    >
      {/* ── Direct Phone Call Button ── */}
      <a
        href={`tel:${cleanPhone}`}
        aria-label={`Direct call concierge at ${SALON_INFO.phone}`}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#121214]/90 backdrop-blur-md border border-[#27272A] hover:border-white text-zinc-300 hover:text-white hover:bg-[#1C1C1F] shadow-2xl transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        <Phone className="w-5 h-5 group-hover:scale-110 transition-transform text-zinc-200 group-hover:text-white" />
        
        {/* Sleek Tooltip */}
        <span className="absolute left-14 px-3 py-1.5 bg-[#0A0A0A]/95 border border-[#27272A] text-[10px] text-zinc-300 uppercase tracking-widest font-mono whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-2xl rounded-xs">
          Call Concierge · {SALON_INFO.phone}
        </span>
      </a>

      {/* ── WhatsApp Concierge Button (Refined Luxury Scale) ── */}
      <a
        href={directUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Concierge Chat"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#121214]/90 backdrop-blur-md border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-black shadow-2xl transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366]/40"
      >
        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" />

        {/* Sleek Tooltip */}
        <span className="absolute left-14 px-3 py-1.5 bg-[#0A0A0A]/95 border border-[#27272A] text-[10px] text-[#25D366] uppercase tracking-widest font-mono whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-2xl rounded-xs">
          WhatsApp Concierge
        </span>
      </a>
    </aside>
  );
}
