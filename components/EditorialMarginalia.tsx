"use client";

import React, { useEffect, useState } from "react";

export default function EditorialMarginalia() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100));
        setScrollProgress(Math.round(progress));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Left Marginalia Anchor (Vertical Running Header) */}
      <aside
        aria-hidden="true"
        className="hidden xl:flex fixed left-3 top-0 bottom-0 z-40 pointer-events-none flex-col justify-between items-center py-8 select-none text-[10px] font-mono tracking-[0.22em] uppercase text-ink-ghost dark:text-ink-ghost-night"
      >
        <div className="[writing-mode:vertical-rl] rotate-180 flex items-center gap-4">
          <span className="text-vermilion font-bold">●</span>
          <span>DANIEL KURNIA BROADSHEET</span>
          <span className="opacity-40">/</span>
          <span>ISSUE NO. 06 — VOL. XXIV</span>
        </div>

        <div className="w-[1px] h-20 bg-hairline dark:bg-hairline-night" />

        <div className="[writing-mode:vertical-rl] rotate-180 flex items-center gap-3">
          <span>SURABAYA • JAKARTA • GLOBAL</span>
          <span className="opacity-40">/</span>
          <span>(2021 — 2026)</span>
        </div>
      </aside>

      {/* Right Marginalia Anchor (Vertical Progress & Index Tag) */}
      <aside
        aria-hidden="true"
        className="hidden xl:flex fixed right-3 top-0 bottom-0 z-40 pointer-events-none flex-col justify-between items-center py-8 select-none text-[10px] font-mono tracking-[0.22em] uppercase text-ink-ghost dark:text-ink-ghost-night"
      >
        <div className="[writing-mode:vertical-rl] flex items-center gap-3">
          <span>SYSTEMS ARCHITECTURE &amp; INTERACTION</span>
          <span className="opacity-40">/</span>
          <span>FOLIO INDEX</span>
        </div>

        {/* Dynamic Scroll Progress Meter */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-[9px] font-mono tracking-widest text-ink dark:text-ink-night font-bold">
            {scrollProgress < 10 ? `0${scrollProgress}` : scrollProgress}%
          </div>
          <div className="w-[1px] h-16 bg-hairline dark:bg-hairline-night relative overflow-hidden">
            <div
              className="w-full bg-vermilion transition-all duration-150"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>
        </div>

        <div className="[writing-mode:vertical-rl] flex items-center gap-3">
          <span>DIGITAL NEWSPRINT REPRODUCTION</span>
          <span className="text-vermilion font-bold">§</span>
        </div>
      </aside>
    </>
  );
}
