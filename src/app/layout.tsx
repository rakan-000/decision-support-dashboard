import type { Metadata } from "next";
import "./globals.css";
import { getLocale, dir } from "@/lib/i18n";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

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
      className="dark h-full antialiased"
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
