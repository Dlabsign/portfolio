"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface ExperienceItem {
  period: string;
  role: string;
  roleId: string;
  type: string;
  typeId: string;
  entity: string;
  entityUrl?: string;
  location: string;
  scope: string;
  scopeId: string;
  image?: string;
  monogram?: string;
  category: "all" | "tech" | "creative" | "leadership";
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
    period: "Apr 2026 — Present",
    role: "Fullstack Developer",
    roleId: "Pengembang Fullstack",
    type: "Full-time",
    typeId: "Purna Waktu",
    entity: "PT. Kayu Mebel Indonesia",
    entityUrl: "https://id.linkedin.com/company/pt-kayu-mebel-indonesia",
    location: "Sidoarjo, Indonesia",
    image: "https://framerusercontent.com/images/pzok54TZr1eioQsRBNFQ9HB5NE.jpg?width=150&height=145",
    monogram: "KM",
    scope:
      "Architecting and developing enterprise fullstack systems, ERP integration workflows, and internal manufacturing business portals.",
    scopeId:
      "Merancang dan mengembangkan sistem fullstack enterprise, alur kerja integrasi ERP, dan portal bisnis manufaktur internal.",
    category: "tech",
  },
  {
    period: "Feb 2025 — Present",
    role: "FullStack Developer",
    roleId: "Pengembang FullStack",
    type: "Part-time",
    typeId: "Paruh Waktu",
    entity: "Zero One",
    entityUrl: "https://zeroone.co.id/",
    location: "Surabaya, Indonesia",
    image: "https://framerusercontent.com/images/gBqR230nGgBfGGYyTOTsiP1WVHY.png?width=825&height=975",
    monogram: "ZO",
    scope:
      "Building high-performance client web applications, responsive frontend interfaces, and scalable RESTful API integrations.",
    scopeId:
      "Membangun aplikasi web klien performa tinggi, antarmuka frontend responsif, dan integrasi RESTful API yang scalable.",
    category: "tech",
  },
  {
    period: "Dec 2021 — Present",
    role: "Graphic Designer & Digital Creator",
    roleId: "Desainer Grafis & Kreator Digital",
    type: "Freelance",
    typeId: "Lepas (Freelance)",
    entity: "dlabsign",
    entityUrl: "https://github.com/Dlabsign",
    location: "Indonesia (Remote)",
    monogram: "DL",
    scope:
      "Delivering brand identities, high-fidelity UI design systems, visual assets, and custom design solutions for clients.",
    scopeId:
      "Menghadirkan identitas visual brand, sistem UI presisi tinggi, aset grafis, dan solusi desain kustom untuk berbagai klien.",
    category: "creative",
  },
  {
    period: "Mar 2025 — Jan 2026",
    role: "Backend Developer",
    roleId: "Pengembang Backend",
    type: "Freelance",
    typeId: "Lepas (Freelance)",
    entity: "Pemancingan Tanggul Rejo",
    entityUrl: "https://share.google/CmZKjS4kq0h4lkVSZ",
    location: "Sidoarjo, Indonesia",
    monogram: "TR",
    scope:
      "Engineered database architecture, order processing workflows, and backend operational management systems.",
    scopeId:
      "Merancang arsitektur basis data, alur kerja pemrosesan pesanan, dan sistem manajemen operasional backend.",
    category: "tech",
  },
  {
    period: "Mar 2024 — Jan 2026",
    role: "Laboratory Assistant",
    roleId: "Asisten Laboratorium Komputer",
    type: "Part-time",
    typeId: "Paruh Waktu",
    entity: "Universitas 17 Agustus 1945 Surabaya",
    entityUrl: "https://untag-sby.ac.id/",
    location: "Surabaya, Indonesia",
    image: "https://framerusercontent.com/images/iwS1Rr5TtduV7Ko1GJJ2WtH04.png?width=2823&height=2865",
    monogram: "UT",
    scope:
      "Mentored undergraduate engineering students in C++, Python, algorithms, database systems, and software engineering practicums.",
    scopeId:
      "Membimbing mahasiswa teknik dalam praktikum C++, Python, algoritma, sistem basis data, dan rekayasa perangkat lunak.",
    category: "leadership",
  },
  {
    period: "Mar 2025",
    role: "PIC • Army of God Conference 2025",
    roleId: "Koordinator • Army of God Conference 2025",
    type: "Event PIC",
    typeId: "Koordinator Acara",
    entity: "GMS Sidoarjo",
    entityUrl: "https://gms.church/id",
    location: "Sidoarjo, Indonesia",
    image: "https://framerusercontent.com/images/41pwj8FMUikZ7st7guDeTSTABc.jpg?width=1961&height=3487",
    monogram: "GMS",
    scope:
      "Supervised media production, event technology coordination, and multimedia stage visual logistics for large youth conference.",
    scopeId:
      "Mengawasi produksi media, koordinasi teknologi acara, dan logistik visual panggung multimedia untuk konferensi pemuda.",
    category: "leadership",
  },
  {
    period: "Feb 2022",
    role: "PIC • Batch Graphic Design & Video",
    roleId: "Koordinator • Pelatihan Desain Grafis & Video",
    type: "Project PIC",
    typeId: "Koordinator Proyek",
    entity: "SMK Antartika 2 Sidoarjo",
    entityUrl: "https://smkantartika2-sda.sch.id/",
    location: "Sidoarjo, Indonesia",
    image: "https://framerusercontent.com/images/ujny5iZ13TTSbUmeVK4oj5vxeV0.jpg?width=1620&height=1080",
    monogram: "A2",
    scope:
      "Coordinated creative multimedia batch training, student workshops, and graphic design/video curriculum delivery.",
    scopeId:
      "Mengoordinasikan pelatihan batch multimedia kreatif, workshop siswa, dan penyampaian kurikulum desain grafis & video.",
    category: "leadership",
  },
  {
    period: "Jan 2021",
    role: "Graphic Design Volunteer PIC",
    roleId: "Koordinator Relawan Desain Grafis",
    type: "Volunteer PIC",
    typeId: "Relawan (Volunteer)",
    entity: "Sidoarjo School Festival - SMK",
    location: "Sidoarjo, Indonesia",
    image: "https://framerusercontent.com/images/Hs45H39TaIemKy4FiVbAJ1Q3Vew.jpg?width=6000&height=4000",
    monogram: "SSF",
    scope:
      "Directed festival visual branding, print collaterals, promotional banners, and social campaign assets.",
    scopeId:
      "Mengarahkan identitas visual festival, materi cetak promosi, banner panggung, dan aset kampanye media sosial.",
    category: "creative",
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
  const [filter, setFilter] = useState<"all" | "tech" | "creative" | "leadership">("all");
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

  const yHeader = useTransform(smoothProgress, [0, 1], [-20, 20]);
  const yRows = useTransform(smoothProgress, [0, 1], [18, -18]);
  const ySubsections = useTransform(smoothProgress, [0, 1], [24, -18]);

  const filteredExperiences =
    filter === "all"
      ? EXPERIENCES
      : EXPERIENCES.filter((exp) => exp.category === filter);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative w-full min-h-[100dvh] bg-[#FAFAFA] border-t border-[#E5E4E0] flex flex-col justify-center py-16 sm:py-20 md:py-24 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-center flex-1">
        {/* Section Header with Direct Metric & Filter Tabs */}
        <motion.div
          style={{ y: yHeader }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pb-6 sm:pb-8 border-b border-[#E5E4E0] flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h2 className="type-h2 uppercase text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300 cursor-default">
              5+ Years
            </h2>
            <p className="type-small text-[#6e6e69]/80 hover:text-[#2d2d2a] transition-colors duration-300 mt-2">
              {lang === "EN"
                ? "Continuous software delivery across engineering and creative design"
                : "Pengiriman perangkat lunak berkelanjutan di bidang teknik dan desain kreatif"}
            </p>
          </div>

          {/* Minimalist Filter Controls */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: "all", labelEn: "All", labelId: "Semua" },
              { id: "tech", labelEn: "Engineering", labelId: "Teknik" },
              { id: "creative", labelEn: "Design", labelId: "Desain" },
              { id: "leadership", labelEn: "Leadership", labelId: "Kepemimpinan" },
            ].map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as typeof filter)}
                  className={`px-3 py-1.5 rounded-full type-caption uppercase tracking-wider transition-all duration-300 ${
                    active
                      ? "bg-[#2d2d2a] text-[#bfe100] shadow-xs"
                      : "bg-[#F5F5F2] text-[#6e6e69] hover:text-[#2d2d2a] hover:bg-[#EAE8E3]"
                  }`}
                >
                  {lang === "EN" ? tab.labelEn : tab.labelId}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Experience Table Column Headers for Desktop */}
        <div className="hidden md:grid grid-cols-12 gap-4 py-3 border-b border-[#E5E4E0] type-caption text-[#6e6e69]/80 uppercase tracking-wider">
          <div className="col-span-3">{lang === "EN" ? "Timeline" : "Waktu"}</div>
          <div className="col-span-4">{lang === "EN" ? "Role & Scope" : "Peran & Lingkup"}</div>
          <div className="col-span-3">{lang === "EN" ? "Entity" : "Entitas"}</div>
          <div className="col-span-2 text-right">{lang === "EN" ? "Location" : "Lokasi"}</div>
        </div>

        {/* Horizontal Experience Rows with Parallax */}
        <motion.div style={{ y: yRows }} className="divide-y divide-[#E5E4E0]">
          {filteredExperiences.map((exp, idx) => (
            <motion.div
              key={`${exp.entity}-${idx}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              data-cursor-interactive="true"
              className="py-6 sm:py-7 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 group transition-colors duration-300 relative cursor-default hover:bg-[#F5F5F2] -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-xl"
            >
              {/* Expanding Hairline on Hover in Primary Scarlet */}
              <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-[#e50319] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-10 pointer-events-none" />

              {/* Col 1: Timeline & Type Badge */}
              <div className="md:col-span-3 flex flex-col items-start gap-1.5">
                <span className="type-small text-[#6e6e69] group-hover:text-[#2d2d2a] font-semibold tracking-tight transition-colors duration-300">
                  {exp.period}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full type-caption uppercase tracking-wider bg-white border border-[#E5E4E0] text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">
                  {lang === "EN" ? exp.type : exp.typeId}
                </span>
              </div>

              {/* Col 2: Role & Title + Scope */}
              <div className="md:col-span-4">
                <div className="type-h4 text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300">
                  {lang === "EN" ? exp.role : exp.roleId}
                </div>
                <p className="type-small text-[#6e6e69]/80 group-hover:text-[#2d2d2a] mt-1.5 transition-colors duration-300">
                  {lang === "EN" ? exp.scope : exp.scopeId}
                </p>
              </div>

              {/* Col 3: Organization with Logo / Monogram + Link */}
              <div className="md:col-span-3 flex items-center gap-3">
                {exp.image ? (
                  <div className="relative w-9 h-9 rounded-md overflow-hidden bg-white border border-[#E5E4E0] shrink-0 shadow-xs">
                    <Image
                      src={exp.image}
                      alt={exp.entity}
                      fill
                      sizes="36px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-md bg-[#F5F5F2] border border-[#E5E4E0] type-caption font-bold text-[#6e6e69] group-hover:text-[#2d2d2a] flex items-center justify-center shrink-0 transition-colors duration-300">
                    {exp.monogram || exp.entity.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  {exp.entityUrl ? (
                    <a
                      href={exp.entityUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 type-small text-[#6e6e69] group-hover:text-[#2d2d2a] hover:underline underline-offset-2 transition-colors duration-300 group/link"
                    >
                      <span className="truncate">{exp.entity}</span>
                      <span className="text-[11px] text-[#96958f] group-hover/link:text-[#e50319] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-200">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <span className="type-small text-[#6e6e69] group-hover:text-[#2d2d2a] truncate block transition-colors duration-300">
                      {exp.entity}
                    </span>
                  )}
                </div>
              </div>

              {/* Col 4: Location */}
              <div className="type-small text-[#6e6e69]/80 group-hover:text-[#2d2d2a] md:col-span-2 md:text-right self-center transition-colors duration-300">
                {exp.location}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* =====================================================================
            ACADEMIC BACKGROUND & HONORS SECTION WITH PARALLAX
        ====================================================================== */}
        <motion.div style={{ y: ySubsections }} className="mt-16 sm:mt-20 pt-10 border-t border-[#E5E4E0]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
            {/* Left: Education Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="pb-3 border-b border-[#E5E4E0]">
                <h3 className="type-h3 uppercase text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300 cursor-default">
                  {lang === "EN" ? "Education" : "Pendidikan"}
                </h3>
              </div>

              <div className="space-y-3">
                {EDUCATION_ITEMS.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#E5E4E0] bg-white hover:border-[#2d2d2a]/30 transition-colors duration-300 flex items-start gap-3.5 group"
                  >
                    {edu.image ? (
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-white border border-[#E5E4E0] shrink-0">
                        <Image
                          src={edu.image}
                          alt={edu.institution}
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-[#F5F5F2] border border-[#E5E4E0] type-caption font-bold text-[#6e6e69] group-hover:text-[#2d2d2a] flex items-center justify-center shrink-0 transition-colors duration-300">
                        {edu.monogram}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="type-h4 text-[#6e6e69] group-hover:text-[#2d2d2a] truncate transition-colors duration-300">
                          {edu.institution}
                        </h4>
                        <span className="type-caption text-[#6e6e69]/80 group-hover:text-[#2d2d2a] shrink-0 transition-colors duration-300">
                          {edu.period}
                        </span>
                      </div>
                      <p className="type-small text-[#6e6e69]/80 group-hover:text-[#2d2d2a] mt-0.5 transition-colors duration-300">
                        {lang === "EN" ? edu.degree : edu.degreeId}
                      </p>
                      {/* Score Pill highlighted in Lemon Lime */}
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#bfe100]/20 border border-[#bfe100]/40 type-caption text-[#2d2d2a] transition-colors duration-300">
                        <span>{lang === "EN" ? edu.scoreLabel : edu.scoreLabelId}:</span>
                        <span className="font-bold text-[#2d2d2a]">{edu.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Awards & Recognitions Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="pb-3 border-b border-[#E5E4E0]">
                <h3 className="type-h3 uppercase text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300 cursor-default">
                  {lang === "EN" ? "Awards & Honors" : "Penghargaan & Prestasi"}
                </h3>
              </div>

              <div className="space-y-3">
                {AWARDS_ITEMS.map((award, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#E5E4E0] bg-white hover:border-[#2d2d2a]/30 transition-colors duration-300 flex items-start gap-3.5 group"
                  >
                    {award.image ? (
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-white border border-[#E5E4E0] shrink-0">
                        <Image
                          src={award.image}
                          alt={award.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-[#2d2d2a] text-[#FAFAFA] type-caption font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="type-caption text-[#6e6e69] group-hover:text-[#2d2d2a] px-1.5 py-0.5 rounded-sm bg-[#F5F5F2] transition-colors duration-300">
                          {award.year}
                        </span>
                        {award.link && (
                          <a
                            href={award.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="type-caption text-[#6e6e69]/80 hover:text-[#e50319] inline-flex items-center gap-0.5 hover:underline transition-colors duration-300"
                          >
                            <span>{lang === "EN" ? "Verify" : "Lihat Bukti"}</span>
                            <span>↗</span>
                          </a>
                        )}
                      </div>
                      <h4 className="type-h4 text-[#6e6e69] group-hover:text-[#2d2d2a] mt-1 transition-colors duration-300">
                        {lang === "EN" ? award.title : award.titleId}
                      </h4>
                      <p className="type-small text-[#6e6e69]/80 group-hover:text-[#2d2d2a] mt-0.5 transition-colors duration-300">
                        {lang === "EN" ? award.event : award.eventId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

