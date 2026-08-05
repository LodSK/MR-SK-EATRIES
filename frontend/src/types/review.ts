export interface Review {
  id: string;
  user: { id: string; fullName: string };
  menuItem: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  menuItemId: string;
  rating: number;
  comment: string;
}

/** Admin listing populates a fuller `menuItem` shape than the public per-item endpoint. */
export interface AdminReview {
  id: string;
  user: { id: string; fullName: string };
  menuItem: { id: string; name: string };
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}
