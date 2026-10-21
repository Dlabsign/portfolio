"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

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
  const yMetrics = useTransform(smoothProgress, [0, 1], [24, -18]);

  const metadataItems = [
    {
      title: "5+ Years",
      sub: lang === "EN" ? "Continuous software delivery" : "Pengiriman perangkat lunak berkelanjutan",
    },
    {
      title: "Indonesia (GMT+7)",
      sub: lang === "EN" ? "Remote & worldwide" : "Remote & seluruh dunia",
    },
    {
      title: "Full-Stack Systems",
      sub: "Next.js, TypeScript, Laravel",
    },
    {
      title: "dlabsign.ID",
      sub: lang === "EN" ? "Independent digital studio" : "Studio digital independen",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-[100dvh] bg-[#FAFAFA] border-t border-[#E5E4E0] flex flex-col justify-center py-16 sm:py-20 md:py-24 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-center flex-1">
        {/* Section Header with Parallax & Hover Black */}
        <motion.div
          style={{ y: yHeader }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pb-6 sm:pb-8 border-b border-[#E5E4E0]"
        >
          <h2 className="type-h2 uppercase text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300 cursor-default">
            {lang === "EN" ? "About" : "Tentang"}
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
            <h3 className="type-h3 italic !font-normal text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300 cursor-default">
              &ldquo;
              {lang === "EN"
                ? "Form follows function. Eliminate decoration that does not clarify intent or accelerate human interaction."
                : "Bentuk mengikuti fungsi. Hilangkan dekorasi yang tidak memperjelas tujuan atau mempercepat interaksi manusia."}
              &rdquo;
            </h3>
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
            <p className="type-body text-[#6e6e69] hover:text-[#2d2d2a] max-w-2xl transition-colors duration-300">
              {lang === "EN" ? (
                <>
                  Independent software engineer and digital creator based in Indonesia,
                  focused on engineering resilient web systems and high-fidelity interfaces.
                  Every digital product is crafted with strict typographic discipline,
                  low-latency architecture, and a timeless minimalist aesthetic.
                </>
              ) : (
                <>
                  Software engineer dan kreator digital independen asal Indonesia,
                  berfokus merancang sistem web tangguh dan antarmuka presisi tinggi.
                  Setiap produk digital dibangun dengan disiplin tipografi ketat,
                  arsitektur rendah latensi, dan estetika minimalis yang timeless.
                </>
              )}
            </p>

            <p className="type-body text-[#6e6e69]/85 hover:text-[#2d2d2a] max-w-2xl transition-colors duration-300">
              {lang === "EN" ? (
                <>
                  Over the past five years, I have architected web platforms, interactive brand
                  systems, and high-performance ordering engines for varied organizations and clients.
                  I believe that great software does not need heavy ornaments or gratuitous effects—clarity,
                  precision, and rapid responsiveness speak for themselves.
                </>
              ) : (
                <>
                  Selama lima tahun terakhir, saya merancang berbagai platform web, sistem merek
                  interaktif, dan mesin pemesanan berkecepatan tinggi untuk beragam organisasi dan klien.
                  Saya meyakini bahwa perangkat lunak yang hebat tidak memerlukan ornamen tebal atau efek berlebihan—kejelasan,
                  presisi, dan responsivitas cepat berbicara dengan sendirinya.
                </>
              )}
            </p>
          </motion.div>
        </div>

        {/* Direct Metrics Specification Table with Parallax & Hover Black */}
        <motion.div
          style={{ y: yMetrics }}
          className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-[#E5E4E0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {metadataItems.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              data-cursor-interactive="true"
              className="space-y-1 group cursor-default"
            >
              <div className="type-h3 text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">
                {item.title}
              </div>
              <p className="type-caption text-[#6e6e69]/80 group-hover:text-[#2d2d2a] transition-colors duration-300">
                {item.sub}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
