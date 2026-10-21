"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Filter, Eye } from "lucide-react";
import { PROJECTS_DATA, Project } from "@/lib/data";

interface ExtendedIndexItem extends Project {
  status: string;
  clientName: string;
  scope: string;
}

export default function EditorialIndex() {
  const [activeProject, setActiveProject] = useState<ExtendedIndexItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse coordinates for floating preview card
  const mouseX = useSpring(0, { stiffness: 240, damping: 28 });
  const mouseY = useSpring(0, { stiffness: 240, damping: 28 });

  const catalogEntries: ExtendedIndexItem[] = [
    {
      ...PROJECTS_DATA[0],
      clientName: "Kabaabs F&B",
      scope: "Full-Stack Web App, Cart Engine, Brand Experience",
      status: "PRODUCTION / LIVE",
    },
    {
      ...PROJECTS_DATA[1],
      clientName: "ICY GOAT Apparel",
      scope: "Editorial Lookbook, Brutalist Commerce, Motion",
      status: "PRODUCTION / LIVE",
    },
    {
      ...PROJECTS_DATA[2],
      clientName: "Kedai Nihao",
      scope: "UI/UX Design System, Digital Menu Platform",
      status: "ARCHIVE / CASE",
    },
    {
      ...PROJECTS_DATA[3],
      clientName: "JKS Sidoarjo",
      scope: "Regional Organization Portal, Relational MySQL",
      status: "ARCHIVE / CASE",
    },
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    // Offset card so it floats slightly above and to the right of cursor
    mouseX.set(e.clientX + 24);
    mouseY.set(e.clientY - 90);
  };

  const filteredEntries =
    filterCategory === "ALL"
      ? catalogEntries
      : catalogEntries.filter((item) =>
          item.category.toLowerCase().includes(filterCategory.toLowerCase())
        );

  return (
    <section
      id="catalog"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full border-b border-hairline dark:border-hairline-night bg-paper dark:bg-paper-night text-ink dark:text-ink-night select-none py-16 sm:py-24 px-4 sm:px-8 xl:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Department Title & Index Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-hairline dark:border-hairline-night">
          <div>
            <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.24em] text-vermilion font-bold pb-2 flex items-center gap-2">
              <span>[ SECTION III // THE CATALOG INDEX ]</span>
              <span>•</span>
              <span>LINE-BY-LINE REPERTORY</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-[-0.04em] uppercase text-ink dark:text-ink-night">
              Directory &amp; Index
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider">
            <span className="text-ink-ghost dark:text-ink-ghost-night mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> FILTER:
            </span>
            {["ALL", "DEVELOPMENT", "DESIGN", "PLATFORM"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 border transition-all rounded-sm cursor-pointer ${
                  filterCategory === cat
                    ? "border-ink dark:border-ink-night bg-ink text-paper dark:bg-ink-night dark:text-paper-night font-bold"
                    : "border-hairline dark:border-hairline-night text-ink-ghost dark:text-ink-ghost-night hover:border-ink dark:hover:border-ink-night"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Informational Guidance Tag */}
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-ink-ghost dark:text-ink-ghost-night">
          <div>[HOVER ANY RECORD TO TRIGGER FLOATING VISUAL PREVIEW]</div>
          <div>TOTAL CATALOGED: {filteredEntries.length} ARTIFACTS</div>
        </div>

        {/* Minimalist Line-by-Line Table Architecture */}
        <div className="w-full border-t border-b border-hairline dark:border-hairline-night divide-y divide-hairline dark:divide-hairline-night">
          
          {/* Table Header Row */}
          <div className="hidden md:grid grid-cols-12 py-3 px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-ghost dark:text-ink-ghost-night bg-paper-card/40 dark:bg-paper-card-night/40">
            <div className="col-span-1">INDEX</div>
            <div className="col-span-3">PROJECT TITLE</div>
            <div className="col-span-3">DISCIPLINE / SCOPE</div>
            <div className="col-span-2">CLIENT</div>
            <div className="col-span-1 text-center">YEAR</div>
            <div className="col-span-2 text-right">ACTION</div>
          </div>

          {/* Table Body Rows */}
          {filteredEntries.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveProject(item)}
              onMouseLeave={() => setActiveProject(null)}
              className="relative group transition-colors duration-150 hover:bg-paper-card/60 dark:hover:bg-paper-card-night/60"
            >
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="grid grid-cols-1 md:grid-cols-12 py-5 sm:py-6 px-4 items-center gap-2 md:gap-0 cursor-pointer"
              >
                {/* 1. Index No. */}
                <div className="md:col-span-1 font-mono text-xs text-vermilion font-bold tracking-widest">
                  [{item.number}]
                </div>

                {/* 2. Project Title (With fluid italic serif shift on hover!) */}
                <div className="md:col-span-3">
                  <span className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-ink-night group-hover:italic group-hover:font-serif group-hover:text-vermilion transition-all duration-200">
                    {item.title}
                  </span>
                  <div className="md:hidden text-[10px] font-mono text-ink-ghost dark:text-ink-ghost-night uppercase pt-0.5">
                    {item.category} • {item.year}
                  </div>
                </div>

                {/* 3. Discipline & Scope */}
                <div className="hidden md:block md:col-span-3 font-mono text-xs text-ink-ghost dark:text-ink-ghost-night uppercase tracking-wider line-clamp-1 pr-4">
                  {item.scope}
                </div>

                {/* 4. Client / Patron */}
                <div className="hidden md:block md:col-span-2 font-mono text-xs text-ink dark:text-ink-night uppercase tracking-wider">
                  {item.clientName}
                </div>

                {/* 5. Year */}
                <div className="hidden md:block md:col-span-1 text-center font-mono text-xs text-ink-ghost dark:text-ink-ghost-night font-bold">
                  {item.year}
                </div>

                {/* 6. Action Button */}
                <div className="md:col-span-2 flex items-center justify-end gap-2 font-mono text-xs text-ink-ghost dark:text-ink-ghost-night group-hover:text-ink dark:group-hover:text-ink-night uppercase tracking-wider">
                  <span className="hidden sm:inline">[ INSPECT ]</span>
                  <ArrowUpRight className="w-4 h-4 text-vermilion group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            </div>
          ))}

        </div>

        {/* Bottom Catalog Verification Note */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-ink-ghost dark:text-ink-ghost-night">
          <div>// MONOGRAPH COMPENDIUM CERTIFIED COMPLETE</div>
          <div>INDEPENDENT COMMISSIONS EXCLUSIVELY UNDER DLABSIGN.ID</div>
        </div>

      </div>

      {/* Floating Cursor Media Preview Card (Cursor Parallax) */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              left: mouseX,
              top: mouseY,
            }}
            className="fixed pointer-events-none z-50 hidden lg:block w-72 p-2 bg-paper dark:bg-paper-night border border-hairline dark:border-hairline-night shadow-editorial-float rounded-sm select-none"
          >
            {/* Thumbnail Image */}
            <div className="relative w-full h-44 overflow-hidden border border-hairline dark:border-hairline-night bg-neutral-900">
              <Image
                src={activeProject.image}
                alt={activeProject.title}
                fill
                sizes="300px"
                className="object-cover object-center grayscale contrast-125"
              />
              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-paper/90 dark:bg-paper-night/90 text-[8px] font-mono uppercase tracking-widest text-ink dark:text-ink-night">
                {activeProject.number} // {activeProject.year}
              </div>
            </div>

            {/* Micro Caption */}
            <div className="pt-2 px-1 font-mono text-[10px] uppercase tracking-wider text-ink dark:text-ink-night flex justify-between items-center">
              <span className="font-bold">{activeProject.title}</span>
              <span className="text-vermilion text-[9px]">{activeProject.status}</span>
            </div>
            <div className="px-1 font-sans text-[11px] text-ink-ghost dark:text-ink-ghost-night line-clamp-1">
              {activeProject.summary}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
