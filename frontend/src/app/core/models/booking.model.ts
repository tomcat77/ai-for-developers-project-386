export interface Booking {
  id: string;
  eventTypeId: string;
  startTime: string;
  guestName?: string;
  guestContact?: string;
}

export interface CreateBookingRequest {
  eventTypeId: string;
  startTime: string;
  guestName?: string;
  guestContact?: string;
}

export interface GuestContactForm {
  email?: string;
  phone?: string;
  notes?: string;
}