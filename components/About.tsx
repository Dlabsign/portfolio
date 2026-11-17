"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { TextRoll } from "@/components/core/text-roll";
import { TextEffect } from "@/components/core/text-effect";

export default function About() {
  const { lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  // Responsive Parallax Scrolling Physics
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    restDelta: 0.001,
  });

  const yHeader = useTransform(smoothProgress, [0, 1], [-20, 20]);
  const yQuote = useTransform(smoothProgress, [0, 1], [-16, 16]);
  const yBio = useTransform(smoothProgress, [0, 1], [16, -16]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-[100dvh] bg-[#000000] border-t border-[#262626] flex flex-col justify-center py-16 sm:py-20 md:py-24 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-center flex-1">
        {/* Section Header with Parallax & Hover Black */}
        <motion.div
          style={{ y: yHeader }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pb-6 sm:pb-8 border-b border-[#262626]"
        >
          <h2 className="type-h2 uppercase text-[#fafafa] hover:text-[#fafafa] transition-colors duration-300 cursor-default">
            <TextRoll key={`about-title-${lang}`}>
              {lang === "EN" ? "About" : "Tentang"}
            </TextRoll>
          </h2>
        </motion.div>

        {/* Main Philosophy & Bio with Multi-Depth Parallax */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-14 pt-8 sm:pt-12 items-start">
          {/* Left Column: Motto with Floating Parallax */}
          <motion.div
            style={{ y: yQuote }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5"
          >
            <TextEffect
              key={`about-quote-${lang}`}
              per="char"
              preset="fade"
              as="h3"
              className="type-h3 italic !font-normal text-[#fafafa] hover:text-[#fafafa] transition-colors duration-300 cursor-default"
            >
              {lang === "EN"
                ? "“Good software feels effortless. Clean code, clear intent, and nothing unnecessary.”"
                : "“Perangkat lunak yang baik terasa sederhana. Kode yang bersih, tujuan yang jelas, tanpa ornamen berlebih.”"}
            </TextEffect>
          </motion.div>

          {/* Right Column: Bio Paragraphs with Responsive Parallax */}
          <motion.div
            style={{ y: yBio }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-7 space-y-4 sm:space-y-5"
          >
            <TextEffect
              key={`about-bio1-${lang}`}
              per="char"
              preset="fade"
              as="p"
              className="type-body text-[#fafafa] hover:text-[#fafafa] max-w-2xl transition-colors duration-300"
            >
              {lang === "EN"
                ? "Software engineer based in Indonesia. Over the past five years, I have built web applications, internal systems, and digital tools for teams and clients across various industries."
                : "Software engineer asal Indonesia. Selama lima tahun terakhir, saya membangun aplikasi web, sistem internal, dan produk digital untuk tim serta klien dari berbagai sektor."}
            </TextEffect>

            <TextEffect
              key={`about-bio2-${lang}`}
              per="char"
              preset="fade"
              as="p"
              className="type-body text-[#fafafa]/80 hover:text-[#fafafa] max-w-2xl transition-colors duration-300"
            >
              {lang === "EN"
                ? "I focus on simple architecture, fast performance, and clean interfaces that solve practical problems directly."
                : "Fokus saya adalah arsitektur yang sederhana, performa cepat, dan antarmuka bersih yang menyelesaikan masalah nyata secara langsung."}
            </TextEffect>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
