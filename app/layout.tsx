import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Providers } from "./providers";
import { ThemeSync } from "@/components/shared/ThemeSync";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "StockSync — Swati Keshari",
  description:
    "Personal inventory workbench that shows when shop, warehouse, and online stock lists disagree.",
};

// Inline, render-blocking theme script: reads localStorage before paint so
// there's no light/dark flash on load. Falls back to prefers-color-scheme.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("stocksync-theme");
    var theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <ThemeSync />
          {children}
        </Providers>
      </body>
    </html>
  );
}
