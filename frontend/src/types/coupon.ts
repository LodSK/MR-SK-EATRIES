export type CouponType = "percentage" | "fixed";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minimumSpend: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CouponPayload {
  code: string;
  type: CouponType;
  value: number;
  minimumSpend?: number;
  maxUses?: number;
  expiresAt?: string;
  isActive?: boolean;
}
