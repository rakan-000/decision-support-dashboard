import { cookies } from "next/headers";
import { config } from "@/lib/config";
import { translate, type Locale } from "./dictionary";

export const LOCALE_COOKIE = "locale";

/** Server-side: resolve the active locale from cookie or default. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  if (value === "ar" || value === "en") return value;
  return config.platform.defaultLocale;
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Server-side translator bound to a locale. */
export function getT(locale: Locale) {
  return (key: string) => translate(key, locale);
}

export type { Locale };
export { translate };
