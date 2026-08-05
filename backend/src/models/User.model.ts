import { Schema, model, type Document, type Types } from "mongoose";
import { ROLES, type Role } from "@/config/constants";

export interface Address {
  _id?: Types.ObjectId;
  label: string;
  street: string;
  city: string;
  notes?: string;
  isDefault: boolean;
}

export interface CartLine {
  menuItem: Types.ObjectId;
  quantity: number;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  birthday?: Date;
  bio?: string;
  addresses: Address[];
  cart: CartLine[];

  emailVerificationTokenHash?: string;
  emailVerificationExpires?: Date;
  passwordResetTokenHash?: string;
  passwordResetExpires?: Date;

  /** Bumped on password change/logout-all to invalidate previously issued refresh tokens. */
  tokenVersion: number;

  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<Address>(
  {
    label: { type: String, default: "Home" },
    street: { type: String, required: true },
    city: { type: String, required: true },
    notes: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String, trim: true },
    role: { type: String, enum: ROLES, default: "customer" },
    avatarUrl: String,
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    birthday: Date,
    bio: { type: String, maxlength: 280 },
    addresses: [addressSchema],
    cart: [
      {
        menuItem: { type: Schema.Types.ObjectId, ref: "MenuItem" },
        quantity: { type: Number, min: 1 },
        _id: false,
      },
    ],

    emailVerificationTokenHash: { type: String, select: false },
    emailVerificationExpires: Date,
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpires: Date,

    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

export const User = model<IUser>("User", userSchema);
