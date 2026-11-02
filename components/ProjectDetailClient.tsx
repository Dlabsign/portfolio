"use client";

import React from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, Gamepad2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DetailedProject, DETAILED_PROJECTS } from "@/lib/projects-data";
import ProjectGameArena from "@/components/ProjectGameArena";
import ProjectGallery from "@/components/ProjectGallery";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";

interface ProjectDetailClientProps {
  project: DetailedProject;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const { lang, setLang } = useLanguage();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    mass: 0.5,
  });

  const yTitle = useTransform(smoothProgress, [0, 1], [0, -18]);
  const yContent = useTransform(smoothProgress, [0, 1], [10, -20]);

  // Find previous and next project for bottom pagination
  const currentIndex = DETAILED_PROJECTS.findIndex((p) => p.id === project.id);
  const prevProject =
    currentIndex > 0
      ? DETAILED_PROJECTS[currentIndex - 1]
      : DETAILED_PROJECTS[DETAILED_PROJECTS.length - 1];
  const nextProject =
    currentIndex < DETAILED_PROJECTS.length - 1
      ? DETAILED_PROJECTS[currentIndex + 1]
      : DETAILED_PROJECTS[0];

  return (
    <SmoothScroll>
      <div
        ref={containerRef}
        className="min-h-screen bg-[#FAFAFA] text-[#2d2d2a] font-sans selection:bg-[#bfe100] selection:text-[#2d2d2a] flex flex-col justify-between"
      >
        {/* Minimalist Sticky Header */}
        <header className="sticky top-0 z-40 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-[#E5E4E0] transition-colors">
          <div className="w-full md:max-w-[65%] mx-auto px-6 sm:px-8 md:px-0 h-16 flex items-center justify-between">
            <Link
              href="/projects"
              className="group flex items-center gap-2 type-caption text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300"
            >
              <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
              <span>{lang === "EN" ? "All Projects" : "Semua Proyek"}</span>
            </Link>

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

        {/* Main Case Study Body with Desktop & Tablet 65% Max-Width & Fluid Responsiveness */}
        <main className="flex-1 w-full md:max-w-[65%] mx-auto px-6 sm:px-8 md:px-0 pt-12 sm:pt-16 pb-28 sm:pb-32">
          {/* Project Title Block: Minimalist Headline Without Padding */}
          <motion.div
            style={{ y: yTitle }}
            className="pb-8 sm:pb-10 border-b border-[#E5E4E0]"
          >
            <h1 className="p-0 m-0 text-3xl sm:text-5xl md:text-6xl font-headline font-bold uppercase tracking-tight text-[#2d2d2a] leading-[1.05] transition-colors duration-300">
              {project.title}
            </h1>

            {/* Quick Live Link Action (View Prototype removed as requested) */}
            {(project.isGame || project.liveUrl) && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {project.isGame && project.gameUrl ? (
                  <a
                    href={project.gameUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2d2d2a] hover:bg-[#111111] text-white type-button uppercase transition-colors duration-300 shadow-xs focus-visible:ring-2 focus-visible:ring-[#2d2d2a]"
                  >
                    <Gamepad2 className="w-3.5 h-3.5 text-[#bfe100]" />
                    <span>{lang === "EN" ? "Open Fullscreen Game" : "Mainkan Layar Penuh"}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>
                ) : (
                  project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2d2d2a] hover:bg-[#111111] text-white type-button uppercase transition-colors duration-300 shadow-xs focus-visible:ring-2 focus-visible:ring-[#2d2d2a]"
                    >
                      <span>{lang === "EN" ? "Visit Live Site" : "Kunjungi Situs"}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                    </a>
                  )
                )}
              </div>
            )}
          </motion.div>

          {/* Minimalist Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-b border-[#E5E4E0]">
            <div className="group">
              <span className="type-caption uppercase text-[#6e6e69]/80 group-hover:text-[#2d2d2a] block mb-1 transition-colors duration-300">
                {lang === "EN" ? "Client" : "Klien"}
              </span>
              <p className="type-small text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">{project.client}</p>
            </div>

            <div className="group">
              <span className="type-caption uppercase text-[#6e6e69]/80 group-hover:text-[#2d2d2a] block mb-1 transition-colors duration-300">
                {lang === "EN" ? "Role" : "Peran"}
              </span>
              <p className="type-small text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">{project.role[lang]}</p>
            </div>

            <div className="group">
              <span className="type-caption uppercase text-[#6e6e69]/80 group-hover:text-[#2d2d2a] block mb-1 transition-colors duration-300">
                {lang === "EN" ? "Timeline" : "Tahun"}
              </span>
              <p className="type-small text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">{project.year}</p>
            </div>

            <div className="group">
              <span className="type-caption uppercase text-[#6e6e69]/80 group-hover:text-[#2d2d2a] block mb-1 transition-colors duration-300">
                {lang === "EN" ? "Technologies" : "Teknologi"}
              </span>
              <p className="type-small text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">
                {project.stack.join(" • ")}
              </p>
            </div>
          </div>

          <motion.div style={{ y: yContent }}>
            {/* Special Game Arena for Playable Browser Games */}
            {project.isGame && project.gameUrl && (
              <section className="pt-8">
                <ProjectGameArena
                  gameUrl={project.gameUrl}
                  title={project.title}
                  controlsHint={project.controlsHint}
                />
              </section>
            )}

            {/* Editorial Prose Section */}
            <section className="py-10 sm:py-14 border-b border-[#E5E4E0]">
              <p className="type-body text-[#6e6e69] hover:text-[#2d2d2a] whitespace-pre-line leading-relaxed transition-colors duration-300">
                {project.description[lang]}
              </p>
            </section>

            {/* Comprehensive Case Study Section: Horizontal Description List without Numbers or Badges */}
            {project.caseStudy && (
              <section className="border-b border-[#E5E4E0]">
                <dl className="divide-y divide-[#E5E4E0]">
                  {/* (THE PROBLEM) */}
                  <div className="py-8 sm:py-10 flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-12">
                    <dt className="md:w-56 lg:w-64 shrink-0">
                      <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[#2d2d2a] uppercase">
                        {lang === "EN" ? "(THE PROBLEM)" : "(PERMASALAHAN)"}
                      </span>
                    </dt>
                    <dd className="flex-1 m-0">
                      <p className="type-body text-[#6e6e69] hover:text-[#2d2d2a] leading-relaxed transition-colors duration-300">
                        {project.caseStudy.problem[lang]}
                      </p>
                    </dd>
                  </div>

                  {/* (TRUST & POSITIONING) */}
                  <div className="py-8 sm:py-10 flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-12">
                    <dt className="md:w-56 lg:w-64 shrink-0">
                      <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[#2d2d2a] uppercase">
                        {lang === "EN" ? "(TRUST & POSITIONING)" : "(PENDEKATAN SOLUSI)"}
                      </span>
                    </dt>
                    <dd className="flex-1 m-0">
                      <p className="type-body text-[#6e6e69] hover:text-[#2d2d2a] leading-relaxed transition-colors duration-300">
                        {project.caseStudy.trustPositioning[lang]}
                      </p>
                    </dd>
                  </div>

                  {/* (WHAT CHANGED) */}
                  <div className="py-8 sm:py-10 flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-12">
                    <dt className="md:w-56 lg:w-64 shrink-0">
                      <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[#2d2d2a] uppercase">
                        {lang === "EN" ? "(WHAT CHANGED)" : "(PERUBAHAN & HASIL)"}
                      </span>
                    </dt>
                    <dd className="flex-1 m-0">
                      <p className="type-body text-[#6e6e69] hover:text-[#2d2d2a] leading-relaxed transition-colors duration-300">
                        {project.caseStudy.whatChanged[lang]}
                      </p>
                    </dd>
                  </div>
                </dl>
              </section>
            )}

            {/* Visual Showcase Gallery */}
            <section>
              <ProjectGallery
                images={project.gallery}
                title={project.title}
              />
            </section>
          </motion.div>

          {/* Bottom Pagination Navigation */}
          <div className="pt-10 border-t border-[#E5E4E0] flex items-center justify-between">
            <Link
              href={`/projects/${prevProject.id}`}
              className="group flex items-center gap-2 text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 group-hover:text-[#e50319] transition-all" />
              <div>
                <span className="type-caption uppercase block text-[#6e6e69]/80 group-hover:text-[#2d2d2a] transition-colors duration-300">
                  {lang === "EN" ? "Previous" : "Sebelumnya"}
                </span>
                <span className="type-small !font-medium text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">
                  {prevProject.title}
                </span>
              </div>
            </Link>

            <Link
              href={`/projects/${nextProject.id}`}
              className="group flex items-center gap-2 text-right text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300"
            >
              <div>
                <span className="type-caption uppercase block text-[#6e6e69]/80 group-hover:text-[#2d2d2a] transition-colors duration-300">
                  {lang === "EN" ? "Next" : "Berikutnya"}
                </span>
                <span className="type-small !font-medium text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">
                  {nextProject.title}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:text-[#e50319] transition-all" />
            </Link>
          </div>
        </main>

        {/* Minimalist Subpage Footer */}
        <footer className="w-full border-t border-[#E5E4E0] bg-[#F5F5F2] py-10">
          <div className="w-full md:max-w-[65%] mx-auto px-6 sm:px-8 md:px-0 flex flex-col sm:flex-row items-center justify-between gap-4 type-caption text-[#6e6e69]">
            <div className="flex items-center gap-2 group">
              <span className="font-semibold text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">Daniel Kurnia</span>
              <span>—</span>
              <span className="text-[#96958f] group-hover:text-[#2d2d2a] transition-colors duration-300">dlabsign.ID</span>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/projects"
                className="text-[#6e6e69] hover:text-[#e50319] !font-medium transition-colors duration-300"
              >
                {lang === "EN" ? "All Projects" : "Semua Proyek"}
              </Link>
              <Link
                href="/"
                className="text-[#6e6e69] hover:text-[#e50319] transition-colors duration-300"
              >
                {lang === "EN" ? "Portfolio Home" : "Beranda"}
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
