import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { Notification } from "@/models/Notification.model";

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await Notification.find({ user: req.user!.id }).sort({ createdAt: -1 }).limit(50);
  return ApiResponse.ok(res, notifications);
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user!.id },
    { isRead: true },
    { new: true }
  );
  return ApiResponse.ok(res, notification, "Marked as read.");
});

export const markAllNotificationsRead = asyncHandler(async (req: Request, res: Response) => {
  await Notification.updateMany({ user: req.user!.id, isRead: false }, { isRead: true });
  return ApiResponse.ok(res, null, "All notifications marked as read.");
});
