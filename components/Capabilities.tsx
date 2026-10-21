"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface CapabilityGroup {
  number: string;
  category: string;
  categoryId: string;
  items: string[];
}

const CAPABILITIES: CapabilityGroup[] = [
  {
    number: "01",
    category: "Languages",
    categoryId: "Bahasa Pemrograman",
    items: ["PHP", "TypeScript", "JavaScript", "Python", "C++", "Dart", "Java", "SQL"],
  },
  {
    number: "02",
    category: "Frontend",
    categoryId: "Frontend",
    items: ["Next.js", "React", "Tailwind CSS", "HTML5", "CSS3", "Three.js"],
  },
  {
    number: "03",
    category: "Backend & Systems",
    categoryId: "Backend & Arsitektur Sistem",
    items: ["Laravel", "Node.js", "Express.js", "REST APIs", "MVC Architecture", "Yii 2"],
  },
  {
    number: "04",
    category: "Database & Cloud",
    categoryId: "Basis Data & Cloud",
    items: ["MySQL", "Firebase", "MongoDB", "Vercel", "cPanel"],
  },
  {
    number: "05",
    category: "Design Systems",
    categoryId: "Sistem Desain",
    items: ["Figma Component Systems", "Swiss Typography", "Minimalist UI/UX", "Editorial Layouts"],
  },
  {
    number: "06",
    category: "Development Tooling",
    categoryId: "Alat Pengembangan",
    items: ["Git", "GitHub", "VS Code", "Postman", "npm / pnpm"],
  },
];

export default function Capabilities() {
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

  const yHeader = useTransform(smoothProgress, [0, 1], [-20, 20]);
  const yRows = useTransform(smoothProgress, [0, 1], [18, -18]);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative w-full min-h-[100dvh] bg-[#FAFAFA] border-t border-[#E5E4E0] flex flex-col justify-center py-16 sm:py-20 md:py-24 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-center flex-1">
        {/* Section Header with Parallax & Hover Black */}
        <motion.div
          style={{ y: yHeader }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pb-6 sm:pb-8 border-b border-[#E5E4E0]"
        >
          <h2 className="type-h2 uppercase text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300 cursor-default">
            {lang === "EN" ? "Capabilities" : "Keahlian"}
          </h2>
        </motion.div>

        {/* Horizontal Capabilities Rows with Parallax */}
        <motion.div style={{ y: yRows }} className="divide-y divide-[#E5E4E0]">
          {CAPABILITIES.map((group, idx) => (
            <motion.div
              key={group.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="py-5 sm:py-7 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-baseline group"
            >
              <div className="type-caption text-[#6e6e69]/80 group-hover:text-[#e50319] transition-colors duration-300 md:col-span-1">
                {group.number}
              </div>

              <div className="type-h4 text-[#6e6e69] group-hover:text-[#2d2d2a] transition-colors duration-300 md:col-span-3">
                {lang === "EN" ? group.category : group.categoryId}
              </div>

              <div className="md:col-span-8 flex flex-wrap items-center gap-x-5 gap-y-2">
                {group.items.map((tech) => (
                  <motion.span
                    key={tech}
                    whileHover={{ y: -1.5 }}
                    data-cursor-interactive="true"
                    className="inline-block type-small text-[#6e6e69] hover:text-[#2d2d2a] transition-colors duration-300 cursor-pointer"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
