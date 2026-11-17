"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface SmoothWeightTextProps {
  children: string;
  className?: string;
  active?: boolean;
  hoverTarget?: "group" | "group/all" | "self";
  align?: "left" | "right" | "center";
  animateEntrance?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.012,
    },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * SmoothWeightText:
 * Seamless, flicker-free font-weight crossfade transition between Regular (400) and Bold (700)
 * with cinematic staggered per-character entrance fade-in (matching TextEffect).
 * Uses per-character dual-layer opacity interpolation with GPU acceleration and zero layout shift.
 */
export default function SmoothWeightText({
  children,
  className = "",
  active = false,
  hoverTarget = "group",
  align = "left",
  animateEntrance = true,
}: SmoothWeightTextProps) {
  if (typeof children !== "string") {
    return <span className={className}>{children}</span>;
  }

  const hoverSelector =
    hoverTarget === "group/all"
      ? "group-hover/all"
      : hoverTarget === "self"
      ? "hover"
      : "group-hover";

  const words = children.split(" ");

  return (
    <span className={`relative inline select-none ${className}`}>
      {/* Accessible Plaintext for Screen Readers and SEO */}
      <span className="sr-only">{children}</span>

      {/* Visual Render with Staggered Entrance and Smooth Word & Character Level Crossfade */}
      <motion.span
        aria-hidden="true"
        className="inline"
        initial={animateEntrance ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
      >
        {words.map((word, wIdx) => (
          <span key={wIdx} className="inline-block whitespace-nowrap">
            {word.split("").map((char, cIdx) => (
              <motion.span
                key={cIdx}
                variants={animateEntrance ? charVariants : undefined}
                className="inline-grid grid-cols-1 grid-rows-1 justify-items-center items-center"
              >
                {/* Regular Layer (Fades Out on Hover) */}
                <span
                  className={`col-start-1 row-start-1 font-normal transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    active
                      ? "opacity-0"
                      : `opacity-100 ${hoverSelector}:opacity-0`
                  }`}
                >
                  {char}
                </span>

                {/* Bold Layer (Fades In on Hover) */}
                <span
                  className={`col-start-1 row-start-1 font-bold pointer-events-none transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    active
                      ? "opacity-100"
                      : `opacity-0 ${hoverSelector}:opacity-100`
                  }`}
                >
                  {char}
                </span>
              </motion.span>
            ))}
            {wIdx < words.length - 1 && (
              <span className="inline-block w-[0.28em]">&nbsp;</span>
            )}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
