"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);
  const email = "danielkurnip02@gmail.com";
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
  const yHeadline = useTransform(smoothProgress, [0, 1], [-16, 16]);
  const yLinks = useTransform(smoothProgress, [0, 1], [16, -16]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const socialLinks = [
    { label: "GitHub", url: "https://github.com/Dlabsign" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/danielkurniaputra/" },
    { label: "Instagram", url: "https://www.instagram.com/danielkuptr/" },
    { label: "Behance", url: "https://www.behance.net/dlabsignid" },
    { label: "WhatsApp", url: "https://wa.me/+6281259321453" },
  ];

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#FAFAFA] text-[#6e6e69] border-t border-[#E5E4E0] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 pt-20 sm:pt-28 pb-32 sm:pb-36">
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
            {lang === "EN" ? "Contact" : "Kontak"}
          </h2>
        </motion.div>

        {/* Large Bold Callout with Parallax & Hover Black */}
        <motion.div
          style={{ y: yHeadline }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="py-12 sm:py-20 border-b border-[#E5E4E0]"
        >
          <h3 className="type-h1 uppercase text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-500 cursor-default">
            {lang === "EN" ? (
              <>
                Let&rsquo;s Build <br />
                <span className="inline-block hover:italic transition-all duration-300">
                  Something Refined.
                </span>
              </>
            ) : (
              <>
                Mari Membangun <br />
                <span className="inline-block hover:italic transition-all duration-300">
                  Karya yang Presisi.
                </span>
              </>
            )}
          </h3>
          <p className="mt-6 type-body text-[#6e6e69]/80 hover:text-[#2d2d2a] transition-colors duration-300 max-w-xl">
            {lang === "EN"
              ? "Available for new client commissions, full-stack architectural contracts, and software engineering collaborations."
              : "Terbuka untuk kolaborasi proyek klien baru, kontrak arsitektur full-stack, dan pengembangan perangkat lunak."}
          </p>

          {/* Interactive Direct Email Contact with Smooth Hover */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.a
              whileHover={{ x: 2 }}
              href={`mailto:${email}`}
              data-cursor="read"
              data-cursor-badge="Email"
              className="type-h3 text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300 underline underline-offset-8 decoration-[#E5E4E0] hover:decoration-[#e50319] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e50319] rounded-sm"
            >
              {email}
            </motion.a>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              onClick={handleCopyEmail}
              data-cursor-interactive="true"
              className={`type-button py-1.5 px-3 border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e50319] rounded-sm ${
                copied
                  ? "bg-[#bfe100] text-[#2d2d2a] border-[#bfe100] !font-medium shadow-xs"
                  : "border-[#E5E4E0] hover:border-[#2d2d2a] text-[#6e6e69] hover:text-[#2d2d2a]"
              }`}
            >
              {copied
                ? lang === "EN"
                  ? "Copied"
                  : "Tersalin"
                : lang === "EN"
                ? "Copy Email"
                : "Salin Email"}
            </motion.button>
          </div>
        </motion.div>

        {/* Minimalist Horizontal Social Links with Parallax & Hover Black */}
        <motion.div style={{ y: yLinks }} className="py-10 border-b border-[#E5E4E0]">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {socialLinks.map((link, idx) => (
              <motion.a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="read"
                data-cursor-badge="Visit"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -1 }}
                className="group inline-flex items-center gap-1 type-small !font-medium text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e50319] rounded-sm"
              >
                <span className="transition-all duration-300">
                  {link.label}
                </span>
                <span className="type-caption text-[#6e6e69]/80 group-hover:text-[#e50319] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                  ↗
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Clean Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 type-caption text-[#6e6e69]/80">
          <div>
            &copy; {new Date().getFullYear()} Daniel Kurnia. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
