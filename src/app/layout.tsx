import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getLocale, dir } from "@/lib/i18n";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

// Self-hosted fonts — no runtime/build dependency on Google Fonts (gstatic).
// Font files live in ./fonts and ship with the app (privacy-first).
const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [{ path: "./fonts/inter-latin-variable.woff2", weight: "100 900", style: "normal" }],
});

const plexArabic = localFont({
  variable: "--font-arabic",
  display: "swap",
  src: [
    { path: "./fonts/ibm-plex-arabic-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/ibm-plex-arabic-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-arabic-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-arabic-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ibm-plex-arabic-700.woff2", weight: "700", style: "normal" },
  ],
});

// JetBrains Mono — technical labels, metadata, counters (terminal language).
const jetbrainsMono = localFont({
  variable: "--font-mono",
  display: "swap",
  src: [
    { path: "./fonts/jetbrains-mono-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/jetbrains-mono-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/jetbrains-mono-700.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Shared Services Decision Intelligence",
  description:
    "Turning organizational documents into executive intelligence for the Saudi nonprofit sector.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${inter.variable} ${plexArabic.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <LocaleProvider locale={locale}>
          <ThemeProvider>{children}</ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
