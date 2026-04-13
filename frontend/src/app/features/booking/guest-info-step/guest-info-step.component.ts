import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EventType, DaySlot, GuestContactForm, Booking } from '../../../core/models';
import { BookingApiService } from '../../../core/services/booking-api.service';
import { TimezoneUtils } from '../../../core/utils/timezone.utils';

@Component({
  selector: 'app-guest-info-step',
  templateUrl: './guest-info-step.component.html',
  styleUrls: ['./guest-info-step.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class GuestInfoStepComponent implements OnInit {
  @Input() eventType: EventType | null = null;
  @Input() selectedDate: Date | null = null;
  @Input() selectedSlot: DaySlot | null = null;
  
  @Output() back = new EventEmitter<void>();
  @Output() booked = new EventEmitter<Booking>();

  private fb = inject(FormBuilder);
  private bookingApi = inject(BookingApiService);

  form: FormGroup = this.fb.group({
    includeContact: [false],
    name: ['', Validators.required],
    email: ['', Validators.email],
    phone: [''],
    notes: ['', Validators.maxLength(500)]
  });

  submitting = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.form.get('includeContact')?.valueChanges.subscribe(include => {
      if (include) {
        this.form.get('name')?.addValidators(Validators.required);
        this.form.get('email')?.addValidators(Validators.email);
        this.form.get('phone')?.addValidators(Validators.required);
      } else {
        this.form.get('name')?.removeValidators(Validators.required);
        this.form.get('email')?.removeValidators(Validators.email);
        this.form.get('phone')?.removeValidators(Validators.required);
      }
      this.form.get('name')?.updateValueAndValidity();
      this.form.get('email')?.updateValueAndValidity();
      this.form.get('phone')?.updateValueAndValidity();
    });
  }

  skip(): void {
    this.submitBooking({});
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }

    const formValue = this.form.value;
    const contactParts: string[] = [];
    
    if (formValue.email) contactParts.push(`Email: ${formValue.email}`);
    if (formValue.phone) contactParts.push(`Phone: ${formValue.phone}`);
    if (formValue.notes) contactParts.push(`Notes: ${formValue.notes}`);
    
    const guestContact = contactParts.length > 0 ? contactParts.join(', ') : undefined;

    this.submitBooking({
      guestName: formValue.name,
      guestContact
    });
  }

  goBack(): void {
    this.back.emit();
  }

  formatDate(): string {
    if (!this.selectedDate) return '';
    return TimezoneUtils.formatDateOnly(this.selectedDate);
  }

  formatTime(): string {
    if (!this.selectedSlot) return '';
    return `${TimezoneUtils.formatTimeOnly(this.selectedSlot.startTime)} — ${TimezoneUtils.formatTimeOnly(this.selectedSlot.endTime)}`;
  }

  private submitBooking(guestInfo: { guestName?: string; guestContact?: string }): void {
    if (!this.selectedSlot || !this.eventType) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.bookingApi.createBooking({
      eventTypeId: this.eventType.id,
      startTime: this.selectedSlot.startTime,
      ...guestInfo
    }).subscribe({
      next: (booking) => {
        this.booked.emit(booking);
        this.submitting.set(false);
      },
      error: (err) => {
        if (err.status === 409) {
          this.error.set('Это время уже занято. Выберите другой слот.');
        } else {
          this.error.set('Не удалось создать бронирование. Попробуйте позже.');
        }
        this.submitting.set(false);
      }
    });
  }
}