export interface PaymentMethod {
  id: string;
  nickname: string;
  maskedNumber: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: string;
}

export interface CreatePaymentMethodPayload {
  nickname: string;
  maskedNumber: string;
  brand?: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault?: boolean;
}
