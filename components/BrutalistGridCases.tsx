"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Play, X, Menu } from "lucide-react";

export interface BrutalistProject {
  id: number;
  title: string;
  client: string;
  year: string;
  duration: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  link: string;
}

export const BRUTALIST_PROJECTS: BrutalistProject[] = [
  {
    id: 1,
    title: "Turok - Cinematic Gameplay Trailer",
    client: "Universal / Saber",
    year: "2026",
    duration: "00:02:28",
    category: "Game Cinematics",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop",
    link: "/projects/type-racing-stadium",
  },
  {
    id: 2,
    title: "EWC - Esports World Cup Opener 2026",
    client: "Esports World Cup",
    year: "2026",
    duration: "00:01:45",
    category: "Broadcast Identity",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop",
    link: "/projects/super-smash-badminton",
  },
  {
    id: 3,
    title: "Battlefield 6 - Reveal Intro",
    client: "EA DICE",
    year: "2025",
    duration: "00:03:12",
    category: "Cinematic Reel",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1600&auto=format&fit=crop",
    link: "/projects/icy-goat",
  },
  {
    id: 4,
    title: "Cyberpunk: Orion - Teaser Reel",
    client: "CD PROJEKT RED",
    year: "2025",
    duration: "00:02:04",
    category: "Motion Identity",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
    link: "/projects/kabaabs",
  },
  {
    id: 5,
    title: "Type Racing Stadium Edition",
    client: "Personal Arcade",
    year: "2025",
    duration: "00:01:30",
    category: "Interactive Arcade",
    imageUrl: "/project/type_racing_stadium.png",
    videoUrl: "/project/Video/TypeRacing.mp4",
    link: "/projects/type-racing-stadium",
  },
  {
    id: 6,
    title: "Super Smash Badminton Arcade",
    client: "Canvas Physics Lab",
    year: "2025",
    duration: "00:02:15",
    category: "Web Physics Game",
    imageUrl: "/project/super_smash_badminton.png",
    link: "/projects/super-smash-badminton",
  },
  {
    id: 7,
    title: "SAP Master Data Governance (MDG)",
    client: "Enterprise S/4HANA",
    year: "2024",
    duration: "00:04:10",
    category: "System Architecture",
    imageUrl: "/project/landing-page-mdg.png",
    link: "/projects/sap-mdg",
  },
  {
    id: 8,
    title: "Death Stranding 2 - Visual Identity",
    client: "Kojima Productions",
    year: "2025",
    duration: "00:02:50",
    category: "Editorial Title Sequence",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    link: "/projects/movie-app",
  },
  {
    id: 9,
    title: "Phantom Liberty - Sound & Motion",
    client: "Militech Audio",
    year: "2024",
    duration: "00:01:58",
    category: "Sonic Architecture",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop",
    link: "/projects/smart-vending",
  },
];

interface BrutalistGridCasesProps {
  projects?: BrutalistProject[];
  brandName?: string;
}

