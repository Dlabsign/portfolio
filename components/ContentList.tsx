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
import { ArrowUpRight, ArrowRight, Layers } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

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
  isGame?: boolean;
}

// Landing Page: Interactive Games, Web and Mobile App projects
const PROJECTS: ProjectItem[] = [
  {
    id: "super-smash-badminton",
    number: "01",
    title: "Super Smash Badminton Arcade",
    category: {
      EN: "Interactive Arcade Game",
      ID: "Game Arcade Interaktif",
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
      EN: "Interactive Typing Arcade",
      ID: "Game Balap Ketik Arcade",
    },
    summary: {
      EN: "Fast-paced arcade stadium typing race featuring animated sprinters, dynamic lane physics, procedural crowd cheers, and real-time WPM tracking.",
      ID: "Game balap ketik arcade di stadion dengan pelari beranimasi, fisika lintasan dinamis, sorak penonton prosedural, dan kalkulasi WPM serta akurasi real-time.",
    },
    stack: ["HTML5", "CSS3 Animation", "JavaScript", "Web Audio API"],
    link: "/projects/type-racing-stadium",
    image: "/project/type_racing_stadium.png",
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
  const yBanner = useTransform(smoothProgress, [0, 1], [30, -15]);

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
      className="relative w-full min-h-screen bg-[#FAFAFA] border-t border-[#E5E4E0] flex flex-col justify-center py-16 sm:py-20 md:py-24 overflow-hidden"
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
              className="relative w-[340px] lg:w-[400px] aspect-[16/10] rounded-xl overflow-hidden bg-[#2d2d2a] border border-[#2d2d2a]/20 shadow-[0_24px_60px_rgba(0,0,0,0.35),0_0_25px_rgba(191,225,0,0.2)]"
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
                  <Image
                    src={hoveredProject.image}
                    alt={hoveredProject.title}
                    fill
                    sizes="400px"
                    priority
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2d2d2a]/90 via-[#2d2d2a]/20 to-transparent pointer-events-none" />

                  {/* Editorial Tag & Title at Bottom of Preview */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white pointer-events-none">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="type-caption text-[#bfe100] font-mono font-bold shrink-0">
                        {hoveredProject.number}
                      </span>
                      <span className="type-caption text-white font-medium truncate">
                        {hoveredProject.title}
                      </span>
                    </div>
                    <span className="type-caption px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[#bfe100] border border-white/10 uppercase tracking-caption font-semibold shrink-0">
                      {hoveredProject.category[lang]}
                    </span>
                  </div>
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
          className="pb-6 sm:pb-8 border-b border-[#E5E4E0] flex flex-wrap items-baseline justify-between gap-4"
        >
          <div className="p-0 m-0">
            <h2 className="p-0 m-0 type-h2 font-headline uppercase text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300 cursor-default">
              {lang === "EN" ? "Selected Works" : "Karya Terpilih"}
            </h2>
          </div>

          <Link
            href="/projects"
            className="group/all flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E4E0] hover:border-[#2d2d2a] type-button uppercase tracking-wider text-[#6e6e69] hover:text-[#2d2d2a] transition-all duration-300 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e50319]"
          >
            <Layers className="w-3.5 h-3.5 text-[#96958f] group-hover/all:text-[#e50319] transition-colors duration-300" />
            <span>{lang === "EN" ? "All Projects Archive" : "Arsip Seluruh Proyek"}</span>
            <span className="transform group-hover/all:translate-x-1 text-[#e50319] transition-transform duration-300">→</span>
          </Link>
        </motion.div>

        {/* Pure Typographic Editorial Project List with Smooth Cursor Hover Image Preview */}
        <motion.div
          style={{ y: yList }}
          onMouseLeave={() => setHoveredProject(null)}
          className="divide-y divide-[#E5E4E0] pt-4 sm:pt-6"
        >
          {PROJECTS.map((project, idx) => (
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
            >
              <Link
                href={project.link}
                data-cursor-interactive="true"
                onMouseEnter={() => setHoveredProject(project)}
                className="group block py-6 sm:py-8 transition-colors duration-300 relative rounded-xl -mx-4 px-4 sm:-mx-6 sm:px-6 hover:bg-[#F5F5F2]"
              >
                {/* Expanding Hairline on Hover with Primary Scarlet Accent */}
                <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-[#e50319] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-10 pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
                  {/* Left Column: Number Index & Category */}
                  <div className="md:col-span-3 flex items-center md:flex-col md:items-start justify-between md:justify-start gap-1">
                    <span className="type-caption font-semibold text-[#96958f] group-hover:text-[#e50319] transition-colors duration-300">
                      {project.number}
                    </span>
                    <span className="type-caption text-[#96958f] group-hover:text-[#6e6e69] transition-colors duration-300 uppercase tracking-caption">
                      {project.category[lang]}
                    </span>
                  </div>

                  {/* Middle Column: Title & Summary */}
                  <div className="md:col-span-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="p-0 m-0 type-h3 font-headline text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">
                        {project.title}
                      </h3>
                      {project.isGame && (
                        <span className="px-2 py-0.5 rounded-full bg-[#bfe100]/20 text-[#2d2d2a] border border-[#bfe100]/40 type-caption uppercase tracking-caption font-semibold transition-colors duration-300 shrink-0">
                          {lang === "EN" ? "Arcade" : "Game"}
                        </span>
                      )}
                    </div>
                    <p className="type-small text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300 max-w-xl">
                      {project.summary[lang]}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="type-caption px-2 py-0.5 rounded-sm bg-[#F5F5F2] group-hover:bg-[#EAE8E3] text-[#6e6e69] group-hover:text-[#2d2d2a] border border-[#E5E4E0] transition-colors duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Interactive Action Arrow */}
                  <div className="md:col-span-3 flex items-center md:justify-end mt-2 md:mt-0">
                    <div className="inline-flex items-center gap-1.5 type-button text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">
                      <span className="uppercase tracking-wider">
                        {lang === "EN" ? "Explore Case Study" : "Buka Studi Kasus"}
                      </span>
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-[#96958f] group-hover:text-[#e50319]" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Callout Banner with Parallax */}
        <motion.div
          style={{ y: yBanner }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mt-14 p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E4E0] hover:border-[#2d2d2a] transition-colors duration-300 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs group"
        >
          <div>
            <span className="type-caption uppercase tracking-caption text-[#96958f] group-hover:text-[#2d2d2a] transition-colors duration-300 block">
              {lang === "EN" ? "Archive & Visual Gallery" : "Arsip & Galeri Visual"}
            </span>
            <h3 className="type-h4 text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300 mt-1">
              {lang === "EN"
                ? "Explore visual previews, screenshots, and filtered categories."
                : "Jelajahi pratinjau visual, tangkapan layar, dan kategori terpilih."}
            </h3>
            <p className="type-small text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300 mt-1 max-w-xl">
              {lang === "EN"
                ? "Visit the dedicated Work page for full project galleries, screenshots, and live previews."
                : "Kunjungi halaman Work khusus untuk melihat galeri visual lengkap, tangkapan layar, dan pratinjau."}
            </p>
          </div>

          <Link
            href="/projects"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2d2d2a] hover:bg-[#1f1f1d] text-[#FAFAFA] hover:text-[#bfe100] type-button uppercase tracking-wider transition-colors duration-300 shadow-sm border border-transparent hover:border-[#bfe100]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e50319]"
          >
            <span>{lang === "EN" ? "Open Work Archive" : "Buka Halaman Work"}</span>
            <ArrowRight className="w-4 h-4 text-[#bfe100]" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
