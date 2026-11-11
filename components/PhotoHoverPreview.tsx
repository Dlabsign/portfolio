"use client";

import React, { useState } from "react";
import Image from "next/image";

interface PhotoHoverPreviewProps {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  baseClassName?: string;
  imageClassName?: string;
  enlargedWidth?: string;
  placement?: "left" | "right" | "top" | "bottom";
  isLogoWhiteBg?: boolean;
}

export default function PhotoHoverPreview({
  src,
  alt,
  title,
  subtitle,
  badge,
  baseClassName = "w-12 h-12 rounded-xl",
  imageClassName = "object-cover",
  enlargedWidth = "w-72 sm:w-84 md:w-96",
  placement = "right",
  isLogoWhiteBg = false,
}: PhotoHoverPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine popover positioning based on placement prop and responsive breakpoints
  let popoverPlacementClass = "";
  if (placement === "left") {
    // Desktop: pop to the left; Mobile: pop above
    popoverPlacementClass =
      "right-0 sm:right-full sm:mr-3.5 bottom-full sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 mb-3 sm:mb-0";
  } else if (placement === "top") {
    popoverPlacementClass = "bottom-full left-1/2 -translate-x-1/2 mb-3.5";
  } else if (placement === "bottom") {
    popoverPlacementClass = "top-full left-1/2 -translate-x-1/2 mt-3.5";
  } else {
    // Default right: Desktop: pop to the right; Mobile: pop above
    popoverPlacementClass =
      "left-0 sm:left-full sm:ml-3.5 bottom-full sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 mb-3 sm:mb-0";
  }

  return (
    <div
      className="relative inline-block shrink-0 group/photo z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`Preview ${title || alt}`}
    >
      {/* =====================================================================
          1. BASE THUMBNAIL (Preserves page layout with 0 pixel shifts, borderless)
      ===================================================================== */}
      <div
        className={`relative ${baseClassName} overflow-hidden transition-transform duration-300 cursor-pointer flex items-center justify-center shrink-0 ${
          isLogoWhiteBg ? "bg-white" : "bg-transparent"
        }`}
      >
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="160px"
            className={`${imageClassName} transition-transform duration-300 ease-out group-hover/photo:scale-110`}
            unoptimized
          />
        </div>
      </div>

      {/* =====================================================================
          2. FLOATING PROPORTIONAL ENLARGED PREVIEW (Appears above on hover)
          - High z-index (z-50) so it's never obscured
          - Pure visual display ONLY (no text, title, caption, or badges)
          - Preserves full natural aspect ratio (object-contain)
          - Smooth cubic-bezier transition, borderless
      ===================================================================== */}
      <div
        aria-hidden={!isHovered}
        className={`pointer-events-none absolute ${popoverPlacementClass} z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHovered
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-90 invisible"
        }`}
      >
        <div
          className={`${enlargedWidth} p-1.5 sm:p-2 rounded-2xl bg-[#000000]/95 shadow-[0_24px_60px_rgba(0,0,0,0.95)] flex items-center justify-center backdrop-blur-md overflow-hidden`}
        >
          {/* Photo Display with Pure Proportional Aspect Ratio - Visual Only, No Text */}
          <div
            className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center ${
              isLogoWhiteBg ? "bg-white p-4" : "bg-[#000000] p-3"
            } border border-[#262626]`}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="500px"
              className={imageClassName.includes("object-cover") ? "object-cover" : "object-contain"}
              priority={isHovered}
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}

