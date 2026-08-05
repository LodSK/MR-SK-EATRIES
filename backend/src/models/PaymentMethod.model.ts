import { Schema, model, type Document, type Types } from "mongoose";

export interface IPaymentMethod extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  nickname: string;
  /** Last 4 digits only — this is a placeholder architecture, never store full card numbers. */
  maskedNumber: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Placeholder architecture only — no real payment gateway (Stripe etc.)
 * is integrated. This model exists so the dashboard UI has something
 * real to read/write while payment processing itself is out of scope
 * until a later sprint explicitly adds it. Never stores a full card
 * number, CVV, or anything PCI-sensitive.
 */
const paymentMethodSchema = new Schema<IPaymentMethod>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    nickname: { type: String, required: true, trim: true },
    maskedNumber: { type: String, required: true },
    brand: { type: String, default: "Card" },
    expiryMonth: { type: Number, required: true, min: 1, max: 12 },
    expiryYear: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PaymentMethod = model<IPaymentMethod>("PaymentMethod", paymentMethodSchema);
