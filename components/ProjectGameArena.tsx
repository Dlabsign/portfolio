"use client";

import React, { useState, useRef } from "react";
import { Maximize2, RotateCcw, ExternalLink, Gamepad2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ProjectGameArenaProps {
  gameUrl: string;
  title: string;
  controlsHint?: {
    EN: string;
    ID: string;
  };
}

export default function ProjectGameArena({ gameUrl, title, controlsHint }: ProjectGameArenaProps) {
  const { lang } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRestart = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        window.open(gameUrl, "_blank");
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 my-8 sm:my-10">
      {/* Sleek Minimalist Arena Bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-t-xl bg-[#2d2d2a] text-white border border-[#2d2d2a] border-b-0">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-[#bfe100]" />
          <span className="type-caption !font-medium text-white/90">
            {lang === "EN" ? "Arcade Championship Arena" : "Arena Pertandingan Arcade"}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleRestart}
            title={lang === "EN" ? "Restart Match" : "Mulai Ulang"}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 type-caption text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#bfe100]"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">
              {lang === "EN" ? "Restart" : "Reset"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleFullscreen}
            title={lang === "EN" ? "Fullscreen Mode" : "Layar Penuh"}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 type-caption text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#bfe100]"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">
              {lang === "EN" ? "Fullscreen" : "Layar Penuh"}
            </span>
          </button>

          <a
            href={gameUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={lang === "EN" ? "Open in New Window" : "Buka di Jendela Baru"}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#bfe100]/20 hover:bg-[#bfe100]/30 text-[#bfe100] type-caption transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#bfe100]"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline">
              {lang === "EN" ? "New Tab" : "Tab Baru"}
            </span>
          </a>
        </div>
      </div>

      {/* Embedded Game Canvas Iframe Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] bg-[#1f1f1d] rounded-b-xl overflow-hidden border border-[#2d2d2a] shadow-lg"
      >
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1f1f1d] text-white z-10 gap-2">
            <div className="w-7 h-7 border-2 border-[#bfe100] border-t-transparent rounded-full animate-spin" />
            <span className="type-caption text-[#96958f]">
              {lang === "EN" ? "Loading canvas engine..." : "Memuat mesin canvas..."}
            </span>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={gameUrl}
          title={title}
          allow="autoplay; fullscreen"
          onLoad={() => setIsLoading(false)}
          className="w-full h-full border-0 block"
        />
      </div>

      {/* Understated Controls Hint */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 type-caption text-[#96958f]">
        <span>
          {controlsHint
            ? controlsHint[lang]
            : (lang === "EN"
                ? "Controls: Arrow Keys / WASD to move • Space to smash • Up / W to lob"
                : "Kontrol: Panah / WASD untuk bergerak • Spasi untuk smash • Panah Atas / W untuk lob")}
        </span>
        <span className="text-[#96958f]">
          {lang === "EN" ? "Click arena to enable sound" : "Klik arena untuk aktifkan suara"}
        </span>
      </div>
    </div>
  );
}
