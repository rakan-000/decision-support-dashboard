"use client";

import { Check, Loader2, Clock, FileSearch, Tags, CircleCheck, AlertTriangle } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

export type TimelineStatus =
  | "pending"
  | "uploading"
  | "queued"
  | "extracting"
  | "classifying"
  | "complete"
  | "failed";

const STAGES: { key: string; en: string; ar: string; icon: typeof Clock }[] = [
  { key: "queued", en: "Queued", ar: "في الانتظار", icon: Clock },
  { key: "extracting", en: "Extracting content", ar: "استخراج المحتوى", icon: FileSearch },
  { key: "classifying", en: "Classifying", ar: "التصنيف", icon: Tags },
  { key: "complete", en: "Complete", ar: "اكتمل", icon: CircleCheck },
];

const ORDER: Record<string, number> = {
  pending: 0,
  uploading: 0,
  queued: 0,
  extracting: 1,
  classifying: 2,
  complete: 3,
  failed: -1,
};

export function ProcessingTimeline({
  status,
  error,
}: {
  status: TimelineStatus;
  error?: string | null;
}) {
  const { locale } = useLocale();
  const current = ORDER[status] ?? 0;
  const failed = status === "failed";

  return (
    <div className="mt-3 space-y-2">
      {STAGES.map((stage, i) => {
        const done = !failed && current > i;
        const active = !failed && current === i && status !== "complete";
        const isCompleteStage = stage.key === "complete" && status === "complete";
        const failedHere = failed && i === Math.max(0, current);
        const Icon = stage.icon;

        return (
          <div key={stage.key} className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border text-[var(--muted-foreground)]",
                (done || isCompleteStage) && "border-[var(--ok)] bg-[var(--ok)] text-white",
                active && "border-[var(--primary-500)] text-[var(--primary-500)]",
                failedHere && "border-[var(--danger)] bg-[var(--danger)] text-white",
                !done && !active && !isCompleteStage && !failedHere && "border-[var(--border)]",
              )}
            >
              {done || isCompleteStage ? (
                <Check className="size-3.5" />
              ) : active ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : failedHere ? (
                <AlertTriangle className="size-3.5" />
              ) : (
                <Icon className="size-3.5" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-xs",
                  done || active || isCompleteStage
                    ? "font-medium text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)]",
                  failedHere && "font-medium text-[var(--danger)]",
                )}
              >
                {locale === "ar" ? stage.ar : stage.en}
              </p>
              {failedHere && error && (
                <p className="text-[11px] text-[var(--danger)]">{error}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
