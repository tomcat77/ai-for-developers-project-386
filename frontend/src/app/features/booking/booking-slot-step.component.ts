import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { format } from 'date-fns';
import { CalendarWidgetComponent } from './booking-wizard/calendar-slot-step/calendar-widget/calendar-widget.component';
import { SlotPickerComponent } from './booking-wizard/calendar-slot-step/slot-picker/slot-picker.component';
import { BookingApiService } from '../../core/services/booking-api.service';
import { EventType, AvailableSlot } from '../../core/models';

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
  @Input() selectedSlot: AvailableSlot | null = null;

  @Output() dateSelect = new EventEmitter<Date>();
  @Output() slotSelect = new EventEmitter<AvailableSlot>();

  private bookingApi = inject(BookingApiService);
  
  slots: AvailableSlot[] = [];
  loading = false;

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

  onSlotSelect(slot: AvailableSlot): void {
    this.slotSelect.emit(slot);
  }

  private loadSlots(): void {
    if (!this.selectedDate || !this.eventType) {
      return;
    }

    this.loading = true;
    const dateStr = format(this.selectedDate, 'yyyy-MM-dd');

    this.bookingApi.getAvailableSlots(this.eventType.id, dateStr).subscribe({
      next: (slots) => {
        this.slots = slots;
        this.loading = false;
      },
      error: () => {
        this.slots = [];
        this.loading = false;
      }
    });
  }
}