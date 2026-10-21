"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(800);

  // Sync viewport height for responsive physics thresholds
  useEffect(() => {
    setViewportHeight(window.innerHeight || 800);
    const handleResize = () => setViewportHeight(window.innerHeight || 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track page scroll for Stacking Parallax & Crumble physics
  const { scrollY } = useScroll();

  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 26,
    restDelta: 0.001,
  });

  const crumbleLimit = viewportHeight * 0.75;

  // Subtle Scroll Parallax: Smooth depth differential as Hero scrolls naturally
  const yLine1 = useTransform(smoothScrollY, [0, crumbleLimit], [0, 40]);
  const yLine2 = useTransform(smoothScrollY, [0, crumbleLimit], [0, 60]);
  const yLine3 = useTransform(smoothScrollY, [0, crumbleLimit], [0, 85]);
  const yLine4 = useTransform(smoothScrollY, [0, crumbleLimit], [0, 110]);

  const rotLine1 = useTransform(smoothScrollY, [0, crumbleLimit], [0, -1.2]);
  const rotLine2 = useTransform(smoothScrollY, [0, crumbleLimit], [0, 1.0]);
  const rotLine3 = useTransform(smoothScrollY, [0, crumbleLimit], [0, -0.8]);
  const rotLine4 = useTransform(smoothScrollY, [0, crumbleLimit], [0, 1.1]);

  const yPhoto = useTransform(smoothScrollY, [0, crumbleLimit], [0, 60]);
  const scalePhoto = useTransform(smoothScrollY, [0, crumbleLimit], [1, 0.96]);

  // Gentle fade as hero exits viewport smoothly
  const opacityHero = useTransform(smoothScrollY, [0, viewportHeight * 1.1], [1, 0.2]);

  // Character registry & cached spatial geometry
  const charRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const charCoordsRef = useRef<Array<{ el: HTMLSpanElement; cx: number; cy: number }>>([]);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const rafId = useRef<number | null>(null);
  const isHovering = useRef(false);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pre-calculate character centers relative to headline container to eliminate layout thrashing
  const updateCharCoords = useCallback(() => {
    if (!headlineRef.current) return;
    const headlineRect = headlineRef.current.getBoundingClientRect();
    const coords: Array<{ el: HTMLSpanElement; cx: number; cy: number }> = [];

    charRefs.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      coords.push({
        el,
        cx: rect.left - headlineRect.left + rect.width / 2,
        cy: rect.top - headlineRect.top + rect.height / 2,
      });
    });

    charCoordsRef.current = coords;
  }, []);

  // Update geometry on mount, fonts load, and window resize
  useEffect(() => {
    const timer = setTimeout(updateCharCoords, 250);
    window.addEventListener("resize", updateCharCoords);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateCharCoords);
    };
  }, [updateCharCoords]);

  // Real-time Proximity Text Magnifier (Zero Reflows + 120fps RAF Loop)
  const renderMagnifier = useCallback(() => {
    if (!headlineRef.current || !isHovering.current) {
      rafId.current = null;
      return;
    }

    const mouse = mousePosRef.current;
    if (!mouse) {
      rafId.current = null;
      return;
    }

    const headlineRect = headlineRef.current.getBoundingClientRect();
    const localMouseX = mouse.x - headlineRect.left;
    const localMouseY = mouse.y - headlineRect.top;

    // Calibrated optical lens radius for monumental typography
    const RADIUS = 140;

    charCoordsRef.current.forEach(({ el, cx, cy }) => {
      const dist = Math.hypot(localMouseX - cx, localMouseY - cy);

      if (dist < RADIUS) {
        const ratio = dist / RADIUS;
        // Cosine falloff: 1 at epicenter, smooth continuous drop to 0 at perimeter
        const factor = Math.cos(ratio * (Math.PI / 2));
        const scale = (1 + factor * 0.16).toFixed(3);
        const liftY = (-factor * 6).toFixed(2); // 3D convex optical elevation

        el.style.transform = `translate3d(0, ${liftY}px, 0) scale(${scale})`;
        el.style.fontWeight = factor > 0.65 ? "600" : factor > 0.35 ? "400" : "100";
        el.style.color = factor > 0.08 ? "#2d2d2a" : "#6e6e69";
      } else {
        if (el.style.transform) {
          el.style.transform = "";
          el.style.fontWeight = "100";
          el.style.color = "#6e6e69";
        }
      }
    });

    rafId.current = requestAnimationFrame(renderMagnifier);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    isHovering.current = true;
    updateCharCoords();

    // Clear inline transitions during active tracking so response is instantaneous (0ms lag)
    charRefs.current.forEach((el) => {
      if (el) el.style.transition = "";
    });
  }, [updateCharCoords]);

  const handleMouseMove = useCallback((clientX: number, clientY: number) => {
    mousePosRef.current = { x: clientX, y: clientY };

    if (!isHovering.current) {
      isHovering.current = true;
      if (charCoordsRef.current.length === 0) {
        updateCharCoords();
      }
    }

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(renderMagnifier);
    }
  }, [renderMagnifier, updateCharCoords]);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    mousePosRef.current = null;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    // Gracefully ease all characters back to resting state with luxury damping
    charRefs.current.forEach((el) => {
      if (!el) return;
      el.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), font-weight 0.3s ease-out, color 0.4s ease-out";
      el.style.transform = "";
      el.style.fontWeight = "100";
      el.style.color = "#6e6e69";
    });

    // Clear inline transition after relaxation completes so subsequent entries are instant
    leaveTimerRef.current = setTimeout(() => {
      charRefs.current.forEach((el) => {
        if (el) el.style.transition = "";
      });
      leaveTimerRef.current = null;
    }, 420);
  }, []);

  // Split-text helper: Wraps every character in an individual tracking span
  const renderSplitLine = (
    text: string,
    lineKey: string,
    isSpecialChar?: (char: string) => boolean
  ) => {
    return text.split("").map((char, idx) => {
      const key = `${lineKey}-${idx}`;

      if (char === " ") {
        return (
          <span key={key} className="inline-block w-[0.28em] select-none">
            &nbsp;
          </span>
        );
      }

      const isSpecial = isSpecialChar ? isSpecialChar(char) : false;

      return (
        <span
          key={key}
          ref={(el) => {
            if (el) charRefs.current.set(key, el);
            else charRefs.current.delete(key);
          }}
          style={{
            fontWeight: 100,
            color: isSpecial ? "#e50319" : "#6e6e69",
          }}
          className={`inline-block origin-center select-none will-change-transform pointer-events-none transition-colors duration-300 ${
            isSpecial ? "font-headline italic font-light lowercase text-[#e50319]" : ""
          }`}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-[#FAFAFA] flex flex-col justify-center m-0 p-0 select-none"
    >
      {/* Pure Full-Width Hero Content: 4-Line Monumental Headline & Proportional Uncut Photo */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ opacity: opacityHero }}
        className="w-full flex-1 flex items-center px-4 sm:px-8 lg:px-12 py-6 sm:py-10 overflow-hidden"
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-8">
          {/* Left Column: Full-Width 4-Line Giant Headline with Proximity Text Magnifier */}
          <div
            ref={headlineRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={(e) => handleMouseMove(e.clientX, e.clientY)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseEnter}
            onTouchMove={(e) => {
              if (e.touches && e.touches[0]) {
                handleMouseMove(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchEnd={handleMouseLeave}
            className="lg:col-span-8 p-0 m-0 flex flex-col justify-center"
          >
            <h1 className="p-0 m-0 font-headline uppercase leading-[0.80] tracking-tighter text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-500 text-[clamp(2.8rem,9.2vw,11.2rem)] select-none">
              {/* Line 1: "SOFTWARE" with Proximity Magnifier */}
              <motion.div
                style={{ y: yLine1, rotate: rotLine1 }}
                className="block p-0 m-0 origin-left"
              >
                <span className="inline-block whitespace-nowrap">
                  {renderSplitLine("SOFTWARE", "L1")}
                </span>
              </motion.div>

              {/* Line 2: "ENGINEER &" with Proximity Magnifier */}
              <motion.div
                style={{ y: yLine2, rotate: rotLine2 }}
                className="block p-0 m-0 origin-left"
              >
                <span className="inline-block whitespace-nowrap">
                  {renderSplitLine("ENGINEER &", "L2", (char) => char === "&")}
                </span>
              </motion.div>

              {/* Line 3: "DIGITAL" with Proximity Magnifier */}
              <motion.div
                style={{ y: yLine3, rotate: rotLine3 }}
                className="block p-0 m-0 origin-left"
              >
                <span className="inline-block whitespace-nowrap">
                  {renderSplitLine("DIGITAL", "L3")}
                </span>
              </motion.div>

              {/* Line 4: "ARCHITECTURE" with Proximity Magnifier (Spanning Full Width) */}
              <motion.div
                style={{ y: yLine4, rotate: rotLine4 }}
                className="block p-0 m-0 origin-left"
              >
                <span className="inline-block whitespace-nowrap">
                  {renderSplitLine("ARCHITECTURE", "L4")}
                </span>
              </motion.div>
            </h1>
          </div>

          {/* Right Column: Proportional Profile Photo Aligned & Uncropped from Top of Head */}
          <div className="lg:col-span-4 p-0 m-0 flex items-center justify-center lg:justify-end">
            <motion.div
              style={{
                y: yPhoto,
                scale: scalePhoto,
              }}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              data-cursor="read"
              data-cursor-badge="View"
              className="relative w-full max-w-[270px] sm:max-w-[320px] lg:max-w-[370px] aspect-[3/4] rounded-2xl overflow-hidden border border-[#E5E4E0] hover:border-[#2d2d2a] bg-[#F5F5F2] cursor-pointer transition-colors duration-300"
            >
              <Image
                src="/FOTO.png"
                alt="Daniel Kurnia"
                fill
                priority
                sizes="(max-width: 1024px) 320px, 380px"
                className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-500 ease-out"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
