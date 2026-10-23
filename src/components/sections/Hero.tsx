"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  MapPin,
  Clock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  Award,
} from "lucide-react";
import { SALON_INFO } from "@/data/salonData";

interface HeroProps {
  onOpenBooking?: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative min-h-[96vh] flex flex-col justify-between pt-32 pb-12 px-6 sm:px-8 lg:px-12 overflow-hidden bg-[#0A0A0A] text-[#F4F4F5]">
      {/* ── Full-Bleed Background Video Layer Across Entire Hero ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <video
          ref={videoRef}
          src="/videos/salon-ambience.mp4"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-[0.45] contrast-110 transition-all duration-700"
        />

        {/* Sophisticated Obsidian & Charcoal Gradient Scrim for Contrast & Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/95 via-[#0A0A0A]/70 to-[#0A0A0A]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/80" />

        {/* Ambient Subtle Vignette */}
        <div className="absolute inset-0 bg-radial-vignette opacity-50" />
      </div>

      {/* ── Main Foreground Content (No Right Window Frame) ── */}
      <div className="max-w-7xl mx-auto w-full relative z-10 my-auto py-10">
        <div className="max-w-3xl space-y-8">
          {/* Atelier Status Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-3 text-xs tracking-[0.22em] uppercase text-zinc-300 font-medium"
          >
            <span className="flex items-center gap-2 bg-[#121214]/90 backdrop-blur-md px-3.5 py-1.5 border border-[#27272A] rounded-xs shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              Noida Atelier · DLF Mall of India
            </span>

            <span className="hidden sm:inline-flex items-center gap-1.5 text-zinc-300 bg-[#121214]/70 backdrop-blur-md px-3.5 py-1.5 border border-[#27272A]/70 rounded-xs">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {SALON_INFO.openingHoursDisplay}
            </span>
          </motion.div>

          {/* Majestic Editorial Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-5"
          >
            <h1 className="font-editorial-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.93] drop-shadow-xl">
              Good Hair <br />
              <span className="italic font-light text-zinc-300">Changes</span> <br />
              Everything.
            </h1>
            <p className="text-base sm:text-xl text-zinc-300 font-light max-w-xl leading-relaxed drop-shadow-md">
              {SALON_INFO.heroSupportingText}
            </p>
          </motion.div>

          {/* Primary CTAs & Ambient Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            {onOpenBooking ? (
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2.5 bg-white text-black px-9 py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-zinc-200 transition-all duration-300 shadow-2xl active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-white"
              >
                <Calendar className="w-4 h-4 text-black" />
                <span>Book Your Appointment</span>
              </button>
            ) : (
              <Link
                href="#booking"
                className="inline-flex items-center justify-center gap-2.5 bg-white text-black px-9 py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-zinc-200 transition-all duration-300 shadow-2xl active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-white"
              >
                <Calendar className="w-4 h-4 text-black" />
                <span>Book Your Appointment</span>
              </Link>
            )}

            <Link
              href="#work"
              className="inline-flex items-center justify-center gap-2 border border-white/20 bg-[#121214]/80 backdrop-blur-md px-8 py-4 text-xs tracking-[0.2em] uppercase text-white font-medium hover:bg-white hover:text-black transition-all duration-300"
            >
              <span>Explore Our Work</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="#services"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-4 text-xs tracking-[0.18em] uppercase text-zinc-300 hover:text-white transition-colors"
            >
              <span>View Service Atelier</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Location footnote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="pt-4 border-t border-[#27272A]/80 flex flex-wrap items-center gap-6 text-xs text-zinc-300"
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {SALON_INFO.address}
            </span>
            <span className="hidden sm:inline text-zinc-500">·</span>
            <span>Unrushed 1-on-1 Sanctuary Appointments</span>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Bar: Atelier Standards Badges & Discreet Video Controls ── */}
      <div className="max-w-7xl mx-auto w-full relative z-10 pt-8 border-t border-[#27272A]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Atelier Standards Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 flex items-center gap-1 font-mono">
              <Award className="w-3 h-3 text-white" />
              Client Standard
            </span>
            <p className="text-white font-medium">★ 4.98 / 5.0 Rating</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3 h-3 text-white" />
              Purity Protocol
            </span>
            <p className="text-white font-medium">Ammonia-Free Chromatics</p>
          </div>

          <div className="space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3 text-white" />
              Atmosphere
            </span>
            <p className="text-white font-medium">Private Lie-Flat Suites</p>
          </div>
        </div>

        {/* Ambient Video Control Pill */}
        <div className="flex items-center gap-2 bg-[#121214]/90 backdrop-blur-md px-3.5 py-2 border border-[#27272A] rounded-xs shadow-lg text-xs">
          <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-mono hidden sm:inline mr-2">
            Ambient Film
          </span>
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause ambient video" : "Play ambient video"}
            className="p-1.5 text-zinc-300 hover:text-white transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute ambient audio" : "Mute ambient audio"}
            className="p-1.5 text-zinc-300 hover:text-white transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
