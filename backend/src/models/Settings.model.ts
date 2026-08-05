import { Schema, model, type Document } from "mongoose";
import { DELIVERY_FEES, TAX_RATE, SERVICE_CHARGE_RATE } from "@/config/constants";

export interface IOpeningHoursSlot {
  days: string;
  time: string;
}

export interface IDeliverySettings {
  pickupFee: number;
  standardFee: number;
  expressFee: number;
}

export interface ISettings extends Document {
  restaurantName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  openingHours: IOpeningHoursSlot[];
  isOnlineOrderingEnabled: boolean;
  isReservationsEnabled: boolean;
  delivery: IDeliverySettings;
  taxRate: number;
  serviceChargeRate: number;
  currency: string;
  updatedAt: Date;
}

const openingHoursSlotSchema = new Schema<IOpeningHoursSlot>(
  { days: { type: String, required: true }, time: { type: String, required: true } },
  { _id: false }
);

const deliverySettingsSchema = new Schema<IDeliverySettings>(
  {
    pickupFee: { type: Number, default: DELIVERY_FEES.pickup },
    standardFee: { type: Number, default: DELIVERY_FEES.standard },
    expressFee: { type: Number, default: DELIVERY_FEES.express },
  },
  { _id: false }
);

const settingsSchema = new Schema<ISettings>(
  {
    restaurantName: { type: String, default: "MR_SK EATRIES" },
    tagline: { type: String, default: "Taste Beyond Expectations" },
    contactEmail: { type: String, default: "hello@mrsk-eatries.com" },
    contactPhone: { type: String, default: "+233 20 000 0000" },
    address: { type: String, default: "12 Independence Avenue, Accra, Ghana" },
    openingHours: { type: [openingHoursSlotSchema], default: [] },
    isOnlineOrderingEnabled: { type: Boolean, default: true },
    isReservationsEnabled: { type: Boolean, default: true },
    delivery: { type: deliverySettingsSchema, default: () => ({}) },
    taxRate: { type: Number, default: TAX_RATE },
    serviceChargeRate: { type: Number, default: SERVICE_CHARGE_RATE },
    currency: { type: String, default: "GHS" },
  },
  { timestamps: true }
);

// Single-document collection — the app always reads/writes the one settings doc.
export const Settings = model<ISettings>("Settings", settingsSchema);
