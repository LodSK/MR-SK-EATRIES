import { Schema, type Types } from "mongoose";

export interface IOrderItem {
  menuItem: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  currency: string;
}

/**
 * Not a top-level collection — order items only ever exist embedded
 * inside an Order (the correct MongoDB pattern for line items). Kept in
 * its own file per the sprint's requested model list, and imported by
 * Order.model.ts.
 */
export const orderItemSchema = new Schema<IOrderItem>(
  {
    menuItem: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "GHS" },
  },
  { _id: false }
);
