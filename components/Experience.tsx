"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import PhotoHoverPreview from "@/components/PhotoHoverPreview";
import SmoothWeightText from "@/components/SmoothWeightText";
import { TextRoll } from "@/components/core/text-roll";

interface ExperienceItem {
  period: string;
  role: string;
  roleId: string;
  type: string;
  typeId: string;
  entity: string;
  entityUrl?: string;
  location: string;
  image?: string;
  monogram?: string;
  isWhiteBg?: boolean;
}

interface EducationItem {
  period: string;
  institution: string;
  degree: string;
  degreeId: string;
  score: string;
  scoreLabel: string;
  scoreLabelId: string;
  image?: string;
  monogram?: string;
}

interface AwardItem {
  year: string;
  title: string;
  titleId: string;
  event: string;
  eventId: string;
  link?: string;
  image?: string;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    period: "Feb 2026 — Present",
    role: "IT Staff - Programmer",
    roleId: "Staf TI - Programmer",
    type: "Contract",
    typeId: "Kontrak",
    entity: "PT. Kayu Mebel Indonesia",
    entityUrl: "https://id.linkedin.com/company/pt-kayu-mebel-indonesia",
    location: "Sidoarjo, Jawa Timur, Indonesia • On-Site",
    image: "/project/ENJOYSAP_LOGO.png",
    monogram: "KM",
    isWhiteBg: false,
  },
  {
    period: "Feb 2025 — Present",
    role: "FullStack Developer",
    roleId: "Pengembang FullStack",
    type: "Part-time",
    typeId: "Paruh Waktu",
    entity: "Zero One",
    entityUrl: "https://zeroone.co.id/",
    location: "Surabaya, Jawa Timur, Indonesia • Hybrid",
    image: "/project/zeroone-logo.png",
    monogram: "ZO",
    isWhiteBg: false,
  },
  {
    period: "Dec 2021 — Present",
    role: "Graphic Designer & Digital Creator",
    roleId: "Desainer Grafis & Kreator Digital",
    type: "Freelance",
    typeId: "Lepas (Freelance)",
    entity: "dlabsign",
    entityUrl: "https://github.com/Dlabsign",
    location: "Indonesia • Remote",
    monogram: "DL",
  },
  {
    period: "Mar 2025 — Jan 2026",
    role: "Backend Developer",
    roleId: "Pengembang Backend",
    type: "Freelance",
    typeId: "Lepas (Freelance)",
    entity: "Pemancingan Tanggul Rejo",
    entityUrl: "https://share.google/CmZKjS4kq0h4lkVSZ",
    location: "Sidoarjo, Jawa Timur, Indonesia • Hybrid",
    monogram: "TR",
  },
  {
    period: "Mar 2024 — Jan 2026",
    role: "Laboratory Assistant",
    roleId: "Asisten Laboratorium Komputer",
    type: "Part-time",
    typeId: "Paruh Waktu",
    entity: "Universitas 17 Agustus 1945 Surabaya",
    entityUrl: "https://untag-sby.ac.id/",
    location: "Surabaya, Jawa Timur, Indonesia • On-Site",
    image: "https://framerusercontent.com/images/iwS1Rr5TtduV7Ko1GJJ2WtH04.png?width=2823&height=2865",
    monogram: "UT",
  },
  {
    period: "Mar 2025",
    role: "PIC • Army of God Conference 2025",
    roleId: "Koordinator • Army of God Conference 2025",
    type: "Event PIC",
    typeId: "Koordinator Acara",
    entity: "GMS Sidoarjo",
    entityUrl: "https://gms.church/id",
    location: "Sidoarjo, Jawa Timur, Indonesia • On-Site",
    image: "https://framerusercontent.com/images/41pwj8FMUikZ7st7guDeTSTABc.jpg?width=1961&height=3487",
    monogram: "GMS",
  },
  {
    period: "Feb 2022",
    role: "PIC • Batch Graphic Design & Video",
    roleId: "Koordinator • Pelatihan Desain Grafis & Video",
    type: "Project PIC",
    typeId: "Koordinator Proyek",
    entity: "SMK Antartika 2 Sidoarjo",
    entityUrl: "https://smkantartika2-sda.sch.id/",
    location: "Sidoarjo, Jawa Timur, Indonesia • On-Site",
    image: "https://framerusercontent.com/images/ujny5iZ13TTSbUmeVK4oj5vxeV0.jpg?width=1620&height=1080",
    monogram: "A2",
  },
  {
    period: "Jan 2021",
    role: "Graphic Design Volunteer PIC",
    roleId: "Koordinator Relawan Desain Grafis",
    type: "Volunteer PIC",
    typeId: "Relawan (Volunteer)",
    entity: "Sidoarjo School Festival - SMK",
    location: "Sidoarjo, Jawa Timur, Indonesia • On-Site",
    image: "https://framerusercontent.com/images/Hs45H39TaIemKy4FiVbAJ1Q3Vew.jpg?width=6000&height=4000",
    monogram: "SSF",
  },
];

