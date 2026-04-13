import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { format } from 'date-fns';
import { CalendarWidgetComponent } from './booking-wizard/calendar-slot-step/calendar-widget/calendar-widget.component';
import { SlotPickerComponent } from './booking-wizard/calendar-slot-step/slot-picker/slot-picker.component';
import { BookingApiService } from '../../core/services/booking-api.service';
import { EventType, DaySlot } from '../../core/models';

@Component({
  selector: 'app-booking-slot-step',
  templateUrl: './booking-slot-step.component.html',
  styleUrls: ['./booking-slot-step.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    CalendarWidgetComponent,
    SlotPickerComponent
  ]
})
export class BookingSlotStepComponent implements OnChanges {
  @Input() eventType: EventType | null = null;
  @Input() selectedDate: Date | null = null;
  @Input() selectedSlot: DaySlot | null = null;

  @Output() dateSelect = new EventEmitter<Date>();
  @Output() slotSelect = new EventEmitter<DaySlot>();

  private bookingApi = inject(BookingApiService);
  
  slots: DaySlot[] = [];
  loading = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate'] && this.selectedDate && this.eventType) {
      this.loadSlots();
    }

    if (!this.selectedDate) {
      this.slots = [];
    }
  }

  onDateSelect(date: Date): void {
    this.dateSelect.emit(date);
  }

  onSlotSelect(slot: DaySlot): void {
    this.slotSelect.emit(slot);
  }

  private loadSlots(): void {
    if (!this.selectedDate || !this.eventType) {
      return;
    }

    this.loading.set(true);
    const dateStr = format(this.selectedDate, 'yyyy-MM-dd');

    this.bookingApi.getDaySlots(this.eventType.id, dateStr).subscribe({
      next: (slots) => {
        this.slots = slots;
        this.loading.set(false);
      },
      error: () => {
        this.slots = [];
        this.loading.set(false);
      }
    });
  }
}