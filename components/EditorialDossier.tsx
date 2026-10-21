"use client";

import React from "react";
import { SKILLS_CATEGORIES } from "@/lib/data";

export default function EditorialDossier() {
  // Flatten all skills for horizontal infinite ticker tape
  const allSkills = SKILLS_CATEGORIES.flatMap((cat) => cat.items);
  const marqueeItems = [...allSkills, ...allSkills];

  return (
    <section
      id="dossier"
      className="relative w-full border-b border-hairline dark:border-hairline-night bg-paper dark:bg-paper-night text-ink dark:text-ink-night select-none"
    >
      {/* 1. Department Header */}
      <div className="w-full px-4 sm:px-8 xl:px-16 py-8 border-b border-hairline dark:border-hairline-night flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.24em] text-vermilion font-bold pb-2 flex items-center gap-2">
            <span>[ SECTION IV // TECHNICAL DOSSIER ]</span>
            <span>•</span>
            <span>COMPREHENSIVE CAPABILITIES MANIFEST</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-[-0.04em] uppercase text-ink dark:text-ink-night">
            Technical Dossier
          </h2>
        </div>

        <div className="font-mono text-xs uppercase tracking-widest text-ink-ghost dark:text-ink-ghost-night text-left md:text-right">
          <div>TOTAL RECORDED PROFICIENCIES: 35 TOOLS</div>
          <div className="text-[10px] text-vermilion">CONTINUOUS LIFELONG SYSTEM LEARNING</div>
        </div>
      </div>

      {/* 2. Structured 6-Department Broadsheet Grid Separated by Hairline Rules */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 divide-hairline dark:divide-hairline-night border-b border-hairline dark:border-hairline-night">
        {SKILLS_CATEGORIES.map((category, idx) => {
          // Map codes to Section letters
          const sectionLetter = String.fromCharCode(65 + idx);

          return (
            <div
              key={category.code}
              className={`p-6 sm:p-8 space-y-6 flex flex-col justify-between ${
                idx % 3 !== 2 ? "lg:border-r border-hairline dark:border-hairline-night" : ""
              } ${idx % 2 !== 1 ? "md:border-r lg:border-r-0 border-hairline dark:border-hairline-night" : ""} ${
                idx < 3 ? "lg:border-b border-hairline dark:border-hairline-night" : ""
              } ${idx < 4 ? "md:border-b lg:border-b-0 border-hairline dark:border-hairline-night" : ""}`}
            >
              {/* Category Header with Monospace Archival Label */}
              <div className="space-y-2 pb-4 border-b border-hairline dark:border-hairline-night">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-ghost dark:text-ink-ghost-night">
                  <span className="text-vermilion font-bold">[SECTION {sectionLetter}]</span>
                  <span>CAT. REF: {category.code}</span>
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl uppercase tracking-tight text-ink dark:text-ink-night">
                  {category.category}
                </h3>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-ghost dark:text-ink-ghost-night">
                  SUB-CLASSIFICATION: {category.sub}
                </div>
              </div>

              {/* Items List as Clean Typographic Badges with Monochrome Icons */}
              <div className="space-y-2.5 flex-1 pt-2">
                {category.items.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between py-1.5 px-2.5 rounded-sm hover:bg-paper-card/70 dark:hover:bg-paper-card-night/70 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {/* Monochrome Solid Icon */}
                      <div className="w-4 h-4 shrink-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={skill.icon}
                          alt=""
                          aria-hidden="true"
                          className="w-full h-full object-contain filter brightness-0 dark:invert transition-all"
                          loading="lazy"
                        />
                      </div>
                      <span className="font-sans text-xs sm:text-sm font-medium tracking-tight text-ink dark:text-ink-night group-hover:text-vermilion transition-colors lowercase">
                        {skill.name}
                      </span>
                    </div>

                    <span className="font-mono text-[9px] uppercase tracking-widest text-ink-ghost/60 dark:text-ink-ghost-night/60 group-hover:text-ink dark:group-hover:text-ink-night">
                      [VERIFIED]
                    </span>
                  </div>
                ))}
              </div>

              {/* Department Footnote */}
              <div className="pt-4 border-t border-hairline dark:border-hairline-night font-mono text-[9px] uppercase tracking-[0.18em] text-ink-ghost dark:text-ink-ghost-night flex justify-between">
                <span>INDEXED ITEMS: {category.items.length}</span>
                <span className="text-vermilion">ACTIVE REPERTOIRE</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Kinetic Marquee Ticker Tape Running Across Broadsheet */}
      <div className="w-full overflow-hidden py-4 border-b border-hairline dark:border-hairline-night bg-paper-card/30 dark:bg-paper-card-night/30">
        <div className="animate-marquee-track flex items-center">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center gap-3 shrink-0 px-6 select-none cursor-default group"
            >
              <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center opacity-60 group-hover:opacity-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.icon}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-contain filter brightness-0 dark:invert"
                  loading="lazy"
                />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-ink-ghost dark:text-ink-ghost-night group-hover:text-vermilion transition-colors font-medium">
                {item.name}
              </span>
              <span className="text-vermilion text-xs ml-4" aria-hidden="true">
                •
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
