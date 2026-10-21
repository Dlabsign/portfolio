"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "ID" | "EN";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "EN",
  setLang: () => {},
  toggleLang: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("EN");

  const toggleLang = () => {
    setLang((prev) => (prev === "EN" ? "ID" : "EN"));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
