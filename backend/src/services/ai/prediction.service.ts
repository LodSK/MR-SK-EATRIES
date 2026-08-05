import type { AIProvider } from "@/services/ai/ai-provider.interface";
import { PromptTemplates } from "@/services/ai/prompt-templates";
import { getDashboardSummary, getOrdersByDay, getRevenueByDay } from "@/services/analytics.service";
import type { PredictionRequest, PredictionResult } from "@/types/ai";

/**
 * Architecture-only per the brief. Each prediction type pulls real
 * operational data from the existing analytics.service.ts (built in
 * Sprint 9, extended Sprint 12) — the AI's job is to interpret that data
 * into an estimate, never to fabricate numbers with no basis. Genuinely
 * time-series-model-backed forecasting (vs. an LLM's interpretation of
 * recent trends) is a reasonable Sprint 13B/C enhancement; this
 * architecture doesn't block that — a real model's output would just
 * become another input alongside what's already gathered here.
 */
export class PredictionService {
  constructor(private readonly provider: AIProvider) {}

  async predict(request: PredictionRequest): Promise<PredictionResult> {
    const context = await this.gatherContext(request);

    const response = await this.provider.generate({
      systemPrompt: PromptTemplates.predictionAssistant(request.type, JSON.stringify(context)),
      messages: [{ role: "user", content: `Provide a ${request.type} estimate.` }],
      maxTokens: 400,
      forceJson: true,
    });

    return this.parseResult(request.type, response.content);
  }

  private async gatherContext(request: PredictionRequest): Promise<Record<string, unknown>> {
    switch (request.type) {
      case "prep-time":
      case "kitchen-load": {
        const summary = await getDashboardSummary();
        return { ordersByStatus: summary.ordersByStatus, ...request.context };
      }
      case "delivery-time": {
        const ordersByDay = await getOrdersByDay(7);
        return { recentOrderVolume: ordersByDay, ...request.context };
      }
      case "sales-forecast": {
        const revenueByDay = await getRevenueByDay(30);
        return { revenueTrend: revenueByDay, ...request.context };
      }
      default:
        return { ...request.context };
    }
  }

  private parseResult(type: PredictionRequest["type"], raw: string): PredictionResult {
    try {
      const parsed = JSON.parse(raw.trim());
      return {
        type,
        summary: typeof parsed.summary === "string" ? parsed.summary : "Estimate unavailable.",
        data: typeof parsed.data === "object" && parsed.data !== null ? parsed.data : {},
      };
    } catch {
      return { type, summary: "Estimate unavailable — the AI response could not be parsed.", data: {} };
    }
  }
}
