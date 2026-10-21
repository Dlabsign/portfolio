"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * CustomCursor
 * 
 * A globally managed, circular dynamic glassmorphism custom cursor designed
 * for Daniel Kurnia's editorial portfolio.
 * 
 * Key Characteristics:
 * - Circular Dynamic Glassmorphism:
 *   - Precision central micro-dot for instant aiming accuracy (lerp: 0.95).
 *   - Outer fluid trailing glass follower (lerp: 0.20) crafted with authentic
 *     frosted glassmorphism (backdrop-blur, translucent specular border, subtle ambient depth).
 *   - Dynamic morphing into an editorial glass badge ("READ ↗", "VIEW ↗", "VISIT ↗")
 *     over designated article rows, project cards, and images.
 * - Stacking & Clipping Immunity:
 *   - Positioned as a single global component in RootLayout with z-[80].
 *   - Zero overflow clipping: bounds remain open so the circular glass orb never gets
 *     severed when moving across section margins or headers.
 *   - Strict pointer-events: none and user-select: none on all layers so click behavior,
 *     drag selection, and link navigation are 100% unimpeded.
 * - Performance:
 *   - 120 FPS requestAnimationFrame loop with GPU translate3d transforms.
 *   - Auto-sleeps when stationary to consume 0% idle CPU and battery.
 * - Accessibility:
 *   - Fully disabled on pure touch devices (@media pointer: coarse without fine pointer).
 *   - Automatically disabled when prefers-reduced-motion is active.
 *   - Native text cursor (I-beam) cleanly preserved over all text inputs and textareas.
 */
