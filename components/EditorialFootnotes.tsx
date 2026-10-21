"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";

export default function EditorialFootnotes() {
  const [isOpen, setIsOpen] = useState(false);

  const footnotes = [
    {
      id: "fn1",
      number: "01",
      title: "ARCHITECTURAL FRAMEWORK & ENGINE",
      content:
        "The monograph is engineered on Next.js 15 App Router with React 19 server-client hydration boundaries, Lenis inertia scrolling, and Tailwind CSS. All interactions operate strictly on GPU-composited transform and opacity channels to maintain a stable 60fps refresh cadence.",
    },
    {
      id: "fn2",
      number: "02",
      title: "TYPOGRAPHIC PROVENANCE & ATTRIBUTION",
      content:
        "Primary editorial hierarchy is typeset in PP Neue Montreal (Pangram Pangram Foundry), designed by Mat Desjardins. Monospace tabular indices are typeset in Geist Pixel (Vercel). Secondary display ornaments reference FK Raster Roman (Florian Karsten).",
    },
    {
      id: "fn3",
      number: "03",
      title: "SUBSTRATE & PAPER EMULATION",
      content:
        "The default viewing substrate emulates physical unbleached newsprint paper (#F4F3EF) with an optical dot grain texture. Inverted Sheet Mode (#0C0C0C) can be toggled via the masthead controls to simulate photographic darkroom prints.",
    },
    {
      id: "fn4",
      number: "04",
      title: "RIGHTS & COMMISSION RECORD",
      content:
        "All visual plates, commercial identity marks, and software repositories referenced within this publication are property of Daniel Kurnia and respective commissioning clients. No portion may be reproduced without prior written authorization.",
    },
  ];

  return (
    <section className="w-full border-b border-hairline dark:border-hairline-night bg-paper-card/40 dark:bg-paper-card-night/40 text-ink dark:text-ink-night select-none py-8 px-4 sm:px-8 xl:px-16">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Toggle Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-ink dark:text-ink-night font-bold">
            <BookOpen className="w-4 h-4 text-vermilion" />
            <span>[ EDITORIAL FOOTNOTES &amp; TECHNICAL SOURCES ]</span>
            <span className="hidden sm:inline text-ink-ghost dark:text-ink-ghost-night font-normal">
              ( 04 ANNOTATED REFERENCES )
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1 border border-hairline dark:border-hairline-night hover:border-ink dark:hover:border-ink-night text-ink-ghost dark:text-ink-ghost-night hover:text-ink dark:hover:text-ink-night font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer bg-paper dark:bg-paper-night rounded-sm"
          >
            <span>{isOpen ? "[ COLLAPSE NOTES ]" : "[ EXPAND NOTES ]"}</span>
            {isOpen ? <ChevronUp className="w-3 h-3 text-vermilion" /> : <ChevronDown className="w-3 h-3 text-vermilion" />}
          </button>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-hairline dark:border-hairline-night font-mono text-[11px] leading-relaxed text-ink-ghost dark:text-ink-ghost-night">
            {footnotes.map((fn) => (
              <div key={fn.id} className="space-y-2">
                <div className="flex items-center gap-2 text-ink dark:text-ink-night font-bold uppercase tracking-wider text-[10px]">
                  <span className="text-vermilion font-bold">[{fn.number}]</span>
                  <span>{fn.title}</span>
                </div>
                <p className="text-[10px] leading-relaxed">{fn.content}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
