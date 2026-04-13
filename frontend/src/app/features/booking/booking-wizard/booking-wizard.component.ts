import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookingApiService } from '../../../core/services/booking-api.service';
import { EventType, DaySlot, Booking } from '../../../core/models';
import { BookingSlotStepComponent } from '../booking-slot-step.component';
import { EventTypeSummaryComponent } from './event-type-summary/event-type-summary.component';
import { GuestInfoStepComponent } from '../guest-info-step/guest-info-step.component';

@Component({
  selector: 'app-booking-wizard',
  templateUrl: './booking-wizard.component.html',
  styleUrls: ['./booking-wizard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSnackBarModule,
    BookingSlotStepComponent,
    EventTypeSummaryComponent,
    GuestInfoStepComponent
  ]
})
export class BookingWizardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingApi = inject(BookingApiService);
  private snackBar = inject(MatSnackBar);

  step = signal<'select' | 'confirm'>('select');
  eventType: EventType | null = null;
  selectedDate: Date | null = null;
  selectedSlot = signal<DaySlot | null>(null);
  loading = signal(true);
  successBooking: Booking | null = null;

  canProceed = computed(() => this.selectedSlot() !== null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/book']);
      return;
    }

    this.bookingApi.getEventType(id).subscribe({
      next: (eventType) => {
        this.eventType = eventType;
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/book']);
      }
    });
  }

  onDateSelect(date: Date): void {
    this.selectedDate = date;
    this.selectedSlot.set(null);
  }

  onSlotSelect(slot: DaySlot): void {
    this.selectedSlot.set(slot);
  }

  proceedToConfirm(): void {
    if (!this.canProceed()) return;
    this.step.set('confirm');
  }

  goBack(): void {
    this.step.set('select');
  }

  onBooked(booking: Booking): void {
    this.successBooking = booking;
    this.snackBar.open('Бронирование успешно создано!', 'Закрыть', {
      duration: 5000
    });
  }

  goToCatalog(): void {
    this.router.navigate(['/book']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}