"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, CornerDownRight } from "lucide-react";
import { PROJECTS_DATA, DANIEL_PROFILE } from "@/lib/data";

interface EditorialHeroProps {
  onExploreClick?: () => void;
  onProjectClick?: (id: string) => void;
}

export default function EditorialHero({
  onExploreClick,
  onProjectClick,
}: EditorialHeroProps) {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full border-b border-hairline dark:border-hairline-night text-ink dark:text-ink-night select-none"
    >
      {/* 1. Full-Bleed 12-Column Lead Headline Lock */}
      <div className="w-full px-4 sm:px-8 xl:px-16 pt-8 pb-10 border-b border-hairline dark:border-hairline-night overflow-hidden">
        
        {/* Kicker Tag Above Headline */}
        <div className="flex items-center justify-between pb-4 font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-ink-ghost dark:text-ink-ghost-night">
          <div className="flex items-center gap-2">
            <span className="text-vermilion font-bold">[ DISPATCH // LEAD STORY ]</span>
            <span>—</span>
            <span>SPECIAL BROADCAST ON DIGITAL INFRASTRUCTURE</span>
          </div>
          <div className="hidden md:block">
            <span>INDEX CODE: DK-2026-ARCH</span>
          </div>
        </div>

        {/* Massive 12-Column Wall-To-Wall Editorial Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <h1 className="text-broadsheet-hero font-display font-black tracking-[-0.045em] uppercase text-ink dark:text-ink-night hyphens-auto break-words">
            <span className="block">DIGITAL SYSTEMS,</span>
            <span className="block text-ink-ghost/85 dark:text-ink-ghost-night/85 hover:text-vermilion transition-colors duration-300">
              FORM &amp; TACTILE CODE.
            </span>
          </h1>
        </motion.div>

        {/* Sub-Headline Full-Width Hairline Annotation */}
        <div className="pt-6 mt-6 border-t border-hairline dark:border-hairline-night flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-ink-ghost dark:text-ink-ghost-night">
          <div>// ARCHITECTING INTUITIVE INTERFACES AND HIGH-THROUGHPUT WEB ENGINES</div>
          <div>EST. 2021 — 2026 MONOGRAPH // INDONESIA</div>
        </div>
      </div>

      {/* 2. Asymmetrical Multi-Column Newspaper Grid (Columns 1–4, 5–8, 9–12) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-hairline dark:divide-hairline-night">
        
        {/* COLUMNS 1–4: Editorial Deck (Lead Paragraph) & Manifest */}
        <div className="lg:col-span-4 p-6 sm:p-8 xl:p-10 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-vermilion font-bold">
              <span>( THE EDITORIAL DECK )</span>
            </div>

            <h2 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl tracking-tight leading-[1.1] text-ink dark:text-ink-night">
              Engineering clarity across complex digital domains through deliberate typography and systemic rigor.
            </h2>

            {/* Classic Editorial Drop-Cap Paragraph */}
            <p className="editorial-drop-cap font-sans text-sm sm:text-base leading-relaxed text-ink-ghost dark:text-ink-ghost-night">
              Based in Indonesia, Daniel Kurnia is a digital architect and full-stack software engineer operating at the convergence of high-performance backend systems, reactive web interfaces, and uncompromising visual discipline. Every digital artifact produced under <strong className="text-ink dark:text-ink-night font-bold">dlabsign.ID</strong> is built to eliminate cognitive clutter, prioritize tactile responsiveness, and withstand the erosion of short-lived trends.
            </p>
          </div>

          {/* Editorial Specification Box */}
          <div className="pt-6 border-t border-hairline dark:border-hairline-night space-y-3 font-mono text-[11px] uppercase tracking-wider text-ink-ghost dark:text-ink-ghost-night">
            <div className="flex justify-between py-1 border-b border-hairline/40 dark:border-hairline-night/40">
              <span>LEAD CREATOR</span>
              <span className="text-ink dark:text-ink-night font-bold">DANIEL KURNIA</span>
            </div>
            <div className="flex justify-between py-1 border-b border-hairline/40 dark:border-hairline-night/40">
              <span>PRIMARY DOMAIN</span>
              <span className="text-ink dark:text-ink-night">FULL-STACK &amp; UI ARCHITECTURE</span>
            </div>
            <div className="flex justify-between py-1 border-b border-hairline/40 dark:border-hairline-night/40">
              <span>JURISDICTION</span>
              <span className="text-ink dark:text-ink-night">INDONESIA / GLOBAL REMOTE</span>
            </div>
            <div className="flex justify-between py-1">
              <span>CURRENT STATUS</span>
              <span className="text-vermilion font-bold">OPEN FOR COLLABORATION</span>
            </div>
          </div>
        </div>

        {/* COLUMNS 5–8: Large Center Photography Plate (FIG. 01) */}
        <div className="lg:col-span-4 p-6 sm:p-8 xl:p-10 flex flex-col justify-between space-y-4 bg-paper-card/40 dark:bg-paper-card-night/40">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-ghost dark:text-ink-ghost-night pb-2">
            <span>[ ARCHIVAL PLATE // FIG. 01 ]</span>
            <span>DOCUMENTARY PHOTOGRAPHY</span>
          </div>

          {/* Central Framed Photography Container */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden border border-hairline dark:border-hairline-night bg-paper dark:bg-paper-night">
            <Image
              src="/avatar.png"
              alt="Daniel Kurnia Portrait"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top grayscale contrast-125 hover:grayscale-0 transition-all duration-700 ease-out"
              priority
            />
            {/* Corner Alignment Crosshairs */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-ink/70 dark:text-ink-night/70 select-none">
              +
            </div>
            <div className="absolute top-2 right-2 text-[10px] font-mono text-ink/70 dark:text-ink-night/70 select-none">
              +
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-ink/70 dark:text-ink-night/70 select-none">
              +
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-ink/70 dark:text-ink-night/70 select-none">
              +
            </div>
          </div>

          {/* Formal Museum Caption Beneath Plate */}
          <figcaption className="pt-2 font-mono text-[10px] sm:text-[11px] text-ink-ghost dark:text-ink-ghost-night leading-relaxed tracking-wider uppercase">
            <span className="text-ink dark:text-ink-night font-bold">FIG. 01:</span> DANIEL KURNIA, DIGITAL ARCHITECT &amp; SOFTWARE ENGINEER. PHOTOGRAPHED IN STUDIO ENVIRONMENT, 2026. SERVING CLIENTS ACROSS F&amp;B, APPAREL, AND ENTERPRISE DOMAINS.
          </figcaption>
        </div>

        {/* COLUMNS 9–12: Numeric Index of Featured Dispatches */}
        <div className="lg:col-span-4 p-6 sm:p-8 xl:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-ghost dark:text-ink-ghost-night pb-2 border-b border-hairline dark:border-hairline-night">
              <span className="text-vermilion font-bold">[ TABLE OF CONTENTS ]</span>
              <span>FOUR KEY DISPATCHES</span>
            </div>

            <p className="font-mono text-[11px] text-ink-ghost dark:text-ink-ghost-night uppercase tracking-wider">
              Selected production case studies engineered between 2021 and 2026:
            </p>

            {/* List of 4 Projects with Quick Navigation */}
            <div className="divide-y divide-hairline dark:divide-hairline-night">
              {PROJECTS_DATA.map((project, idx) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => handleScrollTo(`project-${project.id}`)}
                  className="w-full text-left py-4 group flex items-start justify-between gap-3 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-vermilion font-bold tracking-widest">
                      <span>[{project.number}]</span>
                      <span className="text-ink-ghost dark:text-ink-ghost-night uppercase">
                        {project.category}
                      </span>
                    </div>
                    <div className="font-display font-bold text-lg sm:text-xl text-ink dark:text-ink-night group-hover:text-vermilion transition-colors">
                      {project.title}
                    </div>
                    <div className="font-sans text-xs text-ink-ghost dark:text-ink-ghost-night line-clamp-1">
                      {project.summary}
                    </div>
                  </div>

                  <div className="pt-2 font-mono text-xs text-ink-ghost dark:text-ink-ghost-night group-hover:text-ink dark:group-hover:text-ink-night group-hover:translate-x-1 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Jump to Full Archive Action */}
          <div className="pt-6 border-t border-hairline dark:border-hairline-night">
            <button
              type="button"
              onClick={() => handleScrollTo("catalog")}
              className="w-full py-3 px-4 border border-hairline dark:border-hairline-night hover:border-ink dark:hover:border-ink-night hover:bg-ink hover:text-paper dark:hover:bg-ink-night dark:hover:text-paper-night transition-all font-mono text-xs uppercase tracking-[0.18em] flex items-center justify-between group cursor-pointer"
            >
              <span>ACCESS COMPLETE CATALOG INDEX</span>
              <CornerDownRight className="w-4 h-4 text-vermilion group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>

    </section>
  );
}
