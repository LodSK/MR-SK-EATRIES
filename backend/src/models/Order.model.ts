import { Schema, model, type Document, type Types } from "mongoose";
import { orderItemSchema, type IOrderItem } from "@/models/OrderItem.model";
import {
  ORDER_STATUSES,
  DELIVERY_METHODS,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  type OrderStatus,
  type DeliveryMethod,
  type PaymentMethod,
  type PaymentStatus,
} from "@/config/constants";

export interface IOrder extends Document {
  _id: Types.ObjectId;
  orderNumber: string;
  user?: Types.ObjectId;
  guestEmail?: string;

  items: IOrderItem[];

  subtotal: number;
  discount: number;
  deliveryFee: number;
  serviceCharge: number;
  tax: number;
  grandTotal: number;

  couponCode?: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  /** Paystack transaction reference — set once initializeOrderPayment runs. */
  paymentReference?: string;
  paidAt?: Date;
  status: OrderStatus;

  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: { street: string; city: string; notes?: string };
  instructions?: string;

  estimatedDeliveryMinutes: [number, number];

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    guestEmail: String,

    items: { type: [orderItemSchema], required: true, validate: (v: unknown[]) => v.length > 0 },

    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    serviceCharge: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },

    couponCode: String,
    deliveryMethod: { type: String, enum: DELIVERY_METHODS, required: true },
    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: "pending", index: true },
    paymentReference: { type: String, index: true, sparse: true },
    paidAt: Date,
    status: { type: String, enum: ORDER_STATUSES, default: "pending", index: true },

    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: {
      street: String,
      city: String,
      notes: String,
    },
    instructions: String,

    estimatedDeliveryMinutes: { type: [Number], default: [30, 45] },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });

export const Order = model<IOrder>("Order", orderSchema);