export default function BrutalistGridCases({
  projects = BRUTALIST_PROJECTS,
  brandName = "NMBRS.",
}: BrutalistGridCasesProps) {
  const [activeProject, setActiveProject] = useState<BrutalistProject>(projects[0]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-[#000000] text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
      {/* =========================================================================
          1. DYNAMIC FULLSCREEN BACKGROUND (BACKGROUND SINEMATIK LAYAR PENUH)
          Crossfades smoothly & instantly on hover to active project visual
          ========================================================================= */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {activeProject.videoUrl ? (
              <video
                src={activeProject.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={activeProject.imageUrl}
                alt={activeProject.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            )}
            {/* Dark Brutalist Tint Overlay */}
            <div className="absolute inset-0 bg-[#000000]/75 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#000000]/40 to-[#000000]/90" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =========================================================================
          2. FIXED / STICKY MINIMALIST NAVBAR
          Kiri: Logo brand (rounded outline). Kanan: Tautan navigasi Menu
          ========================================================================= */}
      <header className="sticky top-0 z-40 w-full h-14 sm:h-16 bg-[#000000]/60 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="px-3 py-1 rounded-full border border-white/30 hover:border-white text-xs font-mono font-bold tracking-widest uppercase transition-colors duration-200"
          >
            {brandName}
          </Link>
          <span className="text-xs font-mono text-white/40 uppercase tracking-widest hidden sm:inline">
            Cases / 2026
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-white/50 hover:text-white px-2.5 py-1 transition-colors hidden sm:inline"
          >
            Portfolio
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-3.5 py-1 rounded-full border border-white/20 hover:border-white text-xs font-mono uppercase tracking-wider text-white transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <span>Menu</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 ml-0.5" />
          </button>
        </div>
      </header>

      {/* Menu Drawer Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-14 sm:top-16 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/20 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-white/40">
                Navigation
              </span>
              <div className="flex flex-wrap items-center gap-4 text-sm font-mono uppercase">
                <Link href="/" className="hover:text-neutral-400 transition-colors">
                  Home
                </Link>
                <span className="text-white/20">/</span>
                <Link href="/projects" className="text-white underline underline-offset-4">
                  Cases Grid
                </Link>
                <span className="text-white/20">/</span>
                <Link href="/#about" className="hover:text-neutral-400 transition-colors">
                  About
                </Link>
                <span className="text-white/20">/</span>
                <Link href="/#contact" className="hover:text-neutral-400 transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="text-xs font-mono uppercase text-white/50 hover:text-white flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          3. BRUTALIST EDITORIAL GRID (3 KOLOM DESKTOP, ZERO PADDING)
          - Grid lines: border-t border-l border-white/20 on container
          - Each cell: border-r border-b border-white/20, p-0 m-0
          - Zero padding: Text & elements touch borders directly
          ========================================================================= */}
      <main className="w-full">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/20">
          {projects.map((project, idx) => {
            const isHovered = hoveredId === project.id;

            return (
              <div
                key={project.id}
                onMouseEnter={() => {
                  setHoveredId(project.id);
                  setActiveProject(project);
                }}
                className="group relative p-0 m-0 border-r border-b border-white/20 min-h-[260px] sm:min-h-[290px] md:min-h-[310px] lg:h-[calc((100vh-64px)/3)] flex flex-col justify-between overflow-hidden transition-colors cursor-pointer select-none"
              >
                {/* -------------------------------------------------------------
                    FULL-BLEED BACKGROUND MEDIA ON HOVER (FLUSH TO ALL BORDERS)
                    Instant reveal without delay
                    ------------------------------------------------------------- */}
                <div
                  className={`absolute inset-0 w-full h-full p-0 m-0 transition-opacity duration-150 ease-out pointer-events-none ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {project.videoUrl ? (
                    <video
                      src={project.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover object-top p-0 m-0"
                    />
                  ) : (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top p-0 m-0"
                    />
                  )}
                  {/* Subtle Dark Vignette Inside Cell */}
                  <div className="absolute inset-0 bg-black/40 p-0 m-0" />
                </div>

                {/* -------------------------------------------------------------
                    TOP BAR: DURATION & YEAR (TOUCHING BORDER DIRECTLY)
                    Flush against top, left, right borders (p-0 m-0)
                    ------------------------------------------------------------- */}
                <div
                  className={`w-full p-0 m-0 border-b border-white/20 flex items-center justify-between text-xs font-mono transition-colors duration-150 z-10 ${
                    isHovered
                      ? "bg-black/90 text-white"
                      : "bg-transparent text-white/50"
                  }`}
                >
                  <div className="flex items-center gap-2 border-r border-white/20 px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    <span className="tracking-wider">{project.duration}</span>
                  </div>
                  <div className="px-3 py-2 tracking-wider">
                    <span>{project.year}</span>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    CENTER BODY: PROJECT TITLE (DISPLAY TEXT)
                    Semi-transparent by default, ultra-bold and clear on hover
                    ------------------------------------------------------------- */}
                <div className="flex-1 w-full flex flex-col justify-center px-4 py-6 z-10">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                      REF / {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/20 text-xs">/</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 truncate">
                      {project.client}
                    </span>
                  </div>

                  <h2
                    className={`p-0 m-0 text-xl sm:text-2xl lg:text-[26px] font-headline font-semibold tracking-[-0.02em] leading-tight transition-all duration-150 ${
                      isHovered
                        ? "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                        : "text-white/60 group-hover:text-white"
                    }`}
                  >
                    {project.title}
                  </h2>
                </div>

                {/* -------------------------------------------------------------
                    BOTTOM ACTION BAR: "VIEW CASE" (TOUCHING BOTTOM BORDER DIRECTLY)
                    Inverts to high contrast (solid white with black text) on hover!
                    ------------------------------------------------------------- */}
                <Link
                  href={project.link}
                  className={`w-full p-0 m-0 border-t border-white/20 flex items-center justify-between text-xs font-mono uppercase tracking-wider transition-all duration-150 z-10 ${
                    isHovered
                      ? "bg-white text-black font-bold"
                      : "bg-black/40 text-white/50 group-hover:text-white"
                  }`}
                >
                  <div className="px-3 py-2.5 flex items-center gap-2">
                    <Play className={`w-3 h-3 ${isHovered ? "fill-black text-black" : "text-white/60"}`} />
                    <span>View Case</span>
                  </div>
                  <div className="px-3 py-2.5 border-l border-white/20 flex items-center gap-1">
                    <span className="hidden sm:inline text-[11px] font-normal lowercase tracking-tight">
                      {project.category}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </main>

      {/* =========================================================================
          4. FOOTER INFORMASI BRUTALIST
          ========================================================================= */}
      <footer className="w-full border-t border-white/20 bg-black py-4 px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-white/40">
        <div className="flex items-center gap-3">
          <span className="text-white font-medium">NMBRS STUDIO ARCHIVE</span>
          <span>—</span>
          <span>BRUTALIST EDITORIAL TRANSPARENT GRID</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ALL RIGHTS RESERVED</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}

