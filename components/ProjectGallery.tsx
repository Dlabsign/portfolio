"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev > 0 ? prev - 1 : images.length - 1) : null
        );
      }
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev < images.length - 1 ? prev + 1 : 0) : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full my-12 sm:my-16">
      {/* Clean Visual Grid */}
      <div
        className={`grid gap-6 sm:gap-8 ${
          images.length === 1
            ? "grid-cols-1"
            : images.length === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {images.map((src, idx) => (
          <motion.div
            key={src + idx}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setSelectedIndex(idx)}
            className="group relative cursor-pointer rounded-xl overflow-hidden border border-[#E5E4E0] bg-[#F5F5F2] shadow-xs hover:border-[#2d2d2a] hover:shadow-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e50319]"
            tabIndex={0}
            role="button"
            aria-label={`${title} screenshot ${idx + 1}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedIndex(idx);
              }
            }}
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#EAE8E3]">
              <Image
                src={src}
                alt={`${title} preview ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />

              {/* Minimalist Hover Overlay */}
              <div className="absolute inset-0 bg-[#2d2d2a]/0 group-hover:bg-[#2d2d2a]/15 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full bg-[#2d2d2a]/90 text-[#bfe100] border border-[#bfe100]/30 type-caption !font-medium flex items-center gap-1.5 backdrop-blur-sm shadow-md">
                  <ZoomIn className="w-3.5 h-3.5 text-[#bfe100]" />
                  <span>Enlarge</span>
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Accessible Minimalist Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-50 bg-[#2d2d2a]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 select-none"
            role="dialog"
            aria-modal="true"
            aria-label="Image preview modal"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-[#bfe100] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e50319]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation: Prev */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) =>
                    prev !== null ? (prev > 0 ? prev - 1 : images.length - 1) : null
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-[#bfe100] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e50319]"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Navigation: Next */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) =>
                    prev !== null ? (prev < images.length - 1 ? prev + 1 : 0) : null
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-[#bfe100] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e50319]"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Modal Image Display */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            >
              <div className="relative w-full h-[75vh] flex items-center justify-center">
                <Image
                  src={images[selectedIndex]}
                  alt={`${title} enlarged view ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Lightbox Caption */}
              <div className="mt-4 flex items-center justify-between w-full max-w-md px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-white type-caption !font-medium">
                <span>{title}</span>
                <span className="text-[#bfe100] font-bold">
                  {selectedIndex + 1} / {images.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
