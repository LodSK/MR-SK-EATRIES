"use client";

import * as React from "react";
import { Sparkles, Search, Wand2, Loader2 } from "lucide-react";
import type { MenuItem } from "@/types/menu";
import type { AIRecommendationParams } from "@/types/ai";
import { useAI } from "@/lib/hooks/useAI";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { Skeleton } from "@/components/shared/Skeleton";
import { cn } from "@/lib/utils/cn";

interface AIMenuAssistantProps {
  items: MenuItem[];
}

type Mode = "search" | "recommend";

const DIETARY_OPTIONS = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"];

const TIME_OF_DAY_LABELS: Record<NonNullable<AIRecommendationParams["timeOfDay"]>, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  "late-night": "Late Night",
};

/**
 * Serves both "Recommendation Cards" and "Smart Search UI" (Sprint 13C)
 * as one component with two modes rather than two near-identical ones —
 * they share the same input→AI-call→result-grid shape and both resolve
 * their answer against the exact same MenuGrid/MenuCard the rest of the
 * site already uses for displaying dishes, so no new "card" component was
 * built for either requirement.
 */
export function AIMenuAssistant({ items }: AIMenuAssistantProps) {
  const { searchMenu, getRecommendations, isSending, error } = useAI();
  const [mode, setMode] = React.useState<Mode>("search");
  const [query, setQuery] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = React.useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = React.useState<AIRecommendationParams["timeOfDay"] | "">("");
  const [reply, setReply] = React.useState<string | null>(null);
  const [matchedIds, setMatchedIds] = React.useState<string[] | null>(null);

  const itemsById = React.useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);

  const resultItems = React.useMemo(() => {
    if (!matchedIds) return [];
    return matchedIds.map((id) => itemsById.get(id)).filter((item): item is MenuItem => Boolean(item));
  }, [matchedIds, itemsById]);

  function toggleDietary(option: string) {
    setDietaryRestrictions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const result = await searchMenu(query.trim());
    if (result) {
      setReply(result.reply);
      setMatchedIds(result.matchedItemIds);
    }
  }

  async function handleRecommend(e: React.FormEvent) {
    e.preventDefault();
    const params: AIRecommendationParams = {
      budget: budget ? Number(budget) : undefined,
      dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
      timeOfDay: timeOfDay || undefined,
    };
    const result = await getRecommendations(params);
    if (result) {
      setReply(result.reply);
      setMatchedIds(result.recommendedItemIds);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setReply(null);
    setMatchedIds(null);
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary dark:bg-brand-accent/10 dark:text-brand-accent">
          <Sparkles className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold">Let AI Help You Choose</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe what you&apos;re craving, or tell us your budget and preferences — real dishes from
            our actual menu, never invented.
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => switchMode("search")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
            mode === "search"
              ? "border-brand-primary bg-brand-primary text-white dark:border-brand-accent dark:bg-brand-accent dark:text-brand-secondary"
              : "border-border text-muted-foreground hover:border-brand-primary/40"
          )}
        >
          <Search className="h-4 w-4" />
          Ask AI
        </button>
        <button
          type="button"
          onClick={() => switchMode("recommend")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
            mode === "recommend"
              ? "border-brand-primary bg-brand-primary text-white dark:border-brand-accent dark:bg-brand-accent dark:text-brand-secondary"
              : "border-border text-muted-foreground hover:border-brand-primary/40"
          )}
        >
          <Wand2 className="h-4 w-4" />
          Get Recommendations
        </button>
      </div>

      {mode === "search" ? (
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. something light and spicy under GHS 50"
            className="h-11 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
          <Button type="submit" disabled={isSending || !query.trim()}>
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Ask AI
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRecommend} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Budget (GHS, optional)
              </label>
              <input
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 80"
                className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Time of Day</label>
              <Select
                value={timeOfDay || undefined}
                onValueChange={(v) => setTimeOfDay(v as AIRecommendationParams["timeOfDay"])}
              >
                <SelectTrigger aria-label="Time of day">
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TIME_OF_DAY_LABELS) as (keyof typeof TIME_OF_DAY_LABELS)[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {TIME_OF_DAY_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <span className="mb-2 block text-xs font-semibold text-muted-foreground">
              Dietary Preferences
            </span>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {DIETARY_OPTIONS.map((option) => (
                <label key={option} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={dietaryRestrictions.includes(option)}
                    onCheckedChange={() => toggleDietary(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isSending} className="self-start">
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            Get Recommendations
          </Button>
        </form>
      )}

      {error && !isSending && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {isSending && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!isSending && reply && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary dark:text-brand-accent" aria-hidden="true" />
            <p className="text-sm leading-relaxed">{reply}</p>
          </div>
          {resultItems.length > 0 && <MenuGrid items={resultItems} />}
        </div>
      )}
    </div>
  );
}
