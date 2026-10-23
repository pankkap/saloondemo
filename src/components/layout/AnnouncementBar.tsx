"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SALON_INFO } from "@/data/salonData";
import { Sparkles, X, ArrowUpRight } from "lucide-react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!SALON_INFO.announcement.enabled || !isVisible) {
    return null;
  }

  return (
    <aside
      aria-label="Announcement"
      className="relative z-50 bg-[#050505] text-[#E4E4E7] px-4 py-2 text-xs tracking-wider border-b border-[#27272A] transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-3.5 h-3.5 text-zinc-300 shrink-0" aria-hidden="true" />
          <span className="font-light tracking-wide text-zinc-300">
            {SALON_INFO.announcement.text}
          </span>
          <Link
            href={SALON_INFO.announcement.linkUrl}
            className="inline-flex items-center gap-1 text-white hover:text-zinc-300 underline underline-offset-2 transition-colors ml-1 font-medium"
          >
            {SALON_INFO.announcement.linkText}
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-zinc-400 hover:text-white transition-colors rounded shrink-0 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