const EDUCATION_ITEMS: EducationItem[] = [
  {
    period: "2022 — 2026",
    institution: "Universitas 17 Agustus 1945 Surabaya",
    degree: "Bachelor of Informatics Engineering",
    degreeId: "Sarjana Teknik Informatika",
    score: "3.82 / 4.00",
    scoreLabel: "GPA",
    scoreLabelId: "IPK",
    image: "https://framerusercontent.com/images/Eksgp9ROQ8fYqviEvaeqWhioXc8.png?width=1000&height=1000",
    monogram: "UT",
  },
  {
    period: "2019 — 2022",
    institution: "SMK Antartika 2 Sidoarjo",
    degree: "Multimedia Engineering",
    degreeId: "Teknik Multimedia",
    score: "95 / 100",
    scoreLabel: "Score",
    scoreLabelId: "Nilai",
    image: "https://framerusercontent.com/images/r3q1gI7JKawDcZv9FTQ56ptI.png?width=500&height=500",
    monogram: "A2",
  },
];

const AWARDS_ITEMS: AwardItem[] = [
  {
    year: "2026",
    title: "Best Graduate of the FTEIC Faculty",
    titleId: "Lulusan Terbaik Fakultas FTEIC",
    event: "Universitas 17 Agustus 1945 Surabaya",
    eventId: "Untag Surabaya",
    link: "https://untag-sby.ac.id/",
    image: "https://framerusercontent.com/images/w2M9g6W6j2ivtLlVvL7arH2yLI.jpg?width=1620&height=1080",
  },
  {
    year: "2025",
    title: "Gold Medal",
    titleId: "Medali Emas (Gold Medal)",
    event: "Jakarta International Science Fair (JISF)",
    eventId: "Jakarta International Science Fair (JISF)",
    link: "https://untag-sby.ac.id/web/beritadetail/torehkan-prestasi-internasional-tiga-mahasiswa-teknik-informatika-untag-surabaya-raih-gold-medal-di-ajang-jisf-2025--.html",
    image: "https://framerusercontent.com/images/5khHAmrU6U7LE24TbZKfIgi8oM.jpg?width=4325&height=4000",
  },
  {
    year: "2022",
    title: "Top 10 Provincial Graphic Design Technology",
    titleId: "10 Besar Teknologi Desain Grafis Provinsi",
    event: "LKS SMK Jawa Timur",
    eventId: "LKS SMK Jawa Timur",
    link: "https://youtu.be/WToVX8-K7bk?si=Y099WAAdmRBYIPY6",
    image: "https://framerusercontent.com/images/FFRKI8VFeve385f0BpvKOuIftA.jpg?width=720&height=1080",
  },
];

