"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <AlertTriangle className="size-8 text-[var(--danger)]" />
      <p className="text-sm text-[var(--muted-foreground)]">
        Something went wrong loading this analysis.
      </p>
      <Button variant="secondary" size="sm" onClick={reset}>
        Try again
      </Button>
    </Card>
  );
}
