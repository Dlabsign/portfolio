"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { DETAILED_PROJECTS } from "@/lib/projects-data";

export interface CaseItem {
  id: string;
  title: string;
  client: string;
  category: string;
  categoryKey?: string;
  year: string;
  heroImage: string;
  heroVideo?: string;
  link?: string;
}

interface CasesPortfolioProps {
  items?: CaseItem[];
  title?: string;
  subtitle?: string;
  lang?: "EN" | "ID";
  showControls?: boolean;
}

export default function CasesPortfolio({
  items,
  title,
  subtitle,
  lang = "EN",
  showControls = true,
}: CasesPortfolioProps) {
  // Default data from DETAILED_PROJECTS
  const defaultItems: CaseItem[] = DETAILED_PROJECTS.map((p) => ({
    id: p.id,
    title: p.title,
    client: p.client,
    category:
      p.categoryKey === "website"
        ? "Website"
        : lang === "EN"
        ? "Graphic Design"
        : "Desain Grafis",
    categoryKey: p.categoryKey,
    year: p.year,
    heroImage: p.heroImage,
    heroVideo: p.heroVideo,
    link: `/projects/${p.id}`,
  }));

  const allProjects = items || defaultItems;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredProject, setHoveredProject] = useState<CaseItem | null>(null);

  // Smooth lerp / spring physics coordinates for cursor follower
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 24, stiffness: 220, mass: 0.45 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Track cursor position window-wide so it's always ready with zero pop-in delay
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleWindowMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, [mouseX, mouseY]);

  // Category counts
  const categoryCounts = {
    all: allProjects.length,
    website: allProjects.filter((p) => p.categoryKey === "website").length,
    "graphic-design": allProjects.filter((p) => p.categoryKey === "graphic-design").length,
  };

  // Filtered projects
  const filteredCases = allProjects.filter((project) => {
    // Category filter
    if (selectedCategory !== "all" && project.categoryKey !== selectedCategory) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = project.title.toLowerCase().includes(q);
      const matchClient = project.client.toLowerCase().includes(q);
      const matchCategory = project.category.toLowerCase().includes(q);
      const matchYear = project.year.toLowerCase().includes(q);
      return matchTitle || matchClient || matchCategory || matchYear;
    }
    return true;
  });

  const isAnyHovered = hoveredProject !== null;

  return (
    <section
      onMouseLeave={() => setHoveredProject(null)}
      className="relative w-full min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black py-16 sm:py-20 md:py-28 overflow-hidden transition-colors"
      style={{ fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* =========================================================================
          1. FLOATING MEDIA PREVIEW (CURSOR FOLLOWER)
          Desktop only, fixed position, lerp spring physics, pure monochromatic
          ========================================================================= */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block select-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <AnimatePresence>
          {hoveredProject && (
            <motion.div
              key="floating-preview-container"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-72 md:w-80 h-44 md:h-48 rounded-sm overflow-hidden bg-[#111111] border border-white/15 shadow-[0_24px_50px_rgba(0,0,0,0.85)]"
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={hoveredProject.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  {hoveredProject.heroVideo ? (
                    <video
                      src={hoveredProject.heroVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <Image
                      src={hoveredProject.heroImage}
                      alt={hoveredProject.title}
                      fill
                      sizes="320px"
                      priority
                      className="object-cover object-top"
                    />
                  )}
                  {/* Subtle Scandinavian film vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

                  {/* Micro Metadata Indicator on Preview */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white/90 text-xs">
                    <span className="font-mono text-[11px] text-white/60 tracking-wider">
                      {hoveredProject.year}
                    </span>
                    <span className="text-[11px] font-normal uppercase tracking-wider text-white/70">
                      {hoveredProject.category}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* =========================================================================
          2. FULL-WIDTH SCANDINAVIAN INDEX CONTAINER
          Edge-to-edge padding (px-6 md:px-12)
          ========================================================================= */}
      <div className="w-full px-6 md:px-12">
        {/* Section Header */}
        <div className="pb-8 md:pb-12 border-b border-white/10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
                {lang === "EN" ? "Cases / Index" : "Koleksi / Indeks"}
              </span>
              <span className="text-white/20">/</span>
              <span className="text-xs font-mono text-neutral-400">
                ({filteredCases.length.toString().padStart(2, "0")})
              </span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.03em] text-white">
              {title || (lang === "EN" ? "Selected Cases" : "Koleksi Proyek")}
            </h1>
            <p className="mt-2 text-sm md:text-base text-neutral-400 max-w-xl leading-relaxed">
              {subtitle ||
                (lang === "EN"
                  ? "Index of architectural web applications, interactive media, and digital design systems."
                  : "Indeks sistem aplikasi web interaktif, media digital, dan rekayasa antarmuka.")}
            </p>
          </div>

          {/* Monochromatic Scandinavian Controls: Category Filters & Search */}
          {showControls && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Category Segmented Control */}
              <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/10 rounded-full self-start sm:self-auto">
                {[
                  { key: "all", label: lang === "EN" ? "All" : "Semua", count: categoryCounts.all },
                  { key: "website", label: "Website", count: categoryCounts.website },
                  { key: "graphic-design", label: lang === "EN" ? "Graphic" : "Grafis", count: categoryCounts["graphic-design"] },
                ].map((cat) => {
                  const isActive = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                        isActive
                          ? "bg-white text-black font-semibold shadow-xs"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[10px] ${isActive ? "text-neutral-700" : "text-neutral-500"}`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Minimalist Monochromatic Search Input */}
              <div className="relative w-full sm:w-48 md:w-56">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === "EN" ? "Search cases..." : "Cari karya..."}
                  className="w-full pl-8 pr-3 py-1.5 bg-white/[0.04] border border-white/10 focus:border-white rounded-full text-xs text-white placeholder:text-neutral-500 outline-none transition-colors duration-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Column Headers (Subtle Editorial Table Indicator) */}
        <div className="py-4 border-b border-white/10 hidden md:flex items-baseline justify-between text-xs font-mono uppercase tracking-wider text-neutral-400">
          <span>{lang === "EN" ? "Project / Case Study" : "Proyek / Studi Kasus"}</span>
          <div className="flex items-center gap-8 lg:gap-16 text-right">
            <span className="w-36 lg:w-44 text-left">{lang === "EN" ? "Client" : "Klien"}</span>
            <span className="w-28 lg:w-36 text-left">{lang === "EN" ? "Discipline" : "Kategori"}</span>
            <span className="w-16 text-right">{lang === "EN" ? "Year" : "Tahun"}</span>
            <span className="w-4"></span>
          </div>
        </div>

        {/* =========================================================================
            3. FULL-WIDTH LIST ITEM ROWS
            Divider: border-b border-white/10
            Padding baris: py-6 md:py-8
            Hover: Title translates +8px, hovered row white, other rows dimmed
            ========================================================================= */}
        <div className="divide-y divide-white/10">
          {filteredCases.length === 0 ? (
            <div className="py-20 text-center text-neutral-500 font-mono text-xs uppercase tracking-wider">
              {lang === "EN" ? "No cases match your filter." : "Tidak ada karya yang sesuai filter."}
            </div>
          ) : (
            filteredCases.map((project) => {
              const isCurrentHovered = hoveredProject?.id === project.id;
              const isDimmed = isAnyHovered && !isCurrentHovered;

              return (
                <motion.div
                  key={project.id}
                  onMouseEnter={() => setHoveredProject(project)}
                  animate={{
                    opacity: isDimmed ? 0.35 : 1,
                  }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="group relative"
                >
                  <Link
                    href={project.link || `/projects/${project.id}`}
                    data-cursor-interactive="true"
                    className="block py-6 md:py-8 focus:outline-none focus-visible:ring-1 focus-visible:ring-white transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 md:gap-8">
                      {/* Sisi Kiri: Judul Proyek (Display Text) dengan geser +8px saat di-hover */}
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                        {/* Mobile Inline Thumbnail Preview (Touch / Non-hover fallback) */}
                        <div className="relative w-14 h-10 aspect-[16/10] rounded-xs overflow-hidden bg-neutral-900 border border-white/10 shrink-0 md:hidden">
                          {project.heroVideo ? (
                            <video
                              src={project.heroVideo}
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={project.heroImage}
                              alt={project.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          )}
                        </div>

                        {/* Judul: clamp(1.5rem, 2.5vw, 2.25rem), weight 500, tight tracking -0.02em */}
                        <motion.h2
                          animate={{
                            x: isCurrentHovered ? 8 : 0,
                            color: isCurrentHovered ? "#ffffff" : isDimmed ? "#737373" : "#ffffff",
                          }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium tracking-[-0.02em] leading-tight transition-colors line-clamp-1"
                        >
                          {project.title}
                        </motion.h2>
                      </div>

                      {/* Sisi Kanan: Metadata Klien / Kategori / Tahun (text-sm, text-neutral-400) */}
                      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-8 lg:gap-16 text-sm text-neutral-400 font-normal shrink-0 pt-1 md:pt-0 pl-17 md:pl-0">
                        <span className="w-auto md:w-36 lg:w-44 text-left truncate text-neutral-400 group-hover:text-neutral-200 transition-colors">
                          {project.client}
                        </span>

                        <span className="hidden md:inline-block w-28 lg:w-36 text-left text-neutral-400 group-hover:text-neutral-200 transition-colors">
                          {project.category}
                        </span>

                        <span className="font-mono text-xs md:text-sm text-neutral-400 group-hover:text-white transition-colors w-auto md:w-16 text-right">
                          {project.year}
                        </span>

                        <div className="w-5 flex items-center justify-end">
                          <ArrowUpRight
                            className={`w-4 h-4 transition-all duration-300 ${
                              isCurrentHovered
                                ? "text-white translate-x-1 -translate-y-1 opacity-100"
                                : "text-neutral-500 opacity-40 group-hover:opacity-100 group-hover:text-white"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Bottom Scandinavian Minimalist Sub-Bar */}
        <div className="pt-12 md:pt-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400 uppercase tracking-wider">
          <span>Scandinavian Minimalist Monochromatic Editorial</span>
          <span>© Daniel Kurnia — Portfolio Archive</span>
        </div>
      </div>
    </section>
  );
}
