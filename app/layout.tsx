import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Configure PP Neue Montreal locally for body & headline typography
const ppNeueMontreal = localFont({
  src: [
    {
      path: "../public/fonts/pp-neue-montreal/ppneuemontreal-thin.otf",
      weight: "100 200",
      style: "normal",
    },
    {
      path: "../public/fonts/pp-neue-montreal/ppneuemontreal-book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/pp-neue-montreal/ppneuemontreal-italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/pp-neue-montreal/ppneuemontreal-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/pp-neue-montreal/ppneuemontreal-semibolditalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/pp-neue-montreal/ppneuemontreal-bold.otf",
      weight: "700 900",
      style: "normal",
    },
  ],
  variable: "--font-pp-neue-montreal",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://danielkurnia.vercel.app"),
  title: "Daniel Kurnia — Minimalist Editorial & Typography",
  description:
    "Portfolio of Daniel Kurnia (@danielkuptr). Minimalist editorial interface, high-contrast typography in PP Neue Montreal, and digital systems architecture.",
  keywords: [
    "Daniel Kurnia",
    "PP Neue Montreal",
    "danielkuptr",
    "dlabsign.ID",
    "Minimalist Editorial",
    "Typography",
    "Web Development",
    "Software Engineer",
    "Next.js",
  ],
  authors: [{ name: "Daniel Kurnia" }],
  creator: "Daniel Kurnia",
};

export const viewport: Viewport = {
  themeColor: "#FAFAFA",
  width: "device-width",
  initialScale: 1,
};

import { LanguageProvider } from "@/context/LanguageContext";
import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ppNeueMontreal.variable} ${ppNeueMontreal.className} bg-[#FAFAFA] text-[#2d2d2a]`}
    >
      <body
        className={`${ppNeueMontreal.className} font-sans antialiased bg-[#FAFAFA] text-[#2d2d2a] selection:bg-[#bfe100] selection:text-[#2d2d2a]`}
      >
        <LanguageProvider>
          {children}
          <CustomCursor />
        </LanguageProvider>
      </body>
    </html>
  );
}
