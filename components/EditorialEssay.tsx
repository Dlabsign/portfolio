"use client";

import React, { useState } from "react";
import { ArrowUpRight, Copy, Check, MessageSquare, Mail, Globe } from "lucide-react";
import { DANIEL_PROFILE, SOCIAL_LINKS } from "@/lib/data";

export default function EditorialEssay() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(DANIEL_PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="essay"
      className="relative w-full border-b border-hairline dark:border-hairline-night bg-paper dark:bg-paper-night text-ink dark:text-ink-night select-none py-16 sm:py-24 px-4 sm:px-8 xl:px-16"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Department Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-hairline dark:border-hairline-night">
          <div>
            <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.24em] text-vermilion font-bold pb-2 flex items-center gap-2">
              <span>[ SECTION V // CRITICAL ESSAY &amp; PROFILE ]</span>
              <span>•</span>
              <span>BIOGRAPHICAL STATEMENT</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-[-0.04em] uppercase text-ink dark:text-ink-night">
              About &amp; Manifesto
            </h2>
          </div>

          <div className="font-mono text-xs uppercase tracking-widest text-ink-ghost dark:text-ink-ghost-night text-left md:text-right">
            <div>DANIEL KURNIA (@DANIELKUPTR)</div>
            <div className="text-[10px] text-vermilion">ESTABLISHED IN INDONESIA (2021 — 2026)</div>
          </div>
        </div>

        {/* 12-Column Editorial Reading Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Columns 1–7: The Long-Form Monograph Essay */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-ghost dark:text-ink-ghost-night">
                ESSAY TITLE //
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-[1.1] text-ink dark:text-ink-night">
                The Systemic Discipline: A Dialogue on Software, Interaction, and Time.
              </h3>
            </div>

            {/* Column 1 with Drop-Cap */}
            <div className="space-y-6 font-sans text-sm sm:text-base leading-relaxed text-ink-ghost dark:text-ink-ghost-night">
              <p className="editorial-drop-cap">
                The contemporary web has become overwhelmingly loud. Layers of superfluous gradients, uncoordinated animations, and ephemeral design gimmicks repeatedly obscure the fundamental purpose of digital software: to facilitate human thought, exchange value, and serve practical intent with quiet grace.
              </p>

              <p>
                Operating independently under the studio banner of <strong className="text-ink dark:text-ink-night font-bold">dlabsign.ID</strong>, Daniel Kurnia approaches web and software development through the lens of classical Swiss typography and modernist structural engineering. Every layout decision begins with an unyielding inquiry into information hierarchy: what must the reader know, in what order, and with what degree of cognitive effort?
              </p>

              <p>
                Rather than treating front-end code and back-end databases as disparate territories, Daniel bridges the full stack. From configuring robust relational database schemas in MySQL and Laravel, to sculpting 60fps micro-interactions with Next.js, TypeScript, and Framer Motion, every layer is tuned to operate in harmonious concert.
              </p>
            </div>

            {/* Embedded Marginal Quote */}
            <div className="p-6 bg-paper-card dark:bg-paper-card-night border-l-2 border-vermilion space-y-2">
              <div className="font-display font-bold text-base sm:text-lg text-ink dark:text-ink-night">
                “Simplicity is not the absence of clutter, that&apos;s a consequence of simplicity. Simplicity is somehow essentially describing the purpose and place of an object and product.”
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-ghost dark:text-ink-ghost-night">
                // GUIDING CORE PRINCIPLE
              </div>
            </div>

            <div className="space-y-4 font-sans text-sm sm:text-base leading-relaxed text-ink-ghost dark:text-ink-ghost-night">
              <p>
                Whether developing an ordering ecosystem for fast-casual culinary brands, crafting high-fashion streetwear lookbooks, or structuring regional institutional platforms, Daniel’s goal remains constant: construct digital artifacts that possess lasting authority, zero visual noise, and absolute functional clarity.
              </p>
            </div>
          </div>

          {/* Columns 8–12: Stamped Official Contact & Dispatch Desk */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            
            {/* The Dispatch Desk Card */}
            <div className="p-6 sm:p-8 border border-hairline dark:border-hairline-night bg-paper-card/50 dark:bg-paper-card-night/50 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-hairline dark:border-hairline-night font-mono text-[10px] uppercase tracking-[0.2em] text-ink-ghost dark:text-ink-ghost-night">
                <span className="text-vermilion font-bold">[ INQUIRY &amp; ENGAGEMENT ]</span>
                <span>STATUS: AVAILABLE</span>
              </div>

              <div className="space-y-2">
                <div className="font-mono text-xs uppercase tracking-wider text-ink-ghost dark:text-ink-ghost-night">
                  DIRECT CONTACT //
                </div>
                <h4 className="font-display font-bold text-2xl text-ink dark:text-ink-night tracking-tight">
                  Initiate a Collaboration
                </h4>
                <p className="font-sans text-xs text-ink-ghost dark:text-ink-ghost-night leading-relaxed">
                  Available for select full-stack software architecture, UI/UX systems design, and creative frontend engineering commissions.
                </p>
              </div>

              {/* Direct Actions */}
              <div className="space-y-3 pt-2">
                {/* Email Action with Copy Button */}
                <div className="flex items-center justify-between p-3 border border-hairline dark:border-hairline-night bg-paper dark:bg-paper-night rounded-sm">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Mail className="w-4 h-4 text-vermilion shrink-0" />
                    <span className="font-mono text-xs text-ink dark:text-ink-night truncate lowercase">
                      {DANIEL_PROFILE.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="p-1.5 hover:text-vermilion transition-colors cursor-pointer text-ink-ghost dark:text-ink-ghost-night shrink-0 ml-2"
                    title="Copy Email Address"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* WhatsApp Action Button */}
                <a
                  href={DANIEL_PROFILE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-ink text-paper dark:bg-ink-night dark:text-paper-night hover:bg-vermilion hover:text-white transition-all duration-200 font-mono text-xs uppercase tracking-[0.18em] flex items-center justify-between rounded-sm group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-vermilion group-hover:text-white" />
                    <span>WHATSAPP MESSENGER</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-vermilion group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Network Index Links */}
              <div className="pt-4 border-t border-hairline dark:border-hairline-night space-y-2">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-ghost dark:text-ink-ghost-night pb-1">
                  OFFICIAL ARCHIVAL CHANNELS //
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-hairline dark:border-hairline-night hover:border-ink dark:hover:border-ink-night bg-paper dark:bg-paper-night font-mono text-[10px] uppercase tracking-wider text-ink dark:text-ink-night flex items-center justify-between group transition-colors"
                    >
                      <span>{social.name}</span>
                      <ArrowUpRight className="w-3 h-3 text-vermilion group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Operational Location Stamp */}
            <div className="p-4 border border-hairline dark:border-hairline-night font-mono text-[10px] uppercase tracking-widest text-ink-ghost dark:text-ink-ghost-night flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-vermilion" />
                <span>SURABAYA, ID (UTC+7)</span>
              </div>
              <span className="text-vermilion font-bold">COMMISSION ACTIVE</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
