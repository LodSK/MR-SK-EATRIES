import { Schema, model, type Document, type Types } from "mongoose";
import { MENU_CATEGORIES, type MenuCategorySlug } from "@/config/constants";

export interface INutrition {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface IMenuItem extends Document {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: MenuCategorySlug;
  price: number;
  currency: string;
  images: string[];
  rating: number;
  reviewCount: number;
  prepTimeMinutes: number;
  tag?: "New" | "Popular" | "Chef's Pick";
  isVegetarian: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  popularityScore: number;
  stockQuantity: number;
  ingredients: string[];
  nutrition: INutrition;
  createdAt: Date;
  updatedAt: Date;
}

const nutritionSchema = new Schema<INutrition>(
  {
    calories: { type: Number, default: 0 },
    proteinGrams: { type: Number, default: 0 },
    carbsGrams: { type: Number, default: 0 },
    fatGrams: { type: Number, default: 0 },
  },
  { _id: false }
);

const menuItemSchema = new Schema<IMenuItem>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    category: { type: String, enum: MENU_CATEGORIES, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "GHS" },
    images: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    prepTimeMinutes: { type: Number, default: 15 },
    tag: { type: String, enum: ["New", "Popular", "Chef's Pick"] },
    isVegetarian: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false, index: true },
    popularityScore: { type: Number, default: 0, index: true },
    stockQuantity: { type: Number, default: 999 },
    ingredients: { type: [String], default: [] },
    nutrition: { type: nutritionSchema, default: () => ({}) },
  },
  { timestamps: true }
);

menuItemSchema.index({ name: "text", description: "text" });
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ price: 1 });

export const MenuItem = model<IMenuItem>("MenuItem", menuItemSchema);
