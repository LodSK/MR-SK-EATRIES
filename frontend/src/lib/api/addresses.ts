import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type { Address, AddressPayload } from "@/types/address";

/**
 * Wraps the existing address endpoints on user.routes.ts (Sprint 9) —
 * addresses are embedded on the User document, not a separate collection,
 * so there's no dedicated address.*.ts backend file to call. See
 * PROJECT_STATUS.md for the full reasoning.
 */

function normalize(raw: Address & { _id?: string }): Address {
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

export async function addAddress(payload: AddressPayload): Promise<{ success: boolean; message: string; addresses?: Address[] }> {
  try {
    const { data } = await httpClient.post("/users/me/addresses", payload);
    return { success: true, message: data.message, addresses: (data.data as Address[]).map(normalize) };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function updateAddress(
  id: string,
  payload: Partial<AddressPayload>
): Promise<{ success: boolean; message: string; addresses?: Address[] }> {
  try {
    const { data } = await httpClient.patch(`/users/me/addresses/${id}`, payload);
    return { success: true, message: data.message, addresses: (data.data as Address[]).map(normalize) };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function removeAddress(id: string): Promise<{ success: boolean; message: string; addresses?: Address[] }> {
  try {
    const { data } = await httpClient.delete(`/users/me/addresses/${id}`);
    return { success: true, message: data.message, addresses: (data.data as Address[]).map(normalize) };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
