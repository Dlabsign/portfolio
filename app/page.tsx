"use client";

import React from "react";
import SmoothScroll, { useLenis } from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContentList from "@/components/ContentList";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Capabilities from "@/components/Capabilities";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <HomeContent />
    </SmoothScroll>
  );
}

function HomeContent() {
  const lenis = useLenis();

  const scrollToSection = (id: string) => {
    const cleanId = id.replace("#", "");
    const el = document.getElementById(cleanId);
    if (!el) return;

    if (lenis) {
      lenis.scrollTo(el, { duration: 1.15, offset: 0 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] text-[#2d2d2a] flex flex-col font-sans selection:bg-[#bfe100] selection:text-[#2d2d2a]">
      {/* Floating Dock Navbar with Integrated Language Switcher */}
      <Navbar onNavigate={scrollToSection} />

      {/* Natural Continuous Flow Across All Sections */}
      <main className="relative w-full flex flex-col">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Selected Works */}
        <ContentList />

        {/* 3. About */}
        <About />

        {/* 4. Experience */}
        <Experience />

        {/* 5. Capabilities */}
        <Capabilities />

        {/* 6. Contact / Footer */}
        <Footer />
      </main>
    </div>
  );
}
