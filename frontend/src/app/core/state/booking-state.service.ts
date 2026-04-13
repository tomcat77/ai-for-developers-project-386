import { Injectable, signal, computed } from '@angular/core';
import { EventType } from '../models/event-type.model';
import { DaySlot } from '../models/slot.model';
import { GuestContactForm } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingStateService {
  readonly selectedEventType = signal<EventType | null>(null);
  readonly selectedDate = signal<Date | null>(null);
  readonly selectedSlot = signal<DaySlot | null>(null);
  readonly guestInfo = signal<GuestContactForm | null>(null);

  readonly canProceedToConfirm = computed(() => this.selectedSlot() !== null);

  readonly isComplete = computed(() => {
    return this.selectedEventType() !== null &&
           this.selectedDate() !== null &&
           this.selectedSlot() !== null;
  });

  selectEventType(eventType: EventType): void {
    this.selectedEventType.set(eventType);
    this.selectedDate.set(null);
    this.selectedSlot.set(null);
    this.guestInfo.set(null);
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    this.selectedSlot.set(null);
  }

  selectSlot(slot: DaySlot): void {
    this.selectedSlot.set(slot);
  }

  setGuestInfo(info: GuestContactForm): void {
    this.guestInfo.set(info);
  }

  reset(): void {
    this.selectedEventType.set(null);
    this.selectedDate.set(null);
    this.selectedSlot.set(null);
    this.guestInfo.set(null);
  }
}