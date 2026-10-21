"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PROJECTS_DATA } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export default function DanielProjects() {
  return (
    <section
      id="works"
      className="relative w-full py-28 md:py-36 px-6 md:px-14 bg-[#050505] text-white border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header: Editorial & Minimal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>( 01 )</span>
              <span>•</span>
              <span>PORTFOLIO ARCHIVE</span>
            </div>
            <h2 className="font-sans font-black text-4xl sm:text-6xl md:text-7xl tracking-[-0.04em] lowercase text-white">
              selected work
            </h2>
          </div>

          {/* View Portfolio* Action Link */}
          <div className="flex items-center">
            <a
              href="https://danielkurnia.framer.website/work"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/[0.03] hover:bg-white hover:text-black transition-all duration-300 font-mono text-xs lowercase tracking-wider text-white"
            >
              <span>view portfolio*</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Projects Grid: 2x2 High-contrast Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {PROJECTS_DATA.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0A0A0C] hover:border-white/30 transition-all duration-500 overflow-hidden"
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 sm:p-8 space-y-6"
              >
                {/* Image Container with 16:10 Aspect */}
                <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-neutral-900 border border-white/5">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Year Tag Float */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 font-mono text-[10px] tracking-wider text-white uppercase">
                    {project.year}
                  </div>
                </div>

                {/* Content Meta */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                      {project.category}
                    </span>
                    <span className="font-mono text-xs text-neutral-500">
                      ({project.number})
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-white group-hover:text-neutral-200 transition-colors">
                      {project.title}
                    </h3>
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>
              </a>
            </motion.article>
          ))}
        </div>

        {/* Bottom Banner Archive Indicator */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-neutral-500 uppercase tracking-widest">
          <div>// CURATED WORK ARCHIVE (2021 — 2026)</div>
          <div className="flex items-center gap-2">
            <span>DLABSIGN.ID</span>
            <span>•</span>
            <span className="text-white">FULL-STACK &amp; CREATIVE DEV</span>
          </div>
        </div>

      </div>
    </section>
  );
}