export default function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTextElement, setIsTextElement] = useState(false);
  const [badgeLabel, setBadgeLabel] = useState<string | null>(null);

  // Direct DOM references for 120fps GPU transform updates without React re-render overhead
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  // Synchronized state references to prevent redundant React dispatches
  const isVisibleRef = useRef(false);
  const badgeLabelRef = useRef<string | null>(null);
  const isHoveredRef = useRef(false);
  const isTextElementRef = useRef(false);

  // Positional coordinates
  const mousePos = useRef({ x: -9999, y: -9999 });
  const dotPos = useRef({ x: -9999, y: -9999 });
  const followerPos = useRef({ x: -9999, y: -9999 });

  const hasCoords = useRef(false);
  const rafId = useRef<number | null>(null);
  const isMoving = useRef(false);

  useEffect(() => {
    // 1. Accessibility & device capability detection
    const updateEligibility = () => {
      const isTouchOnly = window.matchMedia("(pointer: coarse) and not (any-pointer: fine)").matches;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const eligible = !isTouchOnly && !prefersReduced;

      setIsEnabled(eligible);

      if (eligible) {
        document.body.classList.add("custom-cursor-active");
      } else {
        document.body.classList.remove("custom-cursor-active");
      }
    };

    updateEligibility();

    const fineQuery = window.matchMedia("(any-pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    fineQuery.addEventListener("change", updateEligibility);
    motionQuery.addEventListener("change", updateEligibility);

    return () => {
      fineQuery.removeEventListener("change", updateEligibility);
      motionQuery.removeEventListener("change", updateEligibility);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    let moveTimeout: number | undefined;

    // Linear interpolation for organic motion easing
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const render = () => {
      // Precision micro-dot tracks rapidly for zero perceived aiming latency
      dotPos.current.x = lerp(dotPos.current.x, mousePos.current.x, 0.95);
      dotPos.current.y = lerp(dotPos.current.y, mousePos.current.y, 0.95);

      // Trailing circular glass follower follows with calibrated fluid damping (factor 0.20)
      followerPos.current.x = lerp(followerPos.current.x, mousePos.current.x, 0.20);
      followerPos.current.y = lerp(followerPos.current.y, mousePos.current.y, 0.20);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      const deltaX = Math.abs(mousePos.current.x - followerPos.current.x);
      const deltaY = Math.abs(mousePos.current.y - followerPos.current.y);

      // Continue loop while moving or converging; sleep when stationary to preserve battery & CPU
      if (isMoving.current || deltaX > 0.05 || deltaY > 0.05) {
        rafId.current = requestAnimationFrame(render);
      } else {
        rafId.current = null;
      }
    };

    const startRaf = () => {
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // First cursor entry or recovery from offscreen
      if (!hasCoords.current || dotPos.current.x < -100) {
        hasCoords.current = true;
        dotPos.current.x = e.clientX;
        dotPos.current.y = e.clientY;
        followerPos.current.x = e.clientX;
        followerPos.current.y = e.clientY;

        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        }
        if (followerRef.current) {
          followerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        }
      }

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      isMoving.current = true;
      startRaf();

      window.clearTimeout(moveTimeout);
      moveTimeout = window.setTimeout(() => {
        isMoving.current = false;
      }, 150);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!hasCoords.current || dotPos.current.x < -100) {
        hasCoords.current = true;
        dotPos.current.x = e.clientX;
        dotPos.current.y = e.clientY;
        followerPos.current.x = e.clientX;
        followerPos.current.y = e.clientY;
      }

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      isMoving.current = true;
      startRaf();
    };

    const handleMouseLeave = () => {
      if (isVisibleRef.current) {
        isVisibleRef.current = false;
        setIsVisible(false);
      }
      if (isHoveredRef.current) {
        isHoveredRef.current = false;
        setIsHovered(false);
      }
      setIsClicking(false);
      if (badgeLabelRef.current !== null) {
        badgeLabelRef.current = null;
        setBadgeLabel(null);
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Designated article / content selector for circular glassmorphism "Read/View" badge
    const articleSelector = [
      "[data-cursor='read']",
      "[data-cursor-badge]",
      "[data-cursor-text]",
      "[data-cursor-article]",
      ".article-card",
      ".cursor-read",
    ].join(", ");

    // Standard interactive elements across all sections and components
    const interactiveSelector = [
      "a",
      "button",
      "input:not([type='hidden'])",
      "textarea",
      "select",
      "[role='button']",
      "[role='link']",
      "label[for]",
      "summary",
      "[data-cursor-interactive]",
      ".cursor-pointer",
    ].join(", ");

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Check for explicitly designated article / editorial card badge
      const articleTarget = target.closest(articleSelector);
      if (articleTarget) {
        const text =
          articleTarget.getAttribute("data-cursor-badge") ||
          articleTarget.getAttribute("data-cursor-text") ||
          (articleTarget.getAttribute("data-cursor") === "read" ? "Read" : null) ||
          "Read";

        if (badgeLabelRef.current !== text) {
          badgeLabelRef.current = text;
          setBadgeLabel(text);
        }
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          setIsHovered(false);
        }
        if (isTextElementRef.current) {
          isTextElementRef.current = false;
          setIsTextElement(false);
        }
        startRaf();
        return;
      } else {
        if (badgeLabelRef.current !== null) {
          badgeLabelRef.current = null;
          setBadgeLabel(null);
        }
      }

      // 2. Check for text input elements
      const textInput = target.closest("input, textarea, select, [contenteditable='true']");
      if (textInput) {
        if (!isTextElementRef.current) {
          isTextElementRef.current = true;
          setIsTextElement(true);
        }
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          setIsHovered(false);
        }
        startRaf();
        return;
      } else {
        if (isTextElementRef.current) {
          isTextElementRef.current = false;
          setIsTextElement(false);
        }
      }

      // 3. Check for standard interactive elements (buttons, links, tags, dock buttons)
      const interactive = target.closest(interactiveSelector);
      if (interactive) {
        if (!isHoveredRef.current) {
          isHoveredRef.current = true;
          setIsHovered(true);
        }
      } else {
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          setIsHovered(false);
        }
      }

      startRaf();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("blur", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("blur", handleMouseLeave);
      window.clearTimeout(moveTimeout);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  const hasBadge = Boolean(badgeLabel);
  const showCursor = isVisible && !isTextElement;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[80] select-none"
    >
      {/* 1. Precision Aiming Liquid Glass Micro-Gem */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform z-[82]"
        style={{
          opacity: showCursor && !hasBadge ? 1 : 0,
          transform: "translate3d(-9999px, -9999px, 0) translate(-50%, -50%)",
          transition: "opacity 0.2s ease",
        }}
      >
        <div
          className={`relative rounded-full transition-all duration-300 ease-out flex items-center justify-center ${
            hasBadge
              ? "scale-0 opacity-0"
              : isHovered
              ? "w-2.5 h-2.5 scale-90"
              : isClicking
              ? "w-2 h-2 scale-75"
              : "w-2.5 h-2.5 scale-100"
          }`}
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #bfe100 45%, #2d2d2a 90%)",
            boxShadow:
              "0 0 8px rgba(191, 225, 0, 0.65), 0 0 2px rgba(45, 45, 42, 0.6), inset -0.5px -0.5px 1px rgba(0, 0, 0, 0.4)",
            border: "0.5px solid rgba(255, 255, 255, 0.95)",
          }}
        >
          {/* Micro specular glint reflecting light from top-left */}
          <span className="absolute top-[1px] left-[1px] w-[1.5px] h-[1.5px] rounded-full bg-white opacity-95" />
        </div>
      </div>

      {/* 2. Unified Trailing Follower: Circular Liquid Glass with Brand Hue */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform flex items-center justify-center z-[81]"
        style={{
          opacity: showCursor ? 1 : 0,
          transform: "translate3d(-9999px, -9999px, 0) translate(-50%, -50%)",
          transition: "opacity 0.25s ease",
        }}
      >
        {/* Layer A: Circular Liquid Glass Lens with Brand Sheen */}
        <div
          className={`absolute rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center ${
            hasBadge
              ? "scale-40 opacity-0 pointer-events-none"
              : isHovered
              ? isClicking
                ? "w-11 h-11 scale-90 opacity-100"
                : "w-12 h-12 scale-100 opacity-100"
              : isClicking
              ? "w-7 h-7 scale-85 opacity-95"
              : "w-9 h-9 scale-100 opacity-95"
          }`}
          style={{
            background: isHovered
              ? "linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, rgba(191, 225, 0, 0.20) 40%, rgba(229, 3, 25, 0.12) 80%, rgba(255, 255, 255, 0.40) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.40) 0%, rgba(191, 225, 0, 0.12) 50%, rgba(255, 255, 255, 0.30) 100%)",
            backdropFilter: "blur(8px) saturate(180%)",
            WebkitBackdropFilter: "blur(8px) saturate(180%)",
            border: isHovered ? "1px solid rgba(45, 45, 42, 0.25)" : "1px solid rgba(45, 45, 42, 0.18)",
            boxShadow: isHovered
              ? "0 8px 24px rgba(45, 45, 42, 0.15), 0 0 12px rgba(191, 225, 0, 0.30), inset 0 1.5px 2px rgba(255, 255, 255, 0.9), inset 0 -1.5px 2px rgba(45, 45, 42, 0.1)"
              : "0 4px 16px rgba(45, 45, 42, 0.08), inset 0 1.2px 1.5px rgba(255, 255, 255, 0.85), inset 0 -1px 1.5px rgba(45, 45, 42, 0.08)",
          }}
        >
          {/* Specular Rim Arc */}
          <div
            className="absolute inset-[1px] rounded-full pointer-events-none opacity-85"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(191, 225, 0, 0.45) 40%, transparent 65%, rgba(229, 3, 25, 0.25) 100%)",
              maskImage: "radial-gradient(circle, transparent 65%, black 72%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 65%, black 72%)",
            }}
          />
        </div>

        {/* Layer B: Liquid Glass Editorial Badge ("Read / View / Visit") */}
        <div
          className={`relative flex items-center justify-center rounded-full select-none pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hasBadge
              ? isClicking
                ? "scale-90 opacity-100"
                : "scale-100 opacity-100"
              : "scale-40 opacity-0 pointer-events-none"
          } ${
            badgeLabel && badgeLabel.length > 5
              ? "px-4 h-10 min-w-[96px]"
              : "w-14 h-14"
          }`}
          style={{
            background:
              "linear-gradient(135deg, rgba(45, 45, 42, 0.95) 0%, rgba(35, 35, 32, 0.94) 100%)",
            backdropFilter: "blur(12px) saturate(180%)",
            WebkitBackdropFilter: "blur(12px) saturate(180%)",
            border: "1px solid rgba(191, 225, 0, 0.35)",
            boxShadow:
              "0 14px 40px rgba(0, 0, 0, 0.35), 0 0 16px rgba(191, 225, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.25), inset 0 -1px 2px rgba(0, 0, 0, 0.4)",
          }}
        >
          <span className="type-caption uppercase tracking-[0.2em] !font-medium flex items-center gap-1 select-none">
            <span className="text-[#bfe100] font-bold">
              {badgeLabel}
            </span>
            <span className="type-caption text-[#e50319] font-bold">↗</span>
          </span>
        </div>
      </div>
    </div>
  );
}
