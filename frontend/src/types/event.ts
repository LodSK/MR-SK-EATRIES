export type EventFrequency = "weekly" | "monthly" | "one-time";

export interface RestaurantEvent {
  id: string;
  title: string;
  description: string;
  schedule: string;
  frequency: EventFrequency;
  icon: "music" | "wine" | "utensils" | "cake" | "sun" | "gift";
}
