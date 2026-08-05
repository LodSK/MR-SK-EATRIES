export interface OpeningHoursSlot {
  days: string;
  time: string;
}

export interface DeliverySettings {
  pickupFee: number;
  standardFee: number;
  expressFee: number;
}

export interface RestaurantSettings {
  restaurantName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  openingHours: OpeningHoursSlot[];
  isOnlineOrderingEnabled: boolean;
  isReservationsEnabled: boolean;
  delivery: DeliverySettings;
  taxRate: number;
  serviceChargeRate: number;
  currency: string;
}
