import type { DeliveryMethod, PaymentMethod as PaymentMethodType } from "@/types/cart";

export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";

export interface OrderLineItem {
  menuItem: string;
  name: string;
  price: number;
  quantity: number;
  currency: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderLineItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  serviceCharge: number;
  tax: number;
  grandTotal: number;
  couponCode?: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethodType;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentReference?: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: { street: string; city: string; notes?: string };
  instructions?: string;
  estimatedDeliveryMinutes: [number, number];
  createdAt: string;
}
