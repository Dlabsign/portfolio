"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useLenis } from "@/components/SmoothScroll";

import { usePathname, useRouter } from "next/navigation";

interface NavbarProps {
  onNavigate?: (id: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const { lang, setLang } = useLanguage();
  const [activeSection, setActiveSection] = useState("hero");
  const [isHovered, setIsHovered] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();

  // Scroll direction detection to compress/expand dock like Dynamic Island
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY && currentScrollY > 150;
      setIsCompressed(scrollingDown);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver to sync active section indicator with page scroll
  useEffect(() => {
    if (pathname && pathname.startsWith("/projects")) {
      setActiveSection("works");
      return;
    }

    const sectionIds = ["hero", "works", "about", "experience", "capabilities", "contact"];
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-25% 0px -35% 0px",
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const navItems = [
    { id: "works", label: lang === "EN" ? "Works" : "Karya", short: "01" },
    { id: "about", label: lang === "EN" ? "About" : "Tentang", short: "02" },
    { id: "experience", label: lang === "EN" ? "Experience" : "Pengalaman", short: "03" },
    { id: "capabilities", label: lang === "EN" ? "Capabilities" : "Keahlian", short: "04" },
    { id: "contact", label: lang === "EN" ? "Contact" : "Kontak", short: "05" },
  ];

  const lenis = useLenis();

  const handleNavClick = (id: string) => {
    setActiveSection(id);

    if (pathname && pathname !== "/") {
      if (id === "hero") {
        router.push("/");
      } else if (id === "works") {
        if (pathname === "/projects") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          router.push("/projects");
        }
      } else {
        router.push(`/#${id}`);
      }
      return;
    }

    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        if (lenis) {
          lenis.scrollTo(el, { duration: 1.15, offset: 0 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  // Expand when hovered even if scrolling down
  const showExpanded = !isCompressed || isHovered;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none">
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        layout
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 28,
          mass: 0.8,
        }}
        className="relative flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-[#2d2d2a]/92 backdrop-blur-md border border-white/10 shadow-[0_12px_40px_rgba(45,45,42,0.22)]"
      >
        {/* Brand / Dynamic Island Monogram & Live Status */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          onClick={() => handleNavClick("hero")}
          aria-label="Scroll to top"
          className="relative flex items-center px-3 py-1.5 rounded-full text-white hover:text-[#bfe100] font-sans text-xs font-bold tracking-tight transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e50319]"
          title="Scroll to Top"
        >
          <span className="tracking-wider">DK</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#bfe100] ml-1.5 shadow-[0_0_6px_#bfe100]" />
        </motion.button>

        {/* Divider hairline inside dock */}
        <div className="w-[1px] h-3.5 bg-white/15 mx-0.5" />

        {/* Navigation Items */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-sans transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e50319] ${
                  isActive
                    ? "text-[#bfe100] font-semibold"
                    : "text-[#96958f] hover:text-white"
                }`}
              >
                {/* Active Sliding Background Pill (LayoutId) */}
                {isActive && (
                  <motion.div
                    layoutId="activeDockIndicator"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 30,
                    }}
                    className="absolute inset-0 rounded-full bg-white/10 border border-[#bfe100]/30 backdrop-blur-sm -z-10"
                  />
                )}

                {/* Dynamic Island Text Content: Responsive expansion */}
                <motion.span layout="position" className="inline-block">
                  {showExpanded ? (
                    <span>{item.label}</span>
                  ) : (
                    <span className="font-sans font-medium text-[11px]">{item.short}</span>
                  )}
                </motion.span>
              </motion.button>
            );
          })}
        </div>

        {/* Divider hairline before Language Toggle */}
        <div className="w-[1px] h-3.5 bg-white/15 mx-1" />

        {/* Minimalist Language Switcher inside Floating Island Dock: ID | EN */}
        <div className="flex items-center px-2 py-1 text-[11px] font-sans font-medium text-[#96958f]">
          <button
            type="button"
            onClick={() => setLang("ID")}
            aria-label="Bahasa Indonesia"
            className={`px-1 py-0.5 rounded transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e50319] ${
              lang === "ID"
                ? "text-[#bfe100] font-bold"
                : "text-[#96958f] hover:text-white"
            }`}
          >
            ID
          </button>
          <span className="mx-1 text-white/20 select-none">|</span>
          <button
            type="button"
            onClick={() => setLang("EN")}
            aria-label="English Language"
            className={`px-1 py-0.5 rounded transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e50319] ${
              lang === "EN"
                ? "text-[#bfe100] font-bold"
                : "text-[#96958f] hover:text-white"
            }`}
          >
            EN
          </button>
        </div>
      </motion.div>
    </nav>
  );
}
