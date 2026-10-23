"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function Fallback3D() {
  return (
    <div
      className="w-full h-full min-h-[220px] flex items-center justify-center relative overflow-hidden"
      aria-hidden="true"
    >
      <div className="relative z-10 flex flex-col items-center text-center p-4 space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#0A0A0A] border border-[#27272A] flex items-center justify-center text-white shadow-md">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[9px] tracking-[0.25em] uppercase text-white font-medium block">
            Maison No. 01 Elixir
          </span>
          <span className="text-[8px] text-zinc-400 font-light tracking-wider">
            Botanical Scalp & Strand Ritual
          </span>
        </div>
      </div>
    </div>
  );
}
