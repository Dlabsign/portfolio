"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, ArrowUpRight, Menu, X } from "lucide-react";

interface EditorialHeaderProps {
  onNavigate?: (id: string) => void;
}

export default function EditorialHeader({ onNavigate }: EditorialHeaderProps) {
  const [isNightEdition, setIsNightEdition] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check initial dark mode from DOM
    const isDark = document.documentElement.classList.contains("dark");
    setIsNightEdition(isDark);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleEdition = () => {
    const nextDark = !isNightEdition;
    setIsNightEdition(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("broadsheet-edition", "night");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("broadsheet-edition", "day");
    }
  };

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const cleanId = id.replace("#", "");
      const el = document.getElementById(cleanId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navItems = [
    { label: "01 FRONT PAGE", id: "hero" },
    { label: "02 SELECTED DISPATCHES", id: "works" },
    { label: "03 CATALOG INDEX", id: "catalog" },
    { label: "04 TECHNICAL DOSSIER", id: "dossier" },
    { label: "05 ESSAY & ABOUT", id: "essay" },
    { label: "06 COLOPHON", id: "colophon" },
  ];

  return (
    <header className="relative w-full z-40 bg-paper dark:bg-paper-night text-ink dark:text-ink-night border-b border-hairline dark:border-hairline-night transition-colors duration-300">
      
      {/* 1. Top Dateline & Atmospheric Metadata Bar */}
      <div className="w-full border-b border-hairline dark:border-hairline-night py-2 px-4 sm:px-8 xl:px-16 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-ghost dark:text-ink-ghost-night select-none">
        <div className="flex items-center gap-4">
          <span className="font-bold text-ink dark:text-ink-night">VOL. XXIV • ISSUE NO. 06</span>
          <span className="hidden sm:inline text-hairline dark:text-hairline-night">|</span>
          <span className="hidden sm:inline">SURABAYA &amp; JAKARTA, ID</span>
          <span className="hidden md:inline text-hairline dark:text-hairline-night">|</span>
          <span className="hidden md:inline">28°C CLEAR • UTC+7</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden lg:inline">PRINT-TO-DIGITAL BROADSHEET</span>
          <span className="hidden lg:inline text-hairline dark:text-hairline-night">|</span>
          <span className="text-vermilion font-bold tracking-widest animate-pulse">● LIVE EDITION</span>
          
          {/* Day / Night Edition Toggle */}
          <button
            type="button"
            onClick={toggleEdition}
            aria-label="Toggle Night/Day Edition"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-hairline dark:border-hairline-night hover:border-ink dark:hover:border-ink-night text-[9px] font-mono tracking-wider transition-colors cursor-pointer bg-paper-card dark:bg-paper-card-night"
          >
            {isNightEdition ? (
              <>
                <Sun className="w-3 h-3 text-vermilion" />
                <span>[ ☼ DAY NEWSPRINT ]</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3 text-vermilion" />
                <span>[ ☾ NIGHT EDITION ]</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Monumental Broadsheet Masthead */}
      <div className="w-full px-4 sm:px-8 xl:px-16 pt-8 pb-6 flex flex-col items-center justify-center text-center">
        {/* Editorial Sub-deck */}
        <div className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-ink-ghost dark:text-ink-ghost-night pb-3 flex items-center justify-center gap-2">
          <span>( FIG. 00 — PRIMARY FOLIO )</span>
          <span>•</span>
          <span>THE INDEPENDENT JOURNAL OF SYSTEMS &amp; INTERACTION</span>
        </div>

        {/* Masthead Wordmark */}
        <Link
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("hero");
          }}
          className="group block"
        >
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[-0.04em] uppercase leading-[0.9] text-ink dark:text-ink-night group-hover:text-vermilion transition-colors duration-200">
            The Daniel Kurnia Chronicle
          </h1>
        </Link>

        {/* Framing Hairline Monograph Tag */}
        <div className="w-full max-w-4xl mx-auto pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-hairline dark:border-hairline-night mt-4 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-ink-ghost dark:text-ink-ghost-night">
          <div>MONOGRAPH NO. 06 / FIVE-YEAR ARCHIVE (2021 — 2026)</div>
          <div className="flex items-center gap-2">
            <span className="text-ink dark:text-ink-night font-bold">DLABSIGN.ID</span>
            <span>•</span>
            <span>FULL-STACK ARCHITECTURE</span>
          </div>
        </div>
      </div>

      {/* 3. Department Navigation Bar */}
      <nav
        aria-label="Editorial Departments"
        className="w-full border-t border-b border-hairline dark:border-hairline-night bg-paper dark:bg-paper-night px-4 sm:px-8 xl:px-16 select-none"
      >
        <div className="flex items-center justify-between py-2.5">
          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-mono text-[11px] tracking-[0.16em] uppercase">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="text-ink-ghost dark:text-ink-ghost-night hover:text-ink dark:hover:text-ink-night hover:underline underline-offset-4 decoration-vermilion decoration-2 transition-all cursor-pointer font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Direct Action Links on Right */}
          <div className="hidden sm:flex items-center gap-4 font-mono text-[11px] tracking-[0.16em] uppercase ml-auto">
            <a
              href="mailto:danielkurnip02@gmail.com"
              className="inline-flex items-center gap-1.5 px-3 py-1 border border-hairline dark:border-hairline-night hover:border-ink dark:hover:border-ink-night hover:bg-ink hover:text-paper dark:hover:bg-ink-night dark:hover:text-paper-night transition-all rounded-sm text-ink dark:text-ink-night"
            >
              <span>[ SEND INQUIRY ]</span>
              <ArrowUpRight className="w-3 h-3 text-vermilion" />
            </a>

            <a
              href="https://wa.me/+6281259321453"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-ink-ghost dark:text-ink-ghost-night hover:text-vermilion transition-colors"
            >
              <span>WA: +62 812-5932-1453</span>
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 text-ink dark:text-ink-night ml-auto focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-hairline dark:border-hairline-night flex flex-col gap-3 font-mono text-xs tracking-wider uppercase">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="text-left py-2 px-1 text-ink-ghost dark:text-ink-ghost-night hover:text-vermilion transition-colors border-b border-hairline/40 dark:border-hairline-night/40"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="mailto:danielkurnip02@gmail.com"
                className="py-2 text-vermilion font-bold"
              >
                [ SEND INQUIRY: danielkurnip02@gmail.com ]
              </a>
              <a
                href="https://wa.me/+6281259321453"
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 text-ink-ghost dark:text-ink-ghost-night"
              >
                WHATSAPP: +62 812-5932-1453
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* 4. Sticky Slim Top Ribbon (Triggered when user scrolls past masthead) */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-paper/95 dark:bg-paper-night/95 backdrop-blur-md border-b border-hairline dark:border-hairline-night px-4 sm:px-8 xl:px-16 py-2.5 transition-all duration-300 ${
          isScrolled ? "translate-y-0 opacity-100 shadow-sm" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest">
          <button
            type="button"
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-3 text-left group"
          >
            <span className="w-2 h-2 rounded-full bg-vermilion" />
            <span className="font-display font-bold text-sm tracking-tight text-ink dark:text-ink-night group-hover:text-vermilion transition-colors">
              THE DANIEL KURNIA CHRONICLE
            </span>
            <span className="hidden md:inline text-[10px] text-ink-ghost dark:text-ink-ghost-night">
              ( VOL. XXIV // NO. 06 )
            </span>
          </button>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={toggleEdition}
              className="p-1 text-ink dark:text-ink-night hover:text-vermilion transition-colors"
              title="Toggle Day/Night Edition"
            >
              {isNightEdition ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <a
              href="mailto:danielkurnip02@gmail.com"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1 border border-hairline dark:border-hairline-night hover:border-ink dark:hover:border-ink-night rounded-sm text-[10px]"
            >
              <span>CONTACT</span>
              <ArrowUpRight className="w-3 h-3 text-vermilion" />
            </a>
          </div>
        </div>
      </div>

    </header>
  );
}
