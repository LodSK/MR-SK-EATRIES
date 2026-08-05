import { Schema, model, type Document, type Types } from "mongoose";
import { MENU_CATEGORIES, type MenuCategorySlug } from "@/config/constants";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  slug: MenuCategorySlug;
  name: string;
  description: string;
  imageUrl?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    slug: { type: String, enum: MENU_CATEGORIES, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: String,
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", categorySchema);
