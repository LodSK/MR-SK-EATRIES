import { PaymentMethod, type IPaymentMethod } from "@/models/PaymentMethod.model";
import { ApiError } from "@/utils/ApiError";

export async function listPaymentMethods(userId: string) {
  return PaymentMethod.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
}

export async function createPaymentMethod(
  userId: string,
  data: Omit<IPaymentMethod, "_id" | "user" | "createdAt" | "updatedAt">
) {
  if (data.isDefault) {
    await PaymentMethod.updateMany({ user: userId }, { isDefault: false });
  }
  const existingCount = await PaymentMethod.countDocuments({ user: userId });
  return PaymentMethod.create({ ...data, user: userId, isDefault: data.isDefault || existingCount === 0 });
}

export async function setDefaultPaymentMethod(userId: string, id: string) {
  const method = await PaymentMethod.findOne({ _id: id, user: userId });
  if (!method) throw ApiError.notFound("Payment method not found.");

  await PaymentMethod.updateMany({ user: userId }, { isDefault: false });
  method.isDefault = true;
  await method.save();
  return method;
}

export async function deletePaymentMethod(userId: string, id: string) {
  const method = await PaymentMethod.findOneAndDelete({ _id: id, user: userId });
  if (!method) throw ApiError.notFound("Payment method not found.");

  if (method.isDefault) {
    const next = await PaymentMethod.findOne({ user: userId }).sort({ createdAt: 1 });
    if (next) {
      next.isDefault = true;
      await next.save();
    }
  }
}
