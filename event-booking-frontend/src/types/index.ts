export interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  venue: string;
  location: string;
  price: string;
  total_seats: number;
  available_seats?: number;
  image?: string;
  status: string;
  show_map?: boolean;
  enable_ticketing?: boolean;
  enable_rsvp?: boolean;
  ticket_types?: TicketType[];
  rsvp_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TicketType {
  id?: number;
  event_id?: number;
  name: string;
  price: number;
  description?: string;
  available_quantity: number;
  max_per_order?: number;
}

export interface RSVP {
  id?: number;
  event_id: number;
  name: string;
  email: string;
  phone: string;
  guest_count: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
}

export interface EventFormData {
  id?: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  price: string;
  total_seats: number;
  status: 'draft' | 'published' | 'cancelled';
  image?: string;
  // New fields
  latitude?: number;
  longitude?: number;
  show_map?: boolean;
  enable_ticketing?: boolean;
  enable_rsvp?: boolean;
  ticket_types?: TicketType[];
  rsvp_enabled?: boolean;
}

export interface Booking {
  id: number;
  event: {
    id: number;
    title: string;
    date: string;
    venue: string;
  };
  ticket_count: number;
  total_amount: string;
  status: string;
  payment_status: string;
  booking_reference: string;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: string;
}
