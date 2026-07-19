export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  /** Two-letter initials rendered inside the avatar circle — no photo assets required. */
  avatarInitials: string;
}
