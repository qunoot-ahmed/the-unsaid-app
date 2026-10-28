import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Literata, Newsreader } from "next/font/google";
import type { ReactNode } from "react";
import { SkipLink } from "@/shared/ui";
import "./globals.css";

const display = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

const reading = Literata({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-literata",
  display: "swap",
});

// next/font has no metric overrides for this family, so the fallback is declared explicitly.
const ui = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-atkinson",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: { default: "The Unsaid", template: "%s · The Unsaid" },
  description: "Some stories are written. Others are confessed.",
};

export const viewport: Viewport = {
  themeColor: "#121014",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${reading.variable} ${ui.variable}`}>
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
