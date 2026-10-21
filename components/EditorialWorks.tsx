"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { PROJECTS_DATA } from "@/lib/data";

export default function EditorialWorks() {
  const editorialArticles = [
    {
      ...PROJECTS_DATA[0],
      dispatchNo: "DISPATCH 01",
      headline: "The Culinary Ordering Engine: Sculpting Low-Latency Delight for Fast-Casual Gastronomy",
      kicker: "WEB DEVELOPMENT & BRAND EXPERIENCE",
      plateFigure: "FIG. 02",
      plateCaption: "Primary responsive ordering interface exhibiting fluid transitions, intuitive cart orchestration, and zero layout shift.",
      editorialBody: [
        "In the contemporary landscape of high-velocity food and beverage operations, digital interfaces frequently suffer from excessive friction, sluggish cart state management, and cluttered promotional noise. For Kabaabs, the architectural mandate was unequivocal: construct an ordering experience so immediate and responsive that ordering feels tactile and effortless.",
        "Leveraging Next.js with React server components, the application delivers near-instantaneous page transitions, crisp product taxonomy, and real-time inventory synchronization. Every interaction—from custom sauce modifications to final payment confirmation—was tuned for sub-100ms visual feedback.",
      ],
      architecturalSpecs: [
        { label: "FRAMEWORK", value: "Next.js / React 19" },
        { label: "STYLING", value: "Tailwind CSS Modern Engine" },
        { label: "STATE ARCHITECTURE", value: "Optimistic UI & Local Cache" },
        { label: "PRODUCTION YEAR", value: "2025" },
      ],
    },
    {
      ...PROJECTS_DATA[1],
      dispatchNo: "DISPATCH 02",
      headline: "Avant-Garde Streetwear: Brutalist Minimal Typography Meets High-Impact Commerce",
      kicker: "ECOMMERCE & EDITORIAL LOOKBOOK",
      plateFigure: "FIG. 03",
      plateCaption: "Monochromatic editorial collection showcase emphasizing silhouette contrast, micro-grid alignments, and fast asset streaming.",
      editorialBody: [
        "Streetwear culture demands an aesthetic uncompromisingly grounded in identity, raw typography, and cultural posture. For ICY - GOAT, standard generic ecommerce templates were rejected in favor of an editorial lookbook architecture inspired by contemporary Swiss broadsheets.",
        "The digital platform merges fluid motion choreography with disciplined layout grids. Customers glide through seasonal collection drops, archival photography, and instant checkout pathways without visual noise, mirroring the brand's minimalist ethos.",
      ],
      architecturalSpecs: [
        { label: "ARCHITECTURE", value: "Next.js + TypeScript" },
        { label: "MOTION ENGINE", value: "Framer Motion Physics" },
        { label: "TYPOGRAPHY", value: "Neo-Grotesque & Monospace" },
        { label: "PRODUCTION YEAR", value: "2025" },
      ],
    },
    {
      ...PROJECTS_DATA[2],
      dispatchNo: "DISPATCH 03",
      headline: "Hospitality Systems: Transforming Physical Dining Encounters into Seamless Digital Flow",
      kicker: "DESIGN SYSTEM & WEB INTERACTION",
      plateFigure: "FIG. 04",
      plateCaption: "Interactive digital menu ecosystem engineered for tablet and mobile devices with multi-language culinary taxonomy.",
      editorialBody: [
        "Modern hospitality requires digital touchpoints that respect the physical rhythm of dining. For Kedai Nihao, the project encompassed both a comprehensive brand design system and an intuitive in-house menu discovery platform.",
        "Designed and prototyped meticulously in Figma before translation into a robust React-powered web application, the system presents complex culinary preparations through serene visual pacing, reducing ordering wait times by 40% during peak dinner service.",
      ],
      architecturalSpecs: [
        { label: "DESIGN SUITE", value: "Figma Component System" },
        { label: "FRONTEND CORE", value: "React / Modern Tailwind" },
        { label: "EXPERIENCE", value: "Mobile-First Touch Architecture" },
        { label: "PRODUCTION YEAR", value: "2026" },
      ],
    },
    {
      ...PROJECTS_DATA[3],
      dispatchNo: "DISPATCH 04",
      headline: "Regional Civic Portal: Structuring Organizational Knowledge and Community Access",
      kicker: "PLATFORM & DATABASE ARCHITECTURE",
      plateFigure: "FIG. 05",
      plateCaption: "Central administrative dashboard and member directory platform providing structured record persistence and rapid retrieval.",
      editorialBody: [
        "Public and regional institutions require absolute data dependability, straightforward permission models, and clean archival indexing. JKS Sidoarjo required a unified portal to manage organization announcements, member records, and regional activity archives.",
        "Engineered with Laravel and a relational MySQL architecture, the portal delivers rock-solid authentication, streamlined administrative workflows, and a lightweight, high-accessibility interface that functions seamlessly even on constrained bandwidth connections.",
      ],
      architecturalSpecs: [
        { label: "BACKEND ENGINE", value: "PHP / Laravel Framework" },
        { label: "DATABASE", value: "Relational MySQL" },
        { label: "ARCHIVAL INTEGRITY", value: "Role-Based Access Control" },
        { label: "PRODUCTION YEAR", value: "2021" },
      ],
    },
  ];

  return (
    <section
      id="works"
      className="relative w-full border-b border-hairline dark:border-hairline-night text-ink dark:text-ink-night select-none"
    >
      {/* Section Department Header */}
      <div className="w-full px-4 sm:px-8 xl:px-16 py-8 border-b border-hairline dark:border-hairline-night bg-paper dark:bg-paper-night flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.24em] text-vermilion font-bold pb-2 flex items-center gap-2">
            <span>[ SECTION II // SELECTED DISPATCHES ]</span>
            <span>•</span>
            <span>PORTFOLIO CASE MONOGRAPHS</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-[-0.04em] uppercase text-ink dark:text-ink-night">
            Selected Work
          </h2>
        </div>

        <div className="font-mono text-xs uppercase tracking-widest text-ink-ghost dark:text-ink-ghost-night text-left md:text-right">
          <div>FOUR PRODUCTION CASE STUDIES</div>
          <div className="text-[10px] text-vermilion">VERIFIED LIVE DEPLOYMENTS</div>
        </div>
      </div>

      {/* Feature Articles Stacked in Editorial Newspaper Flow */}
      <div className="divide-y divide-hairline dark:divide-hairline-night">
        {editorialArticles.map((article, index) => (
          <article
            key={article.id}
            id={`project-${article.id}`}
            className="w-full px-4 sm:px-8 xl:px-16 py-16 sm:py-20 lg:py-24"
          >
            <div className="max-w-7xl mx-auto space-y-12">
              
              {/* Article Top Dateline */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-hairline dark:border-hairline-night font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-ink-ghost dark:text-ink-ghost-night">
                <div className="flex items-center gap-3">
                  <span className="text-vermilion font-bold">[{article.dispatchNo}]</span>
                  <span className="text-hairline dark:text-hairline-night">|</span>
                  <span className="text-ink dark:text-ink-night font-bold">{article.title}</span>
                  <span className="text-hairline dark:text-hairline-night">|</span>
                  <span>{article.kicker}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>YEAR OF ISSUE: {article.year}</span>
                  <span className="text-hairline dark:text-hairline-night">|</span>
                  <span>CLIENT: {article.client}</span>
                </div>
              </div>

              {/* Main Headline for the Project */}
              <motion.h3
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-broadsheet-headline font-display font-bold tracking-tight text-ink dark:text-ink-night max-w-5xl"
              >
                {article.headline}
              </motion.h3>

              {/* Two-Column Broadsheet Layout (Story vs Photo Plate) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-4 items-start">
                
                {/* Left Column (5 Cols): Editorial Narrative & Specifications */}
                <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* First Paragraph with Authentic Editorial Drop-Cap */}
                    <p className="editorial-drop-cap font-sans text-sm sm:text-base leading-relaxed text-ink-ghost dark:text-ink-ghost-night">
                      {article.editorialBody[0]}
                    </p>

                    {/* Second Paragraph */}
                    <p className="font-sans text-sm sm:text-base leading-relaxed text-ink-ghost dark:text-ink-ghost-night">
                      {article.editorialBody[1]}
                    </p>
                  </div>

                  {/* Architectural Technical Specifications Grid */}
                  <div className="pt-6 border-t border-hairline dark:border-hairline-night space-y-3 font-mono text-[11px] uppercase tracking-wider">
                    <div className="text-[10px] text-vermilion font-bold tracking-[0.2em] pb-1">
                      // SYSTEM SPECIFICATIONS &amp; STACK
                    </div>
                    {article.architecturalSpecs.map((spec, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex justify-between py-1.5 border-b border-hairline/40 dark:border-hairline-night/40 text-ink-ghost dark:text-ink-ghost-night"
                      >
                        <span>{spec.label}</span>
                        <span className="text-ink dark:text-ink-night font-bold">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Primary Outbound Link Button */}
                  <div className="pt-4">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 border border-ink dark:border-ink-night bg-ink text-paper dark:bg-ink-night dark:text-paper-night hover:bg-vermilion hover:border-vermilion hover:text-white transition-all duration-200 font-mono text-xs uppercase tracking-[0.18em] rounded-sm group"
                    >
                      <span>INSPECT LIVE ARTIFACT</span>
                      <ArrowUpRight className="w-4 h-4 text-vermilion group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Right Column (7 Cols): Framed Museum Photo Plate */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="relative w-full aspect-[16/10] sm:aspect-[16/11] border border-hairline dark:border-hairline-night overflow-hidden bg-paper-card dark:bg-paper-card-night">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover object-center grayscale contrast-110 hover:grayscale-0 hover:scale-[1.02] transition-all duration-700 ease-out"
                    />
                    
                    {/* Visual Archival Plate Stamp */}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-paper/90 dark:bg-paper-night/90 border border-hairline dark:border-hairline-night font-mono text-[9px] uppercase tracking-widest text-ink dark:text-ink-night select-none">
                      {article.plateFigure} // {article.title}
                    </div>

                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-paper/90 dark:bg-paper-night/90 border border-hairline dark:border-hairline-night font-mono text-[9px] uppercase tracking-widest text-vermilion font-bold select-none">
                      {article.year}
                    </div>

                    {/* Corner Crosshairs */}
                    <div className="absolute top-2 right-2 text-[10px] font-mono text-ink/40 dark:text-ink-night/40 select-none">+</div>
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-ink/40 dark:text-ink-night/40 select-none">+</div>
                  </div>

                  {/* Formal Archival Caption */}
                  <figcaption className="font-mono text-[11px] text-ink-ghost dark:text-ink-ghost-night leading-relaxed tracking-wider uppercase flex items-start gap-2 pt-1">
                    <span className="text-vermilion font-bold shrink-0">{article.plateFigure}:</span>
                    <span>{article.plateCaption}</span>
                  </figcaption>
                </div>

              </div>

            </div>
          </article>
        ))}
      </div>

      {/* Works Section Archive Footnote */}
      <div className="w-full px-4 sm:px-8 xl:px-16 py-6 bg-paper-card/30 dark:bg-paper-card-night/30 border-t border-hairline dark:border-hairline-night font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-ink-ghost dark:text-ink-ghost-night flex flex-wrap items-center justify-between gap-4">
        <div>// ARCHIVE OF COMMISSIONED WORK (2021 — 2026)</div>
        <div className="flex items-center gap-3">
          <span>COMPLETE CODE BASES DOCUMENTED IN REPOSITORY</span>
          <span className="text-vermilion font-bold">§</span>
        </div>
      </div>

    </section>
  );
}
