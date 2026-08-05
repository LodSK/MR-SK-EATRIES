import { Schema, model, type Document } from "mongoose";

export type JobApplicationStatus = "new" | "reviewed" | "contacted" | "rejected";

export interface IJobApplication extends Document {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  message: string;
  status: JobApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true, maxlength: 150 },
    message: { type: String, required: true, maxlength: 2000 },
    status: { type: String, enum: ["new", "reviewed", "contacted", "rejected"], default: "new" },
  },
  { timestamps: true }
);

export const JobApplication = model<IJobApplication>("JobApplication", jobApplicationSchema);
