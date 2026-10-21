import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-pp-neue-montreal)",
          "'PP Neue Montreal'",
          "'PP Neue'",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        headline: [
          "var(--font-space-grotesk)",
          "'Space Grotesk'",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          "var(--font-space-grotesk)",
          "'Space Grotesk'",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        serif: [
          "var(--font-pp-neue-montreal)",
          "'PP Neue Montreal'",
          "'PP Neue'",
          "sans-serif",
        ],
        mono: [
          "var(--font-pp-neue-montreal)",
          "'PP Neue Montreal'",
          "'PP Neue'",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      fontSize: {
        h1: ["48px", { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "600" }],
        "h1-mobile": ["36px", { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "600" }],
        h2: ["36px", { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "600" }],
        "h2-mobile": ["28px", { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "600" }],
        h3: ["24px", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" }],
        "h3-mobile": ["22px", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" }],
        h4: ["20px", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["14px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" }],
        btn: ["14px", { lineHeight: "1.2", fontWeight: "500" }],
      },
      colors: {
        canvas: "#FAFAFA",
        graphite: {
          DEFAULT: "#2d2d2a",
          secondary: "#6e6e69",
          muted: "#96958f",
          light: "#e2e1dc",
          faint: "#f5f5f2",
        },
        scarlet: {
          DEFAULT: "#e50319",
          hover: "#c80215",
          light: "rgba(229, 3, 25, 0.08)",
          border: "rgba(229, 3, 25, 0.25)",
        },
        lime: {
          DEFAULT: "#bfe100",
          hover: "#aed000",
          light: "rgba(191, 225, 0, 0.16)",
          border: "rgba(191, 225, 0, 0.35)",
        },
        ink: {
          DEFAULT: "#2d2d2a",
          secondary: "#6e6e69",
        },
        hairline: {
          DEFAULT: "#E5E4E0",
          warm: "#ECEBE7",
        },
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      letterSpacing: {
        heading: "-0.03em",
        caption: "0.05em",
        tighter: "-0.05em",
        tight: "-0.025em",
      },
      lineHeight: {
        heading: "1.15",
        body: "1.6",
        tightest: "0.92",
        tighter: "0.96",
      },
    },
  },
  plugins: [],
};

export default config;
