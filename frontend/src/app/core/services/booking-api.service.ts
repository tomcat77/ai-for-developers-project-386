import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventType } from '../models/event-type.model';
import { Booking, CreateBookingRequest } from '../models/booking.model';
import { DaySlot } from '../models/slot.model';
import { CalendarOwner } from '../models/owner.model';
import { ConflictError } from '../models/error.model';

@Injectable({ providedIn: 'root' })
export class BookingApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getEventTypes(): Observable<EventType[]> {
    return this.http.get<EventType[]>(`${this.baseUrl}/event-types`);
  }

  getEventType(id: string): Observable<EventType> {
    return this.http.get<EventType>(`${this.baseUrl}/event-types/${id}`);
  }

  getDaySlots(eventTypeId: string, date: string): Observable<DaySlot[]> {
    return this.http.get<DaySlot[]>(`${this.baseUrl}/bookings/day-slots`, {
      params: { eventTypeId, date }
    });
  }

  createBooking(request: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/bookings`, request);
  }

  createBookingWithConflict(request: CreateBookingRequest): Observable<Booking | ConflictError> {
    return this.http.post<Booking | ConflictError>(`${this.baseUrl}/bookings`, request);
  }

  getOwner(): Observable<CalendarOwner> {
    return this.http.get<CalendarOwner>(`${this.baseUrl}/owner`);
  }
}