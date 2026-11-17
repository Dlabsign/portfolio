"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight, Layers } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import SmoothWeightText from "./SmoothWeightText";
import { TextRoll } from "@/components/core/text-roll";

interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: {
    EN: string;
    ID: string;
  };
  summary: {
    EN: string;
    ID: string;
  };
  stack: string[];
  link: string;
  image: string;
  video?: string;
  isGame?: boolean;
}

// Landing Page: Interactive Games, Web and Mobile App projects
const PROJECTS: ProjectItem[] = [
  {
    id: "super-smash-badminton",
    number: "01",
    title: "Super Smash Badminton Arcade",
    category: {
      EN: "Arcade Game",
      ID: "Game Arcade",
    },
    summary: {
      EN: "2D arcade badminton championship featuring high-drag shuttlecock physics, responsive jump-smashes, and tournament AI.",
      ID: "Game turnamen bulutangkis arcade 2D dengan simulasi fisika kok berhambatan tinggi, mekanik jump-smash responsif, dan AI turnamen.",
    },
    stack: ["HTML5 Canvas", "JavaScript", "Web Audio API", "Tailwind CSS"],
    link: "/projects/super-smash-badminton",
    image: "/project/super_smash_badminton.png",
    isGame: true,
  },
  {
    id: "type-racing-stadium",
    number: "02",
    title: "Type Racing Stadium Edition",
    category: {
      EN: "Typing Game",
      ID: "Game Ketik",
    },
    summary: {
      EN: "Fast-paced arcade stadium typing race featuring animated sprinters, dynamic lane physics, procedural crowd cheers, and real-time WPM tracking.",
      ID: "Game balap ketik arcade di stadion dengan pelari beranimasi, fisika lintasan dinamis, sorak penonton prosedural, dan kalkulasi WPM serta akurasi real-time.",
    },
    stack: ["HTML5", "CSS3 Animation", "JavaScript", "Web Audio API"],
    link: "/projects/type-racing-stadium",
    image: "/project/type_racing_stadium.png",
    video: "/project/Video/TypeRacing.mp4",
    isGame: true,
  },
  {
    id: "icy-goat",
    number: "03",
    title: "ICY - GOAT",
    category: {
      EN: "Discovery & Travel Platform",
      ID: "Platform Penjelajahan Wisata",
    },
    summary: {
      EN: "Curated travel agency platform offering affordable vacation packages for couples seeking simple, adventurous experiences with intuitive booking navigation.",
      ID: "Platform agen perjalanan dengan paket liburan terjangkau bagi pasangan petualang, menghadirkan kemudahan akses informasi dan navigasi intuitif.",
    },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    link: "/projects/icy-goat",
    image: "https://framerusercontent.com/images/izIVdmfjSIdiFDc4RGeoLvvun0.jpg?width=4786&height=3961",
  },
  {
    id: "kabaabs",
    number: "04",
    title: "Kabaabs",
    category: {
      EN: "Web Application & Ordering",
      ID: "Aplikasi Web & Pemesanan",
    },
    summary: {
      EN: "A culinary ordering application engineered with Next.js for immediate page transitions and low-latency cart state management.",
      ID: "Aplikasi pemesanan kuliner berbasis Next.js dengan transisi halaman instan dan manajemen status keranjang latensi rendah.",
    },
    stack: ["Next.js", "React", "Tailwind CSS", "Node.js"],
    link: "/projects/kabaabs",
    image: "https://framerusercontent.com/images/tkIoxOLMI4jnsjJTPn7fBFOMOxg.jpg?width=4000&height=3000",
  },
  {
    id: "movie-app",
    number: "05",
    title: "Movie Ticketing Mobile App",
    category: {
      EN: "Mobile App UI/UX System",
      ID: "Sistem Desain & UI/UX Mobile",
    },
    summary: {
      EN: "Ergonomic dark-mode mobile cinema booking application designed for low-light theater lobbies with rapid seat reservation.",
      ID: "Desain UI/UX aplikasi mobile pemesanan tiket bioskop bersuasana dark mode sinematik untuk pemesanan kursi cepat.",
    },
    stack: ["Figma", "UI/UX Design", "Mobile Prototyping", "Design System"],
    link: "/projects/movie-app",
    image: "https://framerusercontent.com/images/wxeQMFysREBTqzNuKQCdcXWgm8.jpg?width=6000&height=4500",
  },
  {
    id: "smart-vending",
    number: "06",
    title: "Smart Fruit Salad & Vending Machine",
    category: {
      EN: "IoT & Mobile Ordering",
      ID: "Pemesanan Mobile & IoT",
    },
    summary: {
      EN: "Award-winning fresh salad and juice mobile ordering system synced with smart vending hardware. Gold Medal winner at JISF.",
      ID: "Aplikasi mobile pemesanan salad buah dan jus segar terintegrasi mesin vending pintar. Peraih Medali Emas di JISF.",
    },
    stack: ["Figma", "Mobile UI/UX", "IoT Interaction", "Design System"],
    link: "/projects/smart-vending",
    image: "https://framerusercontent.com/images/RQCm4RiltfekMUhcXo80ZXJD7v0.jpg?width=6000&height=4500",
  },
  {
    id: "sap-mdg",
    number: "07",
    title: "SAP Master Data Governance (MDG)",
    category: {
      EN: "Enterprise Staging Platform",
      ID: "Platform Tata Kelola Master Data",
    },
    summary: {
      EN: "Enterprise SAP Master Data Governance web platform streamlining multi-level approval workflows for Material Master, Business Partner, and Purchasing Info Records.",
      ID: "Platform web tata kelola master data enterprise berbasis SAP BSP untuk standardisasi dan alur persetujuan bertingkat Material Master, Business Partner, dan Info Record.",
    },
    stack: ["SAP ABAP", "SAP BSP", "SAP S/4HANA", "Tailwind CSS"],
    link: "/projects/sap-mdg",
    image: "/project/landing-page-mdg.png",
  },
  {
    id: "becak-racing",
    number: "08",
    title: "BeCak Racing",
    category: {
      EN: "Motorsport & Mobile UI/UX",
      ID: "Motorsport & UI/UX Mobile",
    },
    summary: {
      EN: "High-octane mobile UI/UX experience and interactive motorsport portal celebrating Indonesian urban street racing culture with extreme speed.",
      ID: "Pengalaman digital mobile UI/UX bertenaga tinggi dan portal motorsport interaktif yang mengangkat kultur balap jalanan perkotaan Indonesia.",
    },
    stack: ["Figma", "Mobile UI/UX", "Next.js", "Tailwind CSS"],
    link: "/projects/becak-racing",
    image: "/project/becak-racing.png",
  },
];

