'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TextMorph } from '@/components/core/text-morph';
import { ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactMorphForm() {
  const { lang } = useLanguage();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Compute live preview string for TextMorph
  const trimmedName = name.trim();
  const previewText = trimmedName
    ? (lang === 'EN' ? `Hi Daniel, I'm ${trimmedName}` : `Halo Daniel, saya ${trimmedName}`)
    : (lang === 'EN' ? "Let's Collaborate" : 'Mari Terhubung');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!trimmedName || trimmedName.length < 2) {
      setError(
        lang === 'EN'
          ? 'Please enter your name or company.'
          : 'Mohon masukkan nama atau perusahaan Anda.'
      );
      return;
    }

    const trimmedContact = contact.trim();
    if (!trimmedContact) {
      setError(
        lang === 'EN'
          ? 'Please provide your email or WhatsApp number.'
          : 'Mohon masukkan email atau nomor WhatsApp Anda.'
      );
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedContact);
    const isPhone = /^[\d\s+\-()]{8,20}$/.test(trimmedContact);

    if (!isEmail && !isPhone) {
      setError(
        lang === 'EN'
          ? 'Please enter a valid email address or phone number.'
          : 'Format email atau nomor WhatsApp tidak valid.'
      );
      return;
    }

    // Prepare message dispatch
    const subject = encodeURIComponent(`Project Inquiry from ${trimmedName}`);
    const bodyContent = encodeURIComponent(
      `Name: ${trimmedName}\nContact: ${trimmedContact}\n\nMessage:\n${message.trim() || 'No additional note provided.'}`
    );

    const mailtoUrl = `mailto:danielkurnia00@gmail.com?subject=${subject}&body=${bodyContent}`;
    window.location.href = mailtoUrl;

    setSubmitted(true);
  };

  return (
    <div className="w-full mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-[#262626]">
      {/* Live TextMorph Preview Banner */}
      <div className="mb-6 sm:mb-8">
        <div className="min-h-[2.8rem] sm:min-h-[3.6rem] flex items-center overflow-x-hidden">
          <TextMorph className="type-h3 uppercase text-[#fafafa] tracking-tight leading-tight">
            {previewText}
          </TextMorph>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name Input */}
          <div>
            <label htmlFor="contact-name" className="sr-only">
              {lang === 'EN' ? 'Your Name' : 'Nama Anda'}
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder={lang === 'EN' ? 'Your Name / Organization *' : 'Nama Anda / Organisasi *'}
              className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#fafafa] focus:outline-none rounded-none px-4 py-3 text-sm font-sans text-[#fafafa] placeholder-[#fafafa]/40 transition-colors duration-200"
            />
          </div>

          {/* Email or WhatsApp Input */}
          <div>
            <label htmlFor="contact-info" className="sr-only">
              {lang === 'EN' ? 'Email or WhatsApp' : 'Email atau WhatsApp'}
            </label>
            <input
              id="contact-info"
              type="text"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                if (error) setError(null);
              }}
              placeholder={lang === 'EN' ? 'Email or WhatsApp (+62...) *' : 'Email atau WhatsApp (+62...) *'}
              className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#fafafa] focus:outline-none rounded-none px-4 py-3 text-sm font-sans text-[#fafafa] placeholder-[#fafafa]/40 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Message / Inquiry Input */}
        <div>
          <label htmlFor="contact-message" className="sr-only">
            {lang === 'EN' ? 'Project Details' : 'Detail Proyek'}
          </label>
          <input
            id="contact-message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              lang === 'EN'
                ? 'Brief project scope or message (optional)'
                : 'Pesan atau lingkup proyek singkat (opsional)'
            }
            className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#fafafa] focus:outline-none rounded-none px-4 py-3 text-sm font-sans text-[#fafafa] placeholder-[#fafafa]/40 transition-colors duration-200"
          />
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#fafafa] bg-[#1a1a1a] border border-[#333333] px-3.5 py-2">
            <AlertCircle className="w-3.5 h-3.5 text-[#bfe100] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notification */}
        {submitted && !error && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#bfe100] bg-[#141414] border border-[#262626] px-3.5 py-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#bfe100] shrink-0" />
            <span>
              {lang === 'EN'
                ? `Thank you, ${trimmedName}! Launching your email client...`
                : `Terima kasih, ${trimmedName}! Membuka aplikasi email Anda...`}
            </span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            data-cursor-interactive="true"
            className="group inline-flex items-center gap-2.5 px-6 py-3 bg-[#fafafa] text-[#000000] hover:bg-[#bfe100] font-sans font-bold text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#fafafa]"
          >
            <span>{lang === 'EN' ? 'Send Message' : 'Kirim Pesan'}</span>
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>
      </form>
    </div>
  );
}

