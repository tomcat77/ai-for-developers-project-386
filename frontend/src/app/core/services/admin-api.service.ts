import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventType, CreateEventTypeRequest, UpdateEventTypeRequest } from '../models/event-type.model';
import { Booking } from '../models/booking.model';
import { ConflictError } from '../models/error.model';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getEventTypes(): Observable<EventType[]> {
    return this.http.get<EventType[]>(`${this.baseUrl}/event-types`);
  }

  createEventType(request: CreateEventTypeRequest): Observable<EventType> {
    return this.http.post<EventType>(`${this.baseUrl}/event-types`, request);
  }

  updateEventType(eventType: EventType): Observable<EventType | ConflictError> {
    return this.http.put<EventType | ConflictError>(`${this.baseUrl}/event-types`, eventType);
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings`);
  }
}