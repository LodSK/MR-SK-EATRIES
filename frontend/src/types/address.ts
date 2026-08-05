export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  notes?: string;
  isDefault: boolean;
}

export interface AddressPayload {
  label: string;
  street: string;
  city: string;
  notes?: string;
  isDefault?: boolean;
}
