"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { TECH_ICONS, TechIcon } from "./techIconsData";
import SmoothWeightText from "./SmoothWeightText";

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  // Responsive Parallax Scrolling Physics
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    restDelta: 0.001,
  });

  const yMarquee = useTransform(smoothProgress, [0, 1], [14, -14]);

  // Split tech stack into 2 complementary streams for rich dual-lane motion
  // Lane 1: Core Languages & Foundational Engineering
  const lane1: TechIcon[] = TECH_ICONS.filter(
    (t) =>
      t.category === "Language" ||
      t.slug === "mysql" ||
      t.slug === "postgresql" ||
      t.slug === "html5" ||
      t.slug === "css3" ||
      t.slug === "git"
  );

  // Lane 2: Frameworks, Systems, Cloud & Tooling
  const lane2: TechIcon[] = TECH_ICONS.filter(
    (t) =>
      t.category !== "Language" &&
      t.slug !== "mysql" &&
      t.slug !== "postgresql" &&
      t.slug !== "html5" &&
      t.slug !== "css3" &&
      t.slug !== "git"
  );

  // Duplicate for seamless 100% infinite marquee loop
  const lane1Items = [...lane1, ...lane1, ...lane1];
  const lane2Items = [...lane2, ...lane2, ...lane2];

  const renderTechCard = (tech: TechIcon, key: string) => (
    <div
      key={key}
      className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 opacity-30 hover:opacity-100 transition-all duration-300 group cursor-pointer shrink-0 select-none bg-transparent"
    >
      <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#fafafa] transition-colors duration-300 shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          <path d={tech.path} />
        </svg>
      </div>

      <SmoothWeightText className="font-mono text-xs sm:text-sm text-[#fafafa] tracking-tight whitespace-nowrap">
        {tech.name}
      </SmoothWeightText>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative w-full bg-[#000000] border-t border-[#262626] text-[#fafafa] py-10 sm:py-14 md:py-16 overflow-hidden"
    >
      {/* =========================================================================
          HORIZONTAL SCROLLING MARQUEE TRACKS (Seamless, continuous, borderless, 30% opacity)
      ========================================================================= */}
      <motion.div
        style={{ y: yMarquee }}
        className="relative w-full overflow-hidden flex flex-col gap-4 sm:gap-6"
      >
        {/* Left and Right Linear Vignette / Mask for Edge Softness */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 md:w-44 bg-gradient-to-r from-[#000000] via-[#000000]/80 to-transparent z-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 md:w-44 bg-gradient-to-l from-[#000000] via-[#000000]/80 to-transparent z-20"
        />

        {/* Track 1: Languages & Core (Moving Left) */}
        <div className="relative w-full overflow-hidden flex">
          <div className="animate-marquee-left flex items-center gap-4 sm:gap-6 shrink-0">
            {lane1Items.map((tech, i) =>
              renderTechCard(tech, `lane1-${tech.slug}-${i}`)
            )}
          </div>
        </div>

        {/* Track 2: Frameworks, Cloud & Engineering (Moving Right) */}
        <div className="relative w-full overflow-hidden flex">
          <div className="animate-marquee-right flex items-center gap-4 sm:gap-6 shrink-0">
            {lane2Items.map((tech, i) =>
              renderTechCard(tech, `lane2-${tech.slug}-${i}`)
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
