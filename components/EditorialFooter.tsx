"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import { DANIEL_PROFILE, SOCIAL_LINKS } from "@/lib/data";

export default function EditorialFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="colophon"
      className="relative w-full bg-paper dark:bg-paper-night text-ink dark:text-ink-night select-none pt-16 pb-12 px-4 sm:px-8 xl:px-16"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Colophon Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-hairline dark:border-hairline-night font-mono text-[10px] sm:text-xs uppercase tracking-[0.24em] text-ink-ghost dark:text-ink-ghost-night">
          <div className="flex items-center gap-2">
            <span className="text-vermilion font-bold">[ PUBLICATION COLOPHON ]</span>
            <span>—</span>
            <span>PRODUCTION CREDITS &amp; REGISTRATION</span>
          </div>
          <div>ISSUE REGISTRATION NO. 064-DK-2026</div>
        </div>

        {/* 4-Column Broadsheet Colophon Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 font-mono text-xs text-ink-ghost dark:text-ink-ghost-night">
          
          {/* Column 1: Editorial Direction */}
          <div className="space-y-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink dark:text-ink-night font-bold">
              // EDITORIAL &amp; CODE
            </div>
            <div className="space-y-1 text-[11px] leading-relaxed">
              <div className="text-ink dark:text-ink-night font-bold">{DANIEL_PROFILE.name.toUpperCase()}</div>
              <div>Lead Systems Architect</div>
              <div>Full-Stack Developer</div>
              <div>East Java, Indonesia</div>
            </div>
          </div>

          {/* Column 2: Studio Imprint */}
          <div className="space-y-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink dark:text-ink-night font-bold">
              // STUDIO IMPRINT
            </div>
            <div className="space-y-1 text-[11px] leading-relaxed">
              <div className="text-ink dark:text-ink-night font-bold">{DANIEL_PROFILE.brand}</div>
              <div>Independent Digital Studio</div>
              <div>Active Period: 2021 — 2026</div>
              <div>Worldwide Commissions</div>
            </div>
          </div>

          {/* Column 3: Typography & Fonts */}
          <div className="space-y-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink dark:text-ink-night font-bold">
              // TYPOGRAPHIC CREDITS
            </div>
            <div className="space-y-1 text-[11px] leading-relaxed">
              <div className="text-ink dark:text-ink-night font-bold">PP NEUE MONTREAL</div>
              <div>Pangram Pangram Foundry</div>
              <div>Geist Pixel Line (Vercel)</div>
              <div>FK Raster Roman (F. Karsten)</div>
            </div>
          </div>

          {/* Column 4: Archival Channels */}
          <div className="space-y-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink dark:text-ink-night font-bold">
              // OFFICIAL CHANNELS
            </div>
            <div className="space-y-1 text-[11px] leading-relaxed">
              {SOCIAL_LINKS.map((link) => (
                <div key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-vermilion transition-colors uppercase"
                  >
                    {link.name} ↗
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Monumental Giant Architectural Wordmark Signature */}
        <div className="pt-8 border-t border-hairline dark:border-hairline-night overflow-hidden">
          <div className="font-display font-black text-4xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[140px] tracking-[-0.05em] uppercase leading-[0.85] text-ink/15 dark:text-ink-night/15 hover:text-ink/30 dark:hover:text-ink-night/30 transition-colors cursor-default select-none">
            dlabsign.id
          </div>
        </div>

        {/* Bottom Legal & Return to Front Page Bar */}
        <div className="pt-6 border-t border-hairline dark:border-hairline-night flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-ink-ghost dark:text-ink-ghost-night">
          <div>
            © {new Date().getFullYear()} DANIEL KURNIA. ALL RIGHTS RESERVED. PRINTED DIGITALLY IN INDONESIA.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 hover:text-vermilion transition-colors cursor-pointer group"
          >
            <span>[ RETURN TO FRONT PAGE ]</span>
            <ArrowUp className="w-3.5 h-3.5 text-vermilion group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
