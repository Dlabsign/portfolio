"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DANIEL_PROFILE, SOCIAL_LINKS } from "@/lib/data";
import { ArrowUpRight, Copy, Check, ArrowUp } from "lucide-react";

export default function DanielAbout() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(DANIEL_PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section
      id="about"
      className="relative w-full py-28 md:py-36 px-6 md:px-14 bg-[#050505] text-white border-t border-white/[0.08] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Section Header: Minimal Editorial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>( 03 )</span>
              <span>•</span>
              <span>KNOW MORE ABOUT ME</span>
            </div>
            <h2 className="font-sans font-black text-4xl sm:text-6xl md:text-7xl tracking-[-0.04em] lowercase text-white">
              about &amp; vision
            </h2>
          </div>

          <div className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
            {DANIEL_PROFILE.brand} // {DANIEL_PROFILE.location}
          </div>
        </div>

        {/* Large Editorial Statement Block */}
        <div className="space-y-8">
          <motion.blockquote
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white max-w-5xl"
          >
            &ldquo;BASED IN INDONESIA, I AM AN INNOVATIVE DEVELOPER WHO CREATES MEANINGFUL CONNECTIONS BETWEEN USERS AND BRANDS THROUGH SEAMLESS INTERACTION AND MODERN VISUAL IDENTITY.&rdquo;
          </motion.blockquote>

          <p className="font-sans text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
            I craft digital products where rigorous code meets refined aesthetic sensibilities. From architecting scalable web applications to designing high-impact interactive experiences, every line and layout is delivered with intent.
          </p>
        </div>

        {/* Contact & Interaction Hub */}
        <div
          id="contact"
          className="pt-12 border-t border-white/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Direct WhatsApp CTA */}
          <div className="lg:col-span-6 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block">
              // LET&apos;S COLLABORATE
            </span>
            <h3 className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-tight lowercase">
              have a project in mind?
            </h3>
            <p className="font-sans text-sm text-neutral-400 max-w-md">
              Available for freelance collaborations, engineering consultancies, and innovative digital product builds.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={DANIEL_PROFILE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-sans font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all duration-300"
              >
                <span>contact now*</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Copy Email Button */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 bg-white/[0.02] hover:border-white/40 hover:bg-white/[0.06] transition-all font-mono text-xs lowercase text-neutral-300 hover:text-white"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>email copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 opacity-60" />
                    <span>{DANIEL_PROFILE.email}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Social Channels Directory */}
          <div className="lg:col-span-6 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block">
              // CONNECT ACROSS THE WEB
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.06] transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-neutral-400 group-hover:text-white transition-colors">
                      {s.shortCode}
                    </span>
                    <span className="font-sans font-medium text-sm text-neutral-200 group-hover:text-white">
                      {s.label}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Monumental Footer Brandmark (# dlabsign.ID) */}
        <div className="pt-20 pb-4 border-t border-white/[0.08] select-none">
          <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-6 font-mono text-xs uppercase tracking-widest text-neutral-500">
            <span>DLABSIGN.ID CREATIVE STUDIO</span>
            <span>PERIOD {DANIEL_PROFILE.period}</span>
          </div>

          <h1 className="font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[140px] tracking-[-0.05em] leading-[0.85] text-neutral-800 hover:text-neutral-700 transition-colors cursor-default lowercase">
            # dlabsign<span className="text-white">.id</span>
          </h1>
        </div>

        {/* Bottom Legal & Back to Top Strip */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-400">
          <div>
            &copy; 2021 &mdash; 2026 {DANIEL_PROFILE.name}. All rights reserved.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-2 hover:text-white transition-colors"
          >
            <span className="uppercase tracking-widest text-[11px]">Back to top</span>
            <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>

      </div>
    </section>
  );
}
