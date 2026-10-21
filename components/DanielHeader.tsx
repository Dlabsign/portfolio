"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DANIEL_PROFILE } from "@/lib/data";
import { ArrowUpRight, X } from "lucide-react";

interface DanielHeaderProps {
  onNavigate?: (id: string) => void;
}

export default function DanielHeader({ onNavigate }: DanielHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = menuOpen ? "hidden" : "";
    }
  }, [menuOpen]);

  const navLinks = [
    { id: "works", label: "Selected Work" },
    { id: "skills", label: "Skills & Capabilities" },
    { id: "about", label: "About & Vision" },
    { id: "contact", label: "Contact Now" },
  ];

  const handleLinkClick = (id: string) => {
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Floating Centered Glassmorphic Navbar */}
      <header className="fixed top-5 sm:top-7 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[380px] sm:max-w-[420px] pointer-events-auto">
        <div className="bg-white/80 backdrop-blur-md border border-neutral-300/80 shadow-[0_4px_24px_rgba(0,0,0,0.05)] rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-300">
          
          {/* Left Side: Pixel Star Emblem & Distinctive Serif Brandmark */}
          <Link
            href="/"
            onClick={() => handleLinkClick("hero")}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            {/* 8-pointed Pixel Star Logo in Electric Purple/Blue */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0 text-[#350AFF] group-hover:scale-105 transition-transform"
            >
              {/* Main vertical and horizontal pixel cross */}
              <rect x="8.5" y="0" width="3" height="20" fill="#350AFF" />
              <rect x="0" y="8.5" width="20" height="3" fill="#350AFF" />
              {/* Diagonal pixel dots */}
              <rect x="4" y="4" width="2.5" height="2.5" fill="#350AFF" />
              <rect x="13.5" y="4" width="2.5" height="2.5" fill="#350AFF" />
              <rect x="4" y="13.5" width="2.5" height="2.5" fill="#350AFF" />
              <rect x="13.5" y="13.5" width="2.5" height="2.5" fill="#350AFF" />
              {/* Inner accent ring */}
              <rect x="7" y="7" width="6" height="6" fill="#1A1A1A" />
              <rect x="8.5" y="8.5" width="3" height="3" fill="#FFFFFF" />
            </svg>

            {/* Editorial Brandmark in PP Neue Montreal */}
            <span className="font-sans font-medium text-sm sm:text-base tracking-tight text-neutral-900">
              The Design Society
            </span>
          </Link>

          {/* Right Side: Minimalist Two-line Hamburger Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            className="p-1.5 flex flex-col justify-center items-end gap-[5px] focus:outline-none group cursor-pointer"
          >
            <span
              className={`w-5 h-[1.5px] bg-neutral-900 rounded-full transition-transform duration-300 origin-center ${
                menuOpen ? "rotate-45 translate-y-[3.25px]" : ""
              }`}
            />
            <span
              className={`w-5 h-[1.5px] bg-neutral-900 rounded-full transition-transform duration-300 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-[3.25px]" : ""
              }`}
            />
          </button>

        </div>
      </header>

      {/* Slide-down Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[380px] sm:max-w-[420px] bg-white/95 backdrop-blur-xl border border-neutral-300 shadow-[0_16px_40px_rgba(0,0,0,0.12)] rounded-2xl p-6 text-neutral-900"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <span className="font-pixel text-[11px] text-neutral-500 uppercase tracking-widest">
                [NAVIGATION ARCHIVE]
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <nav className="py-4 space-y-2">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleLinkClick(item.id)}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-100 text-neutral-800 hover:text-black font-sans font-medium text-sm flex items-center justify-between transition-colors"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              ))}
            </nav>

            <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-xs">
              <a
                href={DANIEL_PROFILE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#350AFF] text-white font-medium hover:bg-[#2806cc] transition-colors"
              >
                <span>contact now*</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>

              <a
                href={`mailto:${DANIEL_PROFILE.email}`}
                className="text-neutral-500 hover:text-neutral-900 font-mono transition-colors"
              >
                {DANIEL_PROFILE.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
