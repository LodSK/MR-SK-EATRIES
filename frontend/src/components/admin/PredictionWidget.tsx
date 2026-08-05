"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Loader2, RefreshCw } from "lucide-react";
import type { PredictionType, AIPredictionResult } from "@/types/ai";
import { useAI } from "@/lib/hooks/useAI";
import { Button } from "@/components/ui/button";

interface PredictionWidgetProps {
  type: PredictionType;
  label: string;
  description: string;
  icon: LucideIcon;
}

/**
 * One parameterized widget for all 4 prediction types, mirroring the
 * AnalyticsAreaChart precedent (Sprint 12) of a single reusable component
 * over near-identical ones. Each instance owns its own useAI() call so
 * generating one estimate never blocks or clobbers another's loading state.
 */
export function PredictionWidget({ type, label, description, icon: Icon }: PredictionWidgetProps) {
  const { getPrediction, isSending, error } = useAI();
  const [result, setResult] = React.useState<AIPredictionResult | null>(null);

  async function handleGenerate() {
    const prediction = await getPrediction(type);
    setResult(prediction);
  }

  const dataEntries = result ? Object.entries(result.data) : [];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary dark:bg-brand-accent/10 dark:text-brand-accent">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold">{label}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      {result && (
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm leading-relaxed">{result.summary}</p>
          {dataEntries.length > 0 && (
            <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-border pt-3">
              {dataEntries.map(([key, value]) => (
                <div key={key} className="flex items-baseline gap-1.5 text-xs">
                  <dt className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1").trim()}:</dt>
                  <dd className="font-semibold text-foreground">{String(value)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {error && !isSending && <p className="text-xs text-destructive">{error}</p>}

      <Button type="button" variant="outline" size="sm" onClick={handleGenerate} disabled={isSending} className="self-start">
        {isSending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : result ? (
          <RefreshCw className="h-3.5 w-3.5" />
        ) : null}
        {result ? "Regenerate" : "Generate Estimate"}
      </Button>
    </div>
  );
}
