"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { EcosystemOverlay } from "@/components/layout/ecosystem-map";
import { NextChapter } from "@/components/layout/next-chapter";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [ecoOpen, setEcoOpen] = useState(false);

  // Escape closes the ecosystem overlay.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setEcoOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Cinematic ambient layers */}
      <div className="app-backdrop" aria-hidden />
      <div className="app-grid" aria-hidden />
      <div className="app-scanlines" aria-hidden />
      <div className="app-vignette" aria-hidden />
      <div className="app-grain" aria-hidden />

      <Sidebar className="hidden md:flex" />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenEcosystem={() => setEcoOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8">
            {children}
            <NextChapter />
          </div>
        </main>
      </div>

      <EcosystemOverlay open={ecoOpen} onClose={() => setEcoOpen(false)} />
    </div>
  );
}
