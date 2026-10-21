"use client";

import React from "react";
import { motion } from "framer-motion";

export default function EditorialPullQuote() {
  return (
    <section className="relative w-full border-b border-hairline dark:border-hairline-night bg-paper dark:bg-paper-night py-16 sm:py-24 px-4 sm:px-8 xl:px-16 overflow-hidden select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Annotation Tag */}
        <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs uppercase tracking-[0.24em] text-ink-ghost dark:text-ink-ghost-night pb-4 border-b border-hairline dark:border-hairline-night">
          <div className="flex items-center gap-2">
            <span className="text-vermilion font-bold">§ 02</span>
            <span>/</span>
            <span>CRITICAL REFLECTION ON MEDIUM &amp; MATERIAL</span>
          </div>
          <div>[PULL QUOTE // ESSAY EXCERPT]</div>
        </div>

        {/* Monumental Editorial Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-broadsheet-title font-display font-medium text-ink dark:text-ink-night tracking-tight leading-[1.08] sm:leading-[1.12]"
        >
          <span className="text-vermilion font-serif text-5xl sm:text-7xl mr-2 inline-block -translate-y-2">“</span>
          <span>Code is not simply instructions for machines; it is the physical architecture of modern human culture. Every millisecond saved, every quiet interface rendered, is a conscious defense of human attention.</span>
          <span className="text-vermilion font-serif text-5xl sm:text-7xl ml-2 inline-block translate-y-3">”</span>
        </motion.blockquote>

        {/* Delicate Editorial Attribution & Folio Reference */}
        <div className="pt-6 border-t border-hairline dark:border-hairline-night flex flex-col sm:flex-row items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-ghost dark:text-ink-ghost-night">
          <div className="flex items-center gap-3">
            <span className="w-6 h-[1px] bg-vermilion inline-block" />
            <span className="text-ink dark:text-ink-night font-bold">DANIEL KURNIA</span>
            <span>—</span>
            <span>ON THE CRAFT OF TACTILE SOFTWARE ARCHITECTURE</span>
          </div>
          <div>FOLIO REF: ESSAY NO. 14 / SURABAYA, ID</div>
        </div>

      </div>
    </section>
  );
}
