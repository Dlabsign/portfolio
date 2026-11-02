"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowUpRight, Layers, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  DETAILED_PROJECTS,
  CATEGORIES_CONFIG,
  CategoryFilter,
  DetailedProject,
} from "@/lib/projects-data";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";

export default function ProjectsPage() {
  const { lang, setLang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const pageContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pageContainerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    mass: 0.5,
  });

  const yHeader = useTransform(smoothProgress, [0, 1], [0, -20]);
  const yContent = useTransform(smoothProgress, [0, 1], [15, -25]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const websiteCount = DETAILED_PROJECTS.filter(
      (p) => p.categoryKey === "website"
    ).length;
    const graphicCount = DETAILED_PROJECTS.filter(
      (p) => p.categoryKey === "graphic-design"
    ).length;
    return {
      all: DETAILED_PROJECTS.length,
      website: websiteCount,
      "graphic-design": graphicCount,
    };
  }, []);

  // Filter projects by search query
  const searchFilteredProjects = useMemo(() => {
    return DETAILED_PROJECTS.filter((project) => {
      if (searchQuery.trim() === "") return true;
      const q = searchQuery.toLowerCase();
      return (
        project.title.toLowerCase().includes(q) ||
        project.summary[lang].toLowerCase().includes(q) ||
        project.stack.some((tech) => tech.toLowerCase().includes(q)) ||
        project.client.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, lang]);

  // Separate projects into the 2 distinct categories: Website & Graphic Design
  const websiteProjects = useMemo(() => {
    return searchFilteredProjects.filter((p) => p.categoryKey === "website");
  }, [searchFilteredProjects]);

  const graphicDesignProjects = useMemo(() => {
    return searchFilteredProjects.filter((p) => p.categoryKey === "graphic-design");
  }, [searchFilteredProjects]);

  // Whether any projects exist in the current active filter view
  const hasVisibleProjects =
    selectedCategory === "all"
      ? websiteProjects.length > 0 || graphicDesignProjects.length > 0
      : selectedCategory === "website"
      ? websiteProjects.length > 0
      : graphicDesignProjects.length > 0;

  return (
    <SmoothScroll>
      <div
        ref={pageContainerRef}
        className="min-h-screen bg-[#FAFAFA] text-[#2d2d2a] font-sans selection:bg-[#bfe100] selection:text-[#2d2d2a] flex flex-col justify-between"
      >
        {/* Top Minimalist Header & Breadcrumbs */}
        <header className="sticky top-0 z-40 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-[#E5E4E0] transition-colors">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="group flex items-center gap-2 type-caption uppercase text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                <span>{lang === "EN" ? "Portfolio" : "Beranda"}</span>
              </Link>
              <span className="text-[#E5E4E0]">/</span>
              <span className="type-caption text-[#6e6e69]/80 hover:text-[#2d2d2a] transition-colors duration-300 uppercase">
                {lang === "EN" ? "Work Archive" : "Arsip Karya"}
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 type-caption">
              <button
                type="button"
                onClick={() => setLang("ID")}
                className={`px-2 py-1 rounded transition-colors duration-300 ${
                  lang === "ID"
                    ? "bg-[#2d2d2a] text-[#bfe100] font-semibold"
                    : "text-[#6e6e69] hover:text-[#2d2d2a]"
                }`}
              >
                ID
              </button>
              <span className="text-[#E5E4E0]">|</span>
              <button
                type="button"
                onClick={() => setLang("EN")}
                className={`px-2 py-1 rounded transition-colors duration-300 ${
                  lang === "EN"
                    ? "bg-[#2d2d2a] text-[#bfe100] font-semibold"
                    : "text-[#6e6e69] hover:text-[#2d2d2a]"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 pt-10 sm:pt-14 pb-32">
          {/* Editorial Title Section with Parallax */}
          <motion.div
            style={{ y: yHeader }}
            className="pb-6 sm:pb-8 border-b border-[#E5E4E0]"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="p-0 m-0">
                <h1 className="p-0 m-0 type-h1 font-headline uppercase text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300">
                  {lang === "EN" ? "Selected Work" : "Koleksi Karya"}
                </h1>
                <p className="mt-3 type-body text-[#6e6e69]/80 hover:text-[#2d2d2a] transition-colors duration-300 max-w-2xl">
                  {lang === "EN"
                    ? "Complete archive divided into two disciplines: digital interactive websites & applications, and visual communication graphic design."
                    : "Arsip lengkap yang terbagi dalam dua disiplin utama: aplikasi web & sistem digital interaktif, serta desain grafis komunikasi visual."}
                </p>
              </div>

              {/* Live Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#96958f] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    lang === "EN"
                      ? "Search projects, stack..."
                      : "Cari proyek, teknologi..."
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E4E0] focus:border-[#e50319] focus:ring-1 focus:ring-[#e50319] rounded-full type-small text-[#2d2d2a] placeholder:text-[#96958f] outline-none transition-colors duration-300"
                />
              </div>
            </div>
          </motion.div>

          {/* Category Filter Tabs with Count Badges */}
          <div className="pt-8 pb-10 flex flex-wrap items-center gap-2 sm:gap-3">
            {CATEGORIES_CONFIG.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              const count = categoryCounts[cat.key];

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`relative px-4 sm:px-5 py-2 rounded-full type-button transition-all duration-300 flex items-center gap-2.5 border ${
                    isSelected
                      ? "bg-[#2d2d2a] text-[#bfe100] border-[#2d2d2a] !font-medium shadow-xs"
                      : "bg-white text-[#6e6e69] hover:text-[#2d2d2a] border-[#E5E4E0] hover:border-[#2d2d2a]"
                  }`}
                >
                  <span>{cat.label[lang]}</span>
                  <span
                    className={`type-caption px-1.5 py-0.2 rounded-full text-xs font-mono font-semibold transition-colors duration-300 ${
                      isSelected
                        ? "bg-[#bfe100]/25 text-[#bfe100]"
                        : "bg-[#F5F5F2] text-[#96958f] group-hover:text-[#2d2d2a]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Empty State */}
          {!hasVisibleProjects ? (
            <div className="py-24 text-center border border-dashed border-[#E5E4E0] rounded-xl bg-white">
              <Layers className="w-10 h-10 text-[#96958f] mx-auto mb-3" />
              <h3 className="type-h3 text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300">
                {lang === "EN"
                  ? "No projects match your filter"
                  : "Tidak ada proyek yang sesuai"}
              </h3>
              <p className="type-caption text-[#6e6e69]/80 hover:text-[#2d2d2a] transition-colors duration-300 mt-1">
                {lang === "EN"
                  ? "Try resetting the category filter or clearing the search query."
                  : "Coba atur ulang filter kategori atau hapus kata kunci pencarian."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-1.5 bg-[#2d2d2a] text-white hover:text-[#bfe100] type-button rounded-full hover:bg-[#1f1f1d] transition-colors duration-300"
              >
                {lang === "EN" ? "Reset Filters" : "Atur Ulang"}
              </button>
            </div>
          ) : (
            <motion.div style={{ y: yContent }} className="space-y-16 sm:space-y-20">
              {/* Category 1: Website & Applications (Rendered if 'all' or 'website') */}
              {(selectedCategory === "all" || selectedCategory === "website") &&
                websiteProjects.length > 0 && (
                  <section aria-labelledby="heading-website-projects">
                    {/* Minimalist Editorial Category Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E4E0] mb-8">
                      <div className="flex items-center gap-3">
                        <span className="type-caption font-mono font-bold text-[#e50319]">
                          01
                        </span>
                        <span className="text-[#E5E4E0]">//</span>
                        <h2
                          id="heading-website-projects"
                          className="p-0 m-0 type-h3 font-headline uppercase text-[#2d2d2a] tracking-wider"
                        >
                          {lang === "EN"
                            ? "Website & Web Applications"
                            : "Website & Aplikasi Web"}
                        </h2>
                      </div>
                      <span className="type-caption px-2.5 py-1 rounded-full bg-white border border-[#E5E4E0] text-[#6e6e69] font-medium font-mono">
                        {websiteProjects.length} {lang === "EN" ? "PROJECTS" : "PROYEK"}
                      </span>
                    </div>

                    {/* Website Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
                      <AnimatePresence>
                        {websiteProjects.map((project, idx) => (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            index={idx}
                            lang={lang}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </section>
                )}

              {/* Category 2: Graphic Design (Rendered if 'all' or 'graphic-design') */}
              {(selectedCategory === "all" || selectedCategory === "graphic-design") &&
                graphicDesignProjects.length > 0 && (
                  <section aria-labelledby="heading-graphic-projects">
                    {/* Minimalist Editorial Category Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E4E0] mb-8">
                      <div className="flex items-center gap-3">
                        <span className="type-caption font-mono font-bold text-[#e50319]">
                          02
                        </span>
                        <span className="text-[#E5E4E0]">//</span>
                        <h2
                          id="heading-graphic-projects"
                          className="p-0 m-0 type-h3 font-headline uppercase text-[#2d2d2a] tracking-wider"
                        >
                          {lang === "EN"
                            ? "Graphic Design & Branding"
                            : "Desain Grafis & Identitas"}
                        </h2>
                      </div>
                      <span className="type-caption px-2.5 py-1 rounded-full bg-white border border-[#E5E4E0] text-[#6e6e69] font-medium font-mono">
                        {graphicDesignProjects.length}{" "}
                        {lang === "EN" ? "PROJECTS" : "PROYEK"}
                      </span>
                    </div>

                    {/* Graphic Design Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
                      <AnimatePresence>
                        {graphicDesignProjects.map((project, idx) => (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            index={idx}
                            lang={lang}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </section>
                )}
            </motion.div>
          )}
        </main>

        {/* Minimalist Subpage Footer */}
        <footer className="w-full border-t border-[#E5E4E0] bg-[#F5F5F2] py-12">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col sm:flex-row items-center justify-between gap-6 type-caption text-[#6e6e69]">
            <div className="flex items-center gap-2 group">
              <span className="font-semibold text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">
                Daniel Kurnia
              </span>
              <span>—</span>
              <span className="text-[#96958f] group-hover:text-[#2d2d2a] transition-colors duration-300">
                dlabsign.ID
              </span>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/#contact"
                className="text-[#6e6e69] hover:text-[#e50319] transition-colors duration-300"
              >
                {lang === "EN" ? "Get in touch" : "Hubungi saya"}
              </Link>
              <Link
                href="/"
                className="text-[#6e6e69] hover:text-[#e50319] transition-colors duration-300"
              >
                {lang === "EN" ? "Back to Homepage" : "Kembali ke Beranda"}
              </Link>
            </div>
          </div>
        </footer>

        {/* Floating Dock Navbar for Universal Navigation */}
        <Navbar />
      </div>
    </SmoothScroll>
  );
}

function ProjectCard({
  project,
  index,
  lang,
}: {
  project: DetailedProject;
  index: number;
  lang: "EN" | "ID";
}) {
  const localizedCategory =
    project.categoryKey === "website"
      ? "Website"
      : lang === "EN"
      ? "Graphic Design"
      : "Desain Grafis";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
    >
      <Link
        href={`/projects/${project.id}`}
        data-cursor-interactive="true"
        className="group flex flex-col h-full bg-white border border-[#E5E4E0] hover:border-[#2d2d2a] rounded-xl overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e50319]"
      >
        {/* Visual Preview Container - Prominently Displayed on Work Page */}
        <div className="relative w-full aspect-[16/10] bg-[#EFEFEF] overflow-hidden">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index < 2}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#6e6e69] group-hover:text-[#2d2d2a] type-caption uppercase tracking-wider !font-semibold border border-[#E5E4E0] transition-colors duration-300">
              {localizedCategory}
            </span>

            {project.isGame ? (
              <span className="px-2.5 py-1 rounded-full bg-[#bfe100]/25 backdrop-blur-md text-[#2d2d2a] type-caption font-bold tracking-wider uppercase border border-[#bfe100]/50">
                <span>{lang === "EN" ? "Playable Game" : "Bisa Dimainkan"}</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#6e6e69]/80 group-hover:text-[#2d2d2a] type-caption border border-[#E5E4E0] transition-colors duration-300">
                {project.year}
              </span>
            )}
          </div>

          <div className="absolute inset-0 bg-[#2d2d2a]/0 group-hover:bg-[#2d2d2a]/5 transition-colors duration-300 pointer-events-none" />
        </div>

        {/* Project Information with Gray to Graphite Hover Animation */}
        <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="type-caption text-[#6e6e69]/80 group-hover:text-[#2d2d2a] transition-colors duration-300">
                REF {project.number}
              </span>
              <span className="type-caption text-[#6e6e69]/80 group-hover:text-[#2d2d2a] transition-colors duration-300">
                {project.client}
              </span>
            </div>

            <div className="mt-2.5 flex items-start justify-between gap-2">
              <h2 className="p-0 m-0 type-h3 font-headline text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">
                {project.title}
              </h2>
              <div className="w-8 h-8 rounded-full bg-[#F5F5F2] group-hover:bg-[#2d2d2a] text-[#6e6e69] group-hover:text-[#bfe100] flex items-center justify-center flex-shrink-0 transition-all duration-300">
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Tech Stack Pills & Action Link in Scarlet on Hover */}
          <div className="mt-6 pt-4 border-t border-[#E5E4E0] flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {project.stack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="type-caption px-2 py-0.5 rounded bg-[#F5F5F2] text-[#6e6e69] group-hover:text-[#2d2d2a] group-hover:border-[#2d2d2a]/20 border border-[#E5E4E0] transition-colors duration-300"
                >
                  {tech}
                </span>
              ))}
              {project.stack.length > 3 && (
                <span className="type-caption text-[#6e6e69]/80 group-hover:text-[#2d2d2a] transition-colors duration-300">
                  +{project.stack.length - 3}
                </span>
              )}
            </div>

            <span className="type-button text-[#6e6e69] group-hover:text-[#e50319] group-hover:underline flex items-center gap-1 transition-colors duration-300">
              <span>{lang === "EN" ? "Explore Detail" : "Buka Detail"}</span>
              <span>→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
