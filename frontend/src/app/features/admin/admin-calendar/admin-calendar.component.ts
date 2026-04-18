import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, format, startOfWeek, endOfWeek, eachWeekOfInterval } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { EventType } from '../../../core/models';
import { Booking } from '../../../core/models';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: Booking[];
}

interface CalendarWeek {
  days: CalendarDay[];
}

@Component({
  selector: 'app-admin-calendar',
  templateUrl: './admin-calendar.component.html',
  styleUrls: ['./admin-calendar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class AdminCalendarComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private snackBar = inject(MatSnackBar);

  viewDate: Date = new Date();
  weeks: CalendarWeek[] = [];
  eventTypes: EventType[] = [];
  bookings: Booking[] = [];
  selectedBooking: Booking | null = null;
  /** Signal so the view updates under zoneless change detection after HTTP callbacks. */
  loading = signal(true);
  locale = ru;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    this.adminApi.getEventTypes().subscribe({
      next: (eventTypes) => this.eventTypes = eventTypes
    });

    this.adminApi.getBookings().subscribe({
      next: (bookings) => {
        try {
          this.bookings = bookings;
          this.generateCalendar();
        } finally {
          this.loading.set(false);
        }
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Не удалось загрузить бронирования', 'Закрыть');
      }
    });
  }

  previousMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
    this.generateCalendar();
  }

  getMonthYear(): string {
    return format(this.viewDate, 'MMMM yyyy', { locale: this.locale });
  }

  getEventTypeColor(eventTypeId: string): string {
    const eventType = this.eventTypes.find(et => et.id === eventTypeId);
    return eventType?.color || '#757575';
  }

  getEventTypeName(eventTypeId: string): string {
    const eventType = this.eventTypes.find(et => et.id === eventTypeId);
    return eventType?.name || '';
  }

  private generateCalendar(): void {
    const monthStart = startOfMonth(this.viewDate);
    const monthEnd = endOfMonth(this.viewDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const weekStarts = eachWeekOfInterval({ start: calStart, end: calEnd }, { weekStartsOn: 1 });

    this.weeks = weekStarts.map(weekStart => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

      return {
        days: days.map(day => ({
          date: day,
          isCurrentMonth: isSameMonth(day, this.viewDate),
          isToday: isSameDay(day, new Date()),
          bookings: this.getBookingsForDay(day)
        }))
      };
    });
  }

  private getBookingsForDay(date: Date): Booking[] {
    return this.bookings.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      return isSameDay(bookingDate, date);
    });
  }

  formatTime(booking: Booking): string {
    return format(new Date(booking.startTime), 'HH:mm');
  }

  selectBooking(booking: Booking, event: Event): void {
    event.stopPropagation();
    this.selectedBooking = booking;
  }

  closeDetails(): void {
    this.selectedBooking = null;
  }

  formatDateTime(booking: Booking): string {
    return format(new Date(booking.startTime), 'd MMMM yyyy, HH:mm', { locale: this.locale });
  }
}
