"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const navRef = useRef<HTMLElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();

  // Boundary lock: navbar follows until the education section, after which it stops following down to the bottom of the page
  useEffect(() => {
    const BASE_BOTTOM = 12; // 12px for tight, elegant bottom spacing (no excessive space)

    if (pathname !== "/") {
      if (navRef.current) {
        navRef.current.style.bottom = `${BASE_BOTTOM}px`;
        navRef.current.style.opacity = "1";
        navRef.current.style.pointerEvents = "auto";
      }
      return;
    }

    let ticking = false;

    const updatePosition = () => {
      if (!navRef.current) return;
      const boundary = document.getElementById("education-boundary") || document.getElementById("experience");
      if (!boundary) return;

      const rect = boundary.getBoundingClientRect();
      // Distance from top of viewport to the boundary line
      const limit = window.innerHeight - BASE_BOTTOM;

      if (rect.bottom < limit) {
        // Viewport has scrolled past the education boundary!
        // Pin navbar to the boundary so it doesn't follow to the bottom
        const delta = limit - rect.bottom;
        const newBottom = BASE_BOTTOM + delta;
        navRef.current.style.bottom = `${newBottom}px`;

        // Smoothly fade out as user scrolls further into the footer
        const fadeProgress = Math.min(1, Math.max(0, delta / 160));
        const opacity = 1 - fadeProgress;
        navRef.current.style.opacity = opacity.toString();
        navRef.current.style.pointerEvents = opacity < 0.05 ? "none" : "auto";
      } else {
        // Above boundary: float normally close to bottom
        navRef.current.style.bottom = `${BASE_BOTTOM}px`;
        navRef.current.style.opacity = "1";
        navRef.current.style.pointerEvents = "auto";
      }
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    updatePosition();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [pathname]);

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

    const sectionIds = ["hero", "works", "about", "capabilities", "experience", "contact"];
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
    { id: "capabilities", label: lang === "EN" ? "Capabilities" : "Keahlian", short: "03" },
    { id: "experience", label: lang === "EN" ? "Experience" : "Pengalaman", short: "04" },
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
    <nav ref={navRef} className="fixed bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none transition-opacity duration-150">
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
        className="relative flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-[#0d0d0d]/92 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
      >
        {/* Brand / Dynamic Island Monogram & Live Status */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          onClick={() => handleNavClick("hero")}
          aria-label="Scroll to top"
          className="relative flex items-center px-3 py-1.5 rounded-full text-[#fafafa] hover:text-[#bfe100] font-sans text-xs font-bold tracking-tight transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#fafafa]"
          title="Scroll to Top"
        >
          <span className="tracking-wider">DK</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#bfe100] ml-1.5 shadow-[0_0_6px_#bfe100]" />
        </motion.button>

        {/* Divider hairline inside dock */}
        <div className="w-[1px] h-3.5 bg-white/10 mx-0.5" />

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
                className={`relative px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-sans transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#fafafa] ${
                  isActive
                    ? "text-[#bfe100] font-semibold"
                    : "text-[#fafafa]/80 hover:text-[#fafafa]"
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
                    className="absolute inset-0 rounded-full bg-[#1c1c1c] backdrop-blur-sm -z-10"
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
        <div className="w-[1px] h-3.5 bg-white/10 mx-1" />

        {/* Minimalist Language Switcher inside Floating Island Dock: ID | EN */}
        <div className="flex items-center px-2 py-1 text-[11px] font-sans font-medium text-[#fafafa]/80">
          <button
            type="button"
            onClick={() => setLang("ID")}
            aria-label="Bahasa Indonesia"
            className={`px-1 py-0.5 rounded transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#fafafa] ${
              lang === "ID"
                ? "text-[#bfe100] font-bold"
                : "text-[#fafafa]/80 hover:text-[#fafafa]"
            }`}
          >
            ID
          </button>
          <span className="mx-1 text-[#404040] select-none">|</span>
          <button
            type="button"
            onClick={() => setLang("EN")}
            aria-label="English Language"
            className={`px-1 py-0.5 rounded transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#fafafa] ${
              lang === "EN"
                ? "text-[#bfe100] font-bold"
                : "text-[#fafafa]/80 hover:text-[#fafafa]"
            }`}
          >
            EN
          </button>
        </div>
      </motion.div>
    </nav>
  );
}