export default function Experience() {
  const { lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

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

  const yHeader = useTransform(smoothProgress, [0, 1], [-18, 18]);
  const yTimeline = useTransform(smoothProgress, [0, 1], [14, -14]);
  const ySubsections = useTransform(smoothProgress, [0, 1], [22, -18]);
  const timelineScaleY = useTransform(smoothProgress, [0.12, 0.75], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative w-full min-h-[100dvh] bg-[#000000] border-t border-[#262626] text-[#fafafa] flex flex-col justify-center py-16 sm:py-20 md:py-24 overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-center flex-1">
        
        {/* =========================================================================
            1. SECTION HEADER (Minimalist Swiss Editorial Consistent with Site)
        ========================================================================= */}
        <motion.div
          style={{ y: yHeader }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pb-6 sm:pb-8 border-b border-[#262626]"
        >
          <h2 className="type-h2 uppercase text-[#fafafa] hover:text-[#fafafa] transition-colors duration-300 cursor-default">
            <TextRoll key={`exp-title-${lang}`}>
              {lang === "EN" ? "Experience" : "Pengalaman"}
            </TextRoll>
          </h2>
        </motion.div>

        {/* =========================================================================
            2. ZIG-ZAG TIMELINE (Pure Black & Swiss Minimalist Theme)
        ========================================================================= */}
        <motion.div style={{ y: yTimeline }} className="relative pt-12 sm:pt-16">
          
          {/* Continuous Center Vertical Line for Desktop with Dynamic Scroll Energy Beam */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-1/2 top-4 bottom-8 w-[1px] bg-[#262626] -translate-x-1/2 pointer-events-none z-0 overflow-hidden"
          >
            <motion.div
              style={{ scaleY: timelineScaleY, originY: 0 }}
              className="w-full h-full bg-gradient-to-b from-[#fafafa]/80 via-[#fafafa] to-[#fafafa]/20"
            />
          </div>

          {/* Continuous Left Vertical Line for Mobile with Dynamic Scroll Energy Beam */}
          <div
            aria-hidden="true"
            className="md:hidden absolute left-5 top-4 bottom-8 w-[1px] bg-[#262626] pointer-events-none z-0 overflow-hidden"
          >
            <motion.div
              style={{ scaleY: timelineScaleY, originY: 0 }}
              className="w-full h-full bg-gradient-to-b from-[#fafafa]/80 via-[#fafafa] to-[#fafafa]/20"
            />
          </div>

          <div className="space-y-16 sm:space-y-24">
            {EXPERIENCES.map((exp, idx) => {
              const isLeft = idx % 2 === 0; // Alternating zig-zag
              const isFirst = idx === 0;

              return (
                <motion.div
                  key={`${exp.entity}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex items-center md:justify-center w-full group"
                >
                  {/* ===================================================
                      DESKTOP LAYOUT (Alternating Left / Right)
                      =================================================== */}
                  <div className="hidden md:grid md:grid-cols-2 w-full items-center">
                    
                    {/* LEFT COLUMN */}
                    <div className="flex items-center justify-end pr-10">
                      {isLeft && (
                        <div className="flex items-center justify-end gap-5 text-right">
                          {/* Text Block: Position as Headline, Company as Subheadline */}
                          <div>
                            <h3 className="type-h4 text-[#fafafa] tracking-tight">
                              <SmoothWeightText align="right">
                                {lang === "EN" ? exp.role : exp.roleId}
                              </SmoothWeightText>
                            </h3>
                            <p className="type-small text-[#fafafa]/80 mt-1 font-medium">
                              {exp.entity}
                              <span className="inline-block mx-1.5 text-[#262626]">•</span>
                              <span className="text-[#bfe100] font-mono text-xs uppercase tracking-wider">
                                {lang === "EN" ? exp.type : exp.typeId}
                              </span>
                            </p>
                            <p className="type-caption text-[#fafafa]/80 font-mono mt-0.5">
                              {exp.period}
                            </p>
                            <p className="type-caption text-[#fafafa]/60 mt-0.5">
                              {exp.location}
                            </p>
                          </div>

                          {/* Logo / Photo Container with Proportional Hover Enlarge */}
                          {exp.image ? (
                            <PhotoHoverPreview
                              src={exp.image}
                              alt={exp.entity}
                              title={lang === "EN" ? exp.role : exp.roleId}
                              subtitle={`${exp.entity} • ${exp.period}`}
                              badge={lang === "EN" ? exp.type : exp.typeId}
                              baseClassName="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl"
                              imageClassName="object-contain p-2.5"
                              placement={idx === 0 ? "bottom" : "top"}
                              isLogoWhiteBg={exp.isWhiteBg ?? false}
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-transparent flex items-center justify-center shrink-0">
                              <div className="w-full h-full rounded-xl bg-transparent flex items-center justify-center text-[#fafafa] font-bold text-base">
                                {exp.monogram || exp.entity.slice(0, 2).toUpperCase()}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex items-center justify-start pl-10">
                      {!isLeft && (
                        <div className="flex items-center justify-start gap-5 text-left">
                          {/* Logo / Photo Container with Proportional Hover Enlarge */}
                          {exp.image ? (
                            <PhotoHoverPreview
                              src={exp.image}
                              alt={exp.entity}
                              title={lang === "EN" ? exp.role : exp.roleId}
                              subtitle={`${exp.entity} • ${exp.period}`}
                              badge={lang === "EN" ? exp.type : exp.typeId}
                              baseClassName="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl"
                              imageClassName="object-contain p-2.5"
                              placement={idx === 0 ? "bottom" : "top"}
                              isLogoWhiteBg={exp.isWhiteBg ?? false}
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-transparent flex items-center justify-center shrink-0">
                              <div className="w-full h-full rounded-xl bg-transparent flex items-center justify-center text-[#fafafa] font-bold text-base">
                                {exp.monogram || exp.entity.slice(0, 2).toUpperCase()}
                              </div>
                            </div>
                          )}

                          {/* Text Block */}
                          <div>
                            <h3 className="type-h4 text-[#fafafa] tracking-tight">
                              <SmoothWeightText align="right">
                                {lang === "EN" ? exp.role : exp.roleId}
                              </SmoothWeightText>
                            </h3>
                            <p className="type-small text-[#fafafa]/80 mt-1 font-medium">
                              {exp.entity}
                              <span className="inline-block mx-1.5 text-[#262626]">•</span>
                              <span className="text-[#bfe100] font-mono text-xs uppercase tracking-wider">
                                {lang === "EN" ? exp.type : exp.typeId}
                              </span>
                            </p>
                            <p className="type-caption text-[#fafafa]/80 font-mono mt-0.5">
                              {exp.period}
                            </p>
                            <p className="type-caption text-[#fafafa]/60 mt-0.5">
                              {exp.location}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ===================================================
                      CENTER TIMELINE NODE (Minimalist Clean Pure White)
                      =================================================== */}
                  <div
                    aria-hidden="true"
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none"
                  >
                    {isFirst ? (
                      /* Active Current Node with Clean White */
                      <div className="relative w-6 h-6 rounded-full bg-[#000000] flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#fafafa]" />
                      </div>
                    ) : (
                      /* Minimalist Clean Ring Node */
                      <div className="w-5 h-5 rounded-full bg-[#000000] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#fafafa]/40 group-hover:bg-[#fafafa] group-hover:scale-125 transition-all duration-300" />
                      </div>
                    )}
                  </div>

                  {/* ===================================================
                      MOBILE RESPONSIVE LAYOUT (< md)
                      =================================================== */}
                  <div className="md:hidden flex items-start gap-4 pl-12 w-full relative">
                    {/* Node on mobile left line */}
                    <div
                      aria-hidden="true"
                      className="absolute left-[13px] top-4 z-20 flex items-center justify-center"
                    >
                      {isFirst ? (
                        <div className="w-5 h-5 rounded-full bg-[#000000] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#fafafa]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-[#000000] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#fafafa]/40 group-hover:bg-[#fafafa] transition-colors duration-300" />
                        </div>
                      )}
                    </div>

                    {/* Mobile Content (No Box, No Border, No Background) */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 w-full py-2 bg-transparent">
                      {/* Logo / Photo Container with Proportional Hover Enlarge */}
                      {exp.image ? (
                        <PhotoHoverPreview
                          src={exp.image}
                          alt={exp.entity}
                          title={lang === "EN" ? exp.role : exp.roleId}
                          subtitle={`${exp.entity} • ${exp.period}`}
                          badge={lang === "EN" ? exp.type : exp.typeId}
                          baseClassName="w-14 h-14 rounded-xl"
                          imageClassName="object-contain p-2"
                          placement="right"
                          enlargedWidth="w-64 sm:w-72"
                          isLogoWhiteBg={exp.isWhiteBg ?? false}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-transparent flex items-center justify-center shrink-0">
                          <div className="w-full h-full rounded-lg bg-transparent flex items-center justify-center text-[#fafafa] font-bold text-xs">
                            {exp.monogram || exp.entity.slice(0, 2).toUpperCase()}
                          </div>
                        </div>
                      )}

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <h3 className="type-h4 text-[#fafafa] font-bold tracking-tight truncate">
                          {lang === "EN" ? exp.role : exp.roleId}
                        </h3>
                        <p className="type-small text-[#fafafa]/80 text-xs mt-0.5 font-medium truncate">
                          {exp.entity}
                          <span className="inline-block mx-1.5 text-[#262626]">•</span>
                          <span className="text-[#bfe100] font-mono text-[10px] uppercase">
                            {lang === "EN" ? exp.type : exp.typeId}
                          </span>
                        </p>
                        <p className="type-caption text-[#fafafa]/80 font-mono text-xs mt-0.5">
                          {exp.period}
                        </p>
                        <p className="type-caption text-[#fafafa]/60 text-[11px] mt-0.5">
                          {exp.location}
                        </p>
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* =========================================================================
            3. ACADEMIC BACKGROUND & HONORS (Education & Awards Consistent with Site)
        ========================================================================= */}
        <motion.div style={{ y: ySubsections }} className="mt-20 pt-12 border-t border-[#262626]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
            
            {/* Left: Education Column */}
            <div id="education" className="lg:col-span-6 space-y-4">
              <div className="pb-3 border-b border-[#262626]">
                <h3 className="type-h3 uppercase text-[#fafafa] hover:text-[#fafafa] transition-colors duration-300 cursor-default">
                  <TextRoll key={`edu-title-${lang}`}>
                    {lang === "EN" ? "Education" : "Pendidikan"}
                  </TextRoll>
                </h3>
              </div>

              <div className="space-y-6 pt-2">
                {EDUCATION_ITEMS.map((edu, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 group relative py-2 bg-transparent"
                  >
                    {edu.image ? (
                      <PhotoHoverPreview
                        src={edu.image}
                        alt={edu.institution}
                        baseClassName="w-12 h-12 rounded-xl"
                        imageClassName="object-contain p-1"
                        placement="right"
                        enlargedWidth="w-72 sm:w-80"
                        isLogoWhiteBg={false}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-transparent type-caption font-bold text-[#fafafa] flex items-center justify-center shrink-0">
                        {edu.monogram}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                        <h4 className="type-h4 text-[#fafafa] truncate">
                          <SmoothWeightText>
                            {edu.institution}
                          </SmoothWeightText>
                        </h4>
                        <span className="type-caption text-[#fafafa]/80 font-mono shrink-0">
                          {edu.period}
                        </span>
                      </div>
                      <p className="type-small text-[#fafafa]/80 mt-1">
                        {lang === "EN" ? edu.degree : edu.degreeId}
                      </p>
                      {/* Score displayed cleanly as inline typography without any card box or border */}
                      <p className="type-caption text-[#fafafa]/70 mt-1.5 font-mono">
                        <span className="text-[#fafafa]/50">{lang === "EN" ? edu.scoreLabel : edu.scoreLabelId}: </span>
                        <span className="font-semibold text-[#bfe100]">{edu.score}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Awards & Recognitions Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="pb-3 border-b border-[#262626]">
                <h3 className="type-h3 uppercase text-[#fafafa] hover:text-[#fafafa] transition-colors duration-300 cursor-default">
                  <TextRoll key={`awards-title-${lang}`}>
                    {lang === "EN" ? "Awards & Honors" : "Penghargaan & Prestasi"}
                  </TextRoll>
                </h3>
              </div>

              <div className="space-y-6 pt-2">
                {AWARDS_ITEMS.map((award, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 group relative py-2 bg-transparent"
                  >
                    {award.image ? (
                      <PhotoHoverPreview
                        src={award.image}
                        alt={award.title}
                        title={lang === "EN" ? award.title : award.titleId}
                        subtitle={`${lang === "EN" ? award.event : award.eventId} • ${award.year}`}
                        badge="AWARD & HONORS"
                        baseClassName="w-12 h-12 rounded-xl"
                        imageClassName="object-contain p-1"
                        placement="right"
                        enlargedWidth="w-72 sm:w-84 md:w-96"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-transparent type-caption font-bold text-[#fafafa] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="type-caption text-[#fafafa]/80 font-mono shrink-0">
                          {award.year}
                        </span>
                        {award.link && (
                          <a
                            href={award.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Verify award"
                            className="text-[#fafafa]/70 hover:text-[#fafafa] hover:scale-110 transition-all duration-200 inline-flex items-center justify-center p-0.5"
                          >
                            <Globe className="w-3.5 h-3.5 text-[#fafafa]" />
                          </a>
                        )}
                      </div>
                      <h4 className="type-h4 text-[#fafafa] mt-1">
                        <SmoothWeightText>
                          {lang === "EN" ? award.title : award.titleId}
                        </SmoothWeightText>
                      </h4>
                      <p className="type-small text-[#fafafa]/80 mt-0.5 transition-colors duration-300">
                        {lang === "EN" ? award.event : award.eventId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>

        {/* Boundary marker for Navbar dock: marks the end of Education & Awards */}
        <div id="education-boundary" className="w-full h-px pointer-events-none opacity-0" />

      </div>
    </section>
  );
}
