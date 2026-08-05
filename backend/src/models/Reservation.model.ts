import { Schema, model, type Document, type Types } from "mongoose";
import { RESERVATION_STATUSES, type ReservationStatus } from "@/config/constants";

export interface IReservation extends Document {
  _id: Types.ObjectId;
  reservationNumber: string;
  user?: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  partySize: number;
  date: Date;
  time: string;
  seatingPreference?: string;
  occasion?: string;
  specialRequests?: string;
  accessibilityNotes?: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>(
  {
    reservationNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    partySize: { type: Number, required: true, min: 1, max: 20 },
    date: { type: Date, required: true, index: true },
    time: { type: String, required: true },
    seatingPreference: String,
    occasion: String,
    specialRequests: String,
    accessibilityNotes: String,
    status: { type: String, enum: RESERVATION_STATUSES, default: "pending", index: true },
  },
  { timestamps: true }
);

reservationSchema.index({ date: 1, time: 1 });

export const Reservation = model<IReservation>("Reservation", reservationSchema);
