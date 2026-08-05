import { ContactMessage, type IContactMessage } from "@/models/ContactMessage.model";
import { ApiError } from "@/utils/ApiError";

export async function createContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<IContactMessage> {
  return ContactMessage.create(data);
}

export async function listContactMessages(): Promise<IContactMessage[]> {
  return ContactMessage.find().sort({ createdAt: -1 });
}

export async function markContactMessageRead(id: string, isRead: boolean): Promise<IContactMessage> {
  const message = await ContactMessage.findByIdAndUpdate(id, { isRead }, { new: true });
  if (!message) throw ApiError.notFound("Message not found.");
  return message;
}
