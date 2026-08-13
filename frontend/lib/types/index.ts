export interface User {
  id: number;
  email: string;
  username: string;
  is_host: boolean;
  host_since?: string;
  avatar_url?: string;
  bio?: string;
}

export interface Listing {
  id: number;
  host_id: number;
  title: string;
  description: string;
  property_type: string;
  room_type: string;
  location: string;
  latitude?: number;
  longitude?: number;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  images: string[];
  rating: number;
  review_count: number;
  is_active: boolean;
  amenities: string[];
  created_at: string;
  updated_at?: string;
}

export interface Booking {
  id: number;
  listing_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  guest_count: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at?: string;
  listing_title?: string;
  listing_image?: string;
  host_name?: string;
}
