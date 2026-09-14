import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",
        border: "var(--border)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        primary: "rgb(var(--primary-rgb) / <alpha-value>)",
        "primary-hover": "var(--primary-hover)",
        status: {
          low: "rgb(var(--status-low-rgb) / <alpha-value>)",
          medium: "rgb(var(--status-medium-rgb) / <alpha-value>)",
          high: "rgb(var(--status-high-rgb) / <alpha-value>)",
          critical: "rgb(var(--status-critical-rgb) / <alpha-value>)",
        },
        brass: "var(--brass)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "4px",
        pill: "999px",
      },
      boxShadow: {
        panel: "0 1px 0 0 var(--border)",
        drawer: "-8px 0 24px -8px rgba(0,0,0,0.35)",
      },
      keyframes: {
        "row-in": {
          "0%": { opacity: "0", transform: "translateY(-4px)", backgroundColor: "var(--row-highlight)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "row-in": "row-in 900ms ease-out",
        "toast-in": "toast-in 220ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
