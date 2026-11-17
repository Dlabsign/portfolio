"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { DETAILED_PROJECTS, DetailedProject } from "@/lib/projects-data";
import Navbar from "@/components/Navbar";
import SmoothWeightText from "@/components/SmoothWeightText";

export default function BrutalistTransparentGrid() {
  const [hoveredProject, setHoveredProject] = useState<DetailedProject | null>(null);

  // 3-column grid calculation:
  // Calculate empty filler slots so the 3-column brutalist grid lines complete cleanly across the row
  const remainder = DETAILED_PROJECTS.length % 3;
  const emptySlots = remainder === 0 ? 0 : 3 - remainder;

  return (
    <div
      onMouseLeave={() => setHoveredProject(null)}
      className="relative w-full min-h-screen bg-[#000000] text-[#fafafa] font-sans overflow-x-hidden select-none"
    >
      {/* =========================================================================
          0. TOP LEFT BACK NAVIGATION ARROW BUTTON
          ========================================================================= */}
      <Link
        href="/"
        aria-label="Back to home"
        className="fixed top-5 left-5 sm:top-6 sm:left-6 z-50 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0d0d0d]/80 hover:bg-[#141414] border border-[#262626] hover:border-[#fafafa] text-[#fafafa] backdrop-blur-md transition-all duration-300 group shadow-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-[#fafafa]"
      >
        <ArrowLeft className="w-4 h-4 text-[#fafafa]/80 group-hover:text-[#fafafa] transform group-hover:-translate-x-0.5 transition-all duration-300" />
      </Link>

      {/* =========================================================================
          1. FULLSCREEN HOVER OVERLAY (100vw × 100vh) - DARK CINEMATIC OVERLAY
          Appears instantly when a project cell is hovered, displaying that project's
          visual (image or video) with dark charcoal/black shading.
          ========================================================================= */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <AnimatePresence mode="popLayout">
          {hoveredProject && (
            <motion.div
              key={hoveredProject.id}
              initial={{ opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.015 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {hoveredProject.heroVideo ? (
                <video
                  src={hoveredProject.heroVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover p-0 m-0"
                />
              ) : (
                <Image
                  src={hoveredProject.heroImage}
                  alt={hoveredProject.title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover p-0 m-0"
                />
              )}
              {/* Deep charcoal black overlay tint for refined contrast without glare */}
              <div className="absolute inset-0 bg-[#000000]/65 backdrop-blur-[1px] p-0 m-0" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================================
          2. BRUTALIST EDITORIAL GRID (CONSISTENT 3-COLUMN LAYOUT)
          - CSS Grid: strictly 3 columns on tablet and desktop
          - Grid lines: border-t border-l border-[#262626]
          - Each cell: border-r border-b border-[#262626], p-0 m-0
          - Zero padding: Content touches borders directly
          ========================================================================= */}
      <main className="relative z-10 w-full min-h-screen p-0 m-0 pb-10 md:pb-12">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#262626] p-0 m-0">
          {DETAILED_PROJECTS.map((project) => {
            const isHovered = hoveredProject?.id === project.id;
            const isAnyHovered = hoveredProject !== null;
            const isDimmed = isAnyHovered && !isHovered;

            return (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredProject(project)}
                className="group relative w-full min-h-[200px] md:min-h-[33.333vh] border-r border-b border-[#262626] p-0 m-0 flex items-center justify-center overflow-hidden cursor-pointer bg-transparent transition-colors"
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="relative w-full h-full flex items-center justify-center p-0 m-0 text-decoration-none focus:outline-none"
                >
                  {/* Refined, Minimalist Project Title in Bright #fafafa */}
                  <div className="relative z-10 w-full p-0 m-0 flex items-center justify-center pointer-events-none px-6">
                    <h2
                      className={`p-0 m-0 text-center font-headline text-sm sm:text-base md:text-lg lg:text-xl tracking-tight leading-snug transition-all duration-300 max-w-[85%] ${
                        isDimmed
                          ? "text-[#fafafa]/30"
                          : "text-[#fafafa]"
                      }`}
                    >
                      <SmoothWeightText active={isHovered}>
                        {project.title}
                      </SmoothWeightText>
                    </h2>
                  </div>
                </Link>
              </div>
            );
          })}

          {/* Empty filler cells so the 3-column brutalist grid lines complete cleanly */}
          {Array.from({ length: emptySlots }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="relative w-full min-h-[200px] md:min-h-[33.333vh] border-r border-b border-[#262626] p-0 m-0 hidden md:block bg-transparent pointer-events-none"
            />
          ))}
        </div>
      </main>

      {/* Floating Dynamic Island Dock Navigation */}
      <Navbar />
    </div>
  );
}
