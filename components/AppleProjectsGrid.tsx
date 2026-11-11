"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DETAILED_PROJECTS } from "@/lib/projects-data";
import Navbar from "@/components/Navbar";

export default function AppleProjectsGrid() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      {/* =========================================================================
          APPLE MINIMALIST HEADER
          No toggle buttons. Pure content-first navigation.
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#000000]/80 backdrop-blur-xl border-b border-white/[0.08] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Left: Back to Home */}
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span>{lang === "EN" ? "Portfolio" : "Beranda"}</span>
          </Link>

          {/* Center: Title & Count */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium tracking-tight text-white uppercase">
              {lang === "EN" ? "Selected Work" : "Koleksi Karya"}
            </span>
            <span className="text-xs font-mono text-neutral-400">
              ({DETAILED_PROJECTS.length})
            </span>
          </div>

          {/* Right: Language Switcher */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setLang("ID")}
              className={`px-2 py-1 rounded transition-colors duration-200 ${
                lang === "ID"
                  ? "bg-white text-black font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              ID
            </button>
            <span className="text-white/20">|</span>
            <button
              type="button"
              onClick={() => setLang("EN")}
              className={`px-2 py-1 rounded transition-colors duration-200 ${
                lang === "EN"
                  ? "bg-white text-black font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          APPLE MINIMALIST VISUAL MEDIA GRID (3 COLUMNS DESKTOP)
          Pure project visual focus. Zero timers, zero inner boxes.
          ========================================================================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {DETAILED_PROJECTS.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: idx * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={`/projects/${project.id}`}
                data-cursor-interactive="true"
                className="group relative block w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#111111] border border-white/[0.08] hover:border-white/30 transition-all duration-500 shadow-2xs hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {/* Visual Media: Animated Video for Type Racing or Pristine Hero Image */}
                {project.heroVideo ? (
                  <video
                    src={project.heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={idx < 3}
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                )}

                {/* Subtle Apple Cinema Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                {/* Bottom Title Bar: Clean, calm typography with subtle interaction */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-center justify-between text-white pointer-events-none z-10">
                  <h2 className="p-0 m-0 text-sm sm:text-[15px] font-medium tracking-tight text-white/90 group-hover:text-white transition-colors duration-200 line-clamp-1">
                    {project.title}
                  </h2>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0 ml-2" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      {/* =========================================================================
          APPLE MINIMALIST FOOTER
          ========================================================================= */}
      <footer className="w-full border-t border-white/[0.08] bg-[#000000] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2 group">
            <span className="font-medium text-neutral-400 group-hover:text-white transition-colors duration-200">
              Daniel Kurnia
            </span>
            <span>—</span>
            <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors duration-200">
              dlabsign.ID
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/#contact"
              className="text-neutral-400 hover:text-white transition-colors duration-200"
            >
              {lang === "EN" ? "Get in touch" : "Hubungi saya"}
            </Link>
            <Link
              href="/"
              className="text-neutral-400 hover:text-white transition-colors duration-200"
            >
              {lang === "EN" ? "Back to Homepage" : "Kembali ke Beranda"}
            </Link>
          </div>
        </div>
      </footer>

      {/* Universal Floating Dock Navbar */}
      <Navbar />
    </div>
  );
}

