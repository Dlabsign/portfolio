"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import RetroPixelOrnament from "@/components/RetroPixelOrnament";
import { ArrowDown } from "lucide-react";

interface DanielHeroProps {
  onExploreClick?: () => void;
}

export default function DanielHero({ onExploreClick }: DanielHeroProps) {
  const handleScrollDown = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById("works");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between items-center text-center pt-24 sm:pt-28 pb-10 sm:pb-12 px-4 sm:px-8 crt-scanlines overflow-hidden select-none"
    >
      {/* Subtle Vignette Ambient Shade */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.06)_100%)] z-0" />

      {/* Top Right Corner Photography Thumbnail */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-4 sm:top-6 right-4 sm:right-8 z-30"
      >
        <div className="relative w-24 sm:w-36 md:w-40 h-16 sm:h-24 md:h-28 rounded-lg sm:rounded-xl overflow-hidden border border-black/15 shadow-[0_8px_20px_rgba(0,0,0,0.08)] bg-neutral-200 hover:rotate-0 hover:scale-105 transition-all duration-300">
          <Image
            src="/retro/top-right-table.webp"
            alt="Table Atmosphere"
            fill
            sizes="180px"
            className="object-cover"
            priority
          />
        </div>
      </motion.div>

      {/* Top Geometric Pixel-Art Ornament (Peeking down from top center) */}
      <div className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 z-10 opacity-95">
        <RetroPixelOrnament position="top" />
      </div>

      {/* Central Editorial Hero Block */}
      <div className="relative z-20 my-auto w-full max-w-6xl mx-auto flex flex-col items-center justify-center space-y-6 sm:space-y-8 py-6">
        
        {/* Top Editorial Monospace Label in Brackets */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-pixel text-[11px] sm:text-xs text-neutral-600 tracking-[0.18em] uppercase select-none"
        >
          [CRITÈRE D&apos;ACCÈS : SAVOIR RESPIRER]
        </motion.div>

        {/* Monumental Headline in PP Neue Montreal */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans font-bold text-[40px] xs:text-5xl sm:text-7xl md:text-8xl lg:text-[100px] xl:text-[114px] leading-[1.02] sm:leading-[1.04] text-neutral-900 chromatic-aberration tracking-[-0.04em] text-center max-w-5xl mx-auto flex flex-col items-center justify-center gap-1 sm:gap-2"
        >
          {/* Line 1: The Design [Pixel Fire Emblem] Society */}
          <span className="flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-4">
            <span>The Design</span>
            <span className="inline-block relative w-9 sm:w-14 md:w-16 h-9 sm:h-14 md:h-16 align-middle shrink-0 -my-2">
              <Image
                src="/retro/sticker-eye.png"
                alt="Pixel Flame Emblem"
                fill
                className="object-contain filter drop-shadow-[0_2px_8px_rgba(53,10,255,0.25)]"
                priority
              />
            </span>
            <span>Society</span>
          </span>

          {/* Line 2: La société [Neon Green Taco] secrète la moins */}
          <span className="flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-4">
            <span>La société</span>
            <span className="inline-block relative w-9 sm:w-14 md:w-16 h-9 sm:h-14 md:h-16 align-middle shrink-0 -my-2">
              <Image
                src="/retro/sticker-taco.png"
                alt="Neon Lime Taco Symbol"
                fill
                className="object-contain filter drop-shadow-[0_2px_8px_rgba(180,240,0,0.3)]"
                priority
              />
            </span>
            <span>secrète la moins</span>
          </span>

          {/* Line 3: gardée de [Rounded Photo Thumbnail] Lyon */}
          <span className="flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-4">
            <span>gardée de</span>
            <span className="inline-block relative w-16 sm:w-24 md:w-28 h-9 sm:h-13 md:h-15 rounded-md sm:rounded-lg overflow-hidden border border-black/20 shadow-sm align-middle shrink-0 mx-1">
              <Image
                src="/retro/inline-audience.webp"
                alt="Audience Gathering"
                fill
                className="object-cover"
                priority
              />
            </span>
            <span>Lyon</span>
          </span>
        </motion.h1>

        {/* Bottom Editorial Monospace Label in Brackets */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-pixel text-[11px] sm:text-xs text-neutral-600 tracking-[0.18em] uppercase select-none pt-2"
        >
          [FORMATION SUR PLACE POSSIBLE]
        </motion.div>

      </div>

      {/* Bottom Symmetrical Pixel-Art Pedestal/Totem Ornament */}
      <div className="relative z-10 opacity-95">
        <RetroPixelOrnament position="bottom" />
      </div>

      {/* Smooth Scroll Cue to Archive */}
      <button
        type="button"
        onClick={handleScrollDown}
        aria-label="Scroll to portfolio archive"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 p-2 text-neutral-400 hover:text-black transition-colors focus:outline-none cursor-pointer"
      >
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}
