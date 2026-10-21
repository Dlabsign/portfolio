"use client";

import React from "react";
import { motion } from "framer-motion";
import { SKILLS_CATEGORIES } from "@/lib/data";

export default function DanielSkills() {
  // Flatten all 35 skills from the 6 categories into one single unified array
  const allSkills = SKILLS_CATEGORIES.flatMap((cat) => cat.items);

  // Duplicate for seamless 50% infinite translation
  const marqueeItems = [...allSkills, ...allSkills];

  return (
    <section
      id="skills"
      className="relative w-full py-24 sm:py-32 md:py-36 bg-[#050505] text-white border-t border-white/[0.08] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-14 space-y-12 sm:space-y-16">
        
        {/* Section Header: Minimalist Editorial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>( 02 )</span>
              <span>•</span>
              <span>TECHNICAL CAPABILITIES</span>
            </div>
            <h2 className="font-sans font-black text-4xl sm:text-6xl md:text-7xl tracking-[-0.04em] lowercase text-white">
              skills &amp; tools
            </h2>
          </div>

          <div className="font-mono text-xs text-neutral-400 flex items-center gap-3">
            <span className="text-neutral-300 font-medium">{allSkills.length} technologies</span>
            <span className="text-neutral-600">//</span>
            <span>infinite continuous stream</span>
          </div>
        </div>

      </div>

      {/* Edge-to-Edge Seamless Horizontal Marquee Track */}
      <div className="relative w-full py-7 sm:py-9 border-y border-white/[0.08] bg-[#070709] overflow-hidden group">
        
        {/* Left & Right Smooth Edge Fade Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 w-full"
          style={{
            background:
              "linear-gradient(to right, #050505 0%, transparent 8%, transparent 92%, #050505 100%)",
          }}
        />

        {/* Moving Marquee Container */}
        <div
          className="animate-marquee-track flex items-center"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
        >
          {marqueeItems.map((skill, index) => (
            <div
              key={`${skill.name}-${index}`}
              className="flex items-center gap-3 sm:gap-3.5 shrink-0 px-5 sm:px-7 select-none cursor-default group/skill transition-all duration-200"
            >
              {/* Solid Monochrome Icon (Brightness 0 + Invert 1 converts ANY icon to uniform solid white) */}
              <div className="relative w-4 h-4 sm:w-5 sm:h-5 shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={skill.icon}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-contain filter brightness-0 invert opacity-60 group-hover/skill:opacity-100 transition-opacity duration-200"
                  loading="lazy"
                />
              </div>

              {/* Skill Name in Clean Minimal Typography (No Container/Card) */}
              <span className="font-sans text-xs sm:text-sm tracking-tight text-neutral-400 group-hover/skill:text-white transition-colors duration-200 lowercase font-medium whitespace-nowrap">
                {skill.name}
              </span>

              {/* Minimalist Divider Node */}
              <span
                aria-hidden="true"
                className="text-neutral-700 select-none text-[11px] ml-4 sm:ml-6"
              >
                •
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Architectural Metadata Footnote */}
      <div className="max-w-7xl mx-auto px-6 md:px-14 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-neutral-500 uppercase tracking-widest">
          <div>// CONTINUOUS LIFELONG SYSTEM LEARNING</div>
          <div>FULL-STACK WEB • DATABASE ARCHITECTURE • CREATIVE TOOLS</div>
        </div>
      </div>

    </section>
  );
}
