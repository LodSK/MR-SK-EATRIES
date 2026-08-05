import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type { CreatePaymentMethodPayload, PaymentMethod } from "@/types/paymentMethod";

function normalize(raw: PaymentMethod & { _id?: string }): PaymentMethod {
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const { data } = await httpClient.get("/payment-methods");
  return (data.data as PaymentMethod[]).map(normalize);
}

export async function createPaymentMethod(
  payload: CreatePaymentMethodPayload
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.post("/payment-methods", payload);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "Couldn't save this card.") };
  }
}

export async function setDefaultPaymentMethod(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.patch(`/payment-methods/${id}/default`);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function deletePaymentMethod(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.delete(`/payment-methods/${id}`);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
