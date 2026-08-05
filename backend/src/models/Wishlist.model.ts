import { Schema, model, type Document, type Types } from "mongoose";

export interface IWishlist extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  menuItems: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    menuItems: [{ type: Schema.Types.ObjectId, ref: "MenuItem" }],
  },
  { timestamps: true }
);

export const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);
