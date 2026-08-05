"use client";

import * as React from "react";
import { Clock, Flame, Truck, TrendingUp, Sparkles, RefreshCw, Loader2 } from "lucide-react";
import type { PredictionType, AIInsightsResult } from "@/types/ai";
import { useAI } from "@/lib/hooks/useAI";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { PredictionWidget } from "@/components/admin/PredictionWidget";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";

const PREDICTION_WIDGETS: { type: PredictionType; label: string; description: string; icon: typeof Clock }[] = [
  { type: "prep-time", label: "Prep Time", description: "How long the kitchen needs for current orders.", icon: Clock },
  { type: "kitchen-load", label: "Kitchen Load", description: "How busy the kitchen is right now.", icon: Flame },
  { type: "delivery-time", label: "Delivery Time", description: "Estimated delivery time from recent order volume.", icon: Truck },
  { type: "sales-forecast", label: "Sales Forecast", description: "Projected revenue based on recent trends.", icon: TrendingUp },
];

/**
 * Sprint 13C. The backend (getInsights/getPrediction) and the useAI() hook
 * surface (Sprint 13A/13B) were already complete — this page is purely UI
 * against an already-verified layer. "Prediction Widgets" are rendered
 * here rather than as a separate page/route: they're operationally the
 * same audience and screen as AI Insights, so splitting them out would
 * just be a second staff-only page showing the other half of the same
 * data source.
 */
export function AdminAI() {
  const { getInsights, isSending, error } = useAI();
  const [insights, setInsights] = React.useState<AIInsightsResult | null>(null);
  const [hasLoaded, setHasLoaded] = React.useState(false);

  const loadInsights = React.useCallback(async () => {
    const result = await getInsights();
    setInsights(result);
    setHasLoaded(true);
  }, [getInsights]);

  React.useEffect(() => {
    loadInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold">AI Insights</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Real Claude/Gemini-backed operational insights and estimates, grounded in your actual orders,
          reservations, and revenue — never fabricated.
        </p>
      </div>

      <DashboardCard
        title="Restaurant Insights"
        action={
          <Button type="button" variant="ghost" size="sm" onClick={loadInsights} disabled={isSending}>
            {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Refresh
          </Button>
        }
      >
        {!hasLoaded && isSending ? (
          <Skeleton className="h-20 w-full" />
        ) : insights ? (
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary dark:text-brand-accent" aria-hidden="true" />
            <div>
              <p className="text-sm leading-relaxed">{insights.summary}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Generated {new Date(insights.generatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {error ?? "Insights are unavailable right now."}
          </p>
        )}
      </DashboardCard>

      <div>
        <h3 className="mb-4 font-display text-lg font-bold">Predictions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PREDICTION_WIDGETS.map((widget) => (
            <PredictionWidget key={widget.type} {...widget} />
          ))}
        </div>
      </div>
    </div>
  );
}
