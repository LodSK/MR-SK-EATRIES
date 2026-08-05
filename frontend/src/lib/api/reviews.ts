import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type { AdminReview, CreateReviewPayload, Review } from "@/types/review";

interface RawUser {
  _id: string;
  fullName: string;
}

interface RawReview {
  _id: string;
  user: RawUser;
  menuItem: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function normalizeReview(raw: RawReview): Review {
  return {
    id: raw._id,
    user: { id: raw.user._id, fullName: raw.user.fullName },
    menuItem: raw.menuItem,
    rating: raw.rating,
    comment: raw.comment,
    createdAt: raw.createdAt,
  };
}

export async function getMenuItemReviews(menuItemId: string): Promise<Review[]> {
  const { data } = await httpClient.get(`/reviews/menu-item/${menuItemId}`);
  return (data.data as RawReview[]).map(normalizeReview);
}

/**
 * The create response isn't populated with the reviewer's name (Review.create()
 * doesn't .populate("user")), so this doesn't return a display-ready Review —
 * callers re-fetch the list (which is populated) after a successful submit.
 */
export async function createReview(
  payload: CreateReviewPayload
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.post("/reviews", payload);
    return { success: true, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "We couldn't submit your review. Please try again."),
    };
  }
}

// ── Admin ──────────────────────────────────────────────────────────

interface RawAdminReview {
  _id: string;
  user: RawUser;
  menuItem: { _id: string; name: string };
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

function normalizeAdminReview(raw: RawAdminReview): AdminReview {
  return {
    id: raw._id,
    user: { id: raw.user._id, fullName: raw.user.fullName },
    menuItem: { id: raw.menuItem._id, name: raw.menuItem.name },
    rating: raw.rating,
    comment: raw.comment,
    isApproved: raw.isApproved,
    createdAt: raw.createdAt,
  };
}

export async function adminListReviews(): Promise<AdminReview[]> {
  const { data } = await httpClient.get("/admin/reviews");
  return (data.data as RawAdminReview[]).map(normalizeAdminReview);
}

export async function adminModerateReview(
  id: string,
  isApproved: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.patch(`/admin/reviews/${id}`, { isApproved });
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