export default function ContentList() {
  const { lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredProject, setHoveredProject] = useState<ProjectItem | null>(null);

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

  const yHeader = useTransform(smoothProgress, [0, 1], [-22, 22]);
  const yList = useTransform(smoothProgress, [0, 1], [18, -18]);

  // Spring cursor coordinates for floating hover preview
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <section
      ref={sectionRef}
      id="works"
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen bg-[#000000] border-t border-[#262626] flex flex-col justify-center py-16 sm:py-20 md:py-24 overflow-hidden"
    >
      {/* Floating Cursor Image Preview Follower */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-30 hidden md:block select-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <AnimatePresence>
          {hoveredProject && (
            <motion.div
              key="hover-preview-card"
              initial={{ opacity: 0, scale: 0.72, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.72, rotate: 2 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[220px] sm:w-[260px] aspect-[16/10] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={hoveredProject.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  {hoveredProject.video ? (
                    <video
                      src={hoveredProject.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <Image
                      src={hoveredProject.image}
                      alt={hoveredProject.title}
                      fill
                      sizes="260px"
                      priority
                      className="object-cover object-top"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-center flex-1">
        {/* Section Header with Parallax & Smooth Hover */}
        <motion.div
          style={{ y: yHeader }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pb-6 sm:pb-8 border-b border-[#262626] flex flex-wrap items-baseline justify-between gap-4"
        >
          <div className="p-0 m-0">
            <h2 className="p-0 m-0 type-h2 font-headline uppercase text-[#fafafa] hover:text-[#fafafa] transition-colors duration-300 cursor-default">
              <TextRoll key={`works-title-${lang}`}>
                {lang === "EN" ? "Selected Works" : "Karya Terpilih"}
              </TextRoll>
            </h2>
          </div>

          <Link
            href="/projects"
            className="group/all flex items-center gap-2 type-button uppercase tracking-wider text-[#fafafa]/80 hover:text-[#fafafa] transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#fafafa]"
          >
            <Layers className="w-3.5 h-3.5 text-[#fafafa]/70 group-hover/all:text-[#fafafa] transition-colors duration-300" />
            <SmoothWeightText hoverTarget="group/all">
              {lang === "EN" ? "All Projects Archive" : "Arsip Seluruh Proyek"}
            </SmoothWeightText>
            <span className="transform group-hover/all:translate-x-1 text-[#fafafa]/70 group-hover/all:text-[#fafafa] transition-all duration-300">→</span>
          </Link>
        </motion.div>

        {/* Pure Typographic Editorial Project List with Smooth Cursor Hover Image Preview */}
        <motion.div
          style={{ y: yList }}
          onMouseLeave={() => setHoveredProject(null)}
          className="divide-y divide-[#262626] pt-4 sm:pt-6"
        >
          {PROJECTS.map((project, idx) => {
            const isHovered = hoveredProject?.id === project.id;
            const isDimmed = hoveredProject !== null && !isHovered;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseEnter={() => setHoveredProject(project)}
                className={`transition-opacity duration-300 ${isDimmed ? "opacity-30" : "opacity-100"}`}
              >
                <Link
                  href={project.link}
                  data-cursor-interactive="true"
                  onMouseEnter={() => setHoveredProject(project)}
                  className="group block py-5 sm:py-6 relative -mx-4 px-4 sm:-mx-6 sm:px-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Title: PP Neue Montreal Font with Smooth Weight Crossfade & Subtle Magnetic Slide */}
                    <div className="flex items-center gap-3 transform group-hover:translate-x-2 sm:group-hover:translate-x-3.5 transition-transform duration-300 ease-out">
                      <h3 className="p-0 m-0 type-h3 font-headline text-[#fafafa]">
                        <SmoothWeightText active={isHovered}>
                          {project.title}
                        </SmoothWeightText>
                      </h3>
                    </div>

                    {/* Right Column: Interactive Action Arrow Only (Smooth directional glide) */}
                    <div className="inline-flex items-center justify-center p-2 text-[#fafafa]/50 group-hover:text-[#fafafa] transition-colors duration-300 shrink-0">
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 ease-out" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
