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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, format, startOfWeek, endOfWeek, eachWeekOfInterval, addDays, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { EventType } from '../../../core/models';
import { Booking } from '../../../core/models';

type CalendarView = 'day' | 'week' | 'month';

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
    MatSnackBarModule,
    MatButtonToggleModule
  ]
})
export class AdminCalendarComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private snackBar = inject(MatSnackBar);

  viewDate: Date = new Date();
  viewMode: CalendarView = 'month';
  weeks: CalendarWeek[] = [];
  weekDays: CalendarDay[] = [];
  eventTypes: EventType[] = [];
  bookings: Booking[] = [];
  selectedBooking: Booking | null = null;
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

  previousDay(): void {
    this.viewDate = subDays(this.viewDate, 1);
    this.generateCalendar();
  }

  nextDay(): void {
    this.viewDate = addDays(this.viewDate, 1);
    this.generateCalendar();
  }

  previousWeek(): void {
    this.viewDate = subDays(this.viewDate, 7);
    this.generateCalendar();
  }

  nextWeek(): void {
    this.viewDate = addDays(this.viewDate, 7);
    this.generateCalendar();
  }

  onViewModeChange(): void {
    this.generateCalendar();
  }

  getMonthYear(): string {
    if (this.viewMode === 'day') {
      return format(this.viewDate, 'd MMMM yyyy', { locale: this.locale });
    }
    if (this.viewMode === 'week') {
      const weekStart = startOfWeek(this.viewDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(this.viewDate, { weekStartsOn: 1 });
      return `${format(weekStart, 'd MMM', { locale: this.locale })} - ${format(weekEnd, 'd MMM yyyy', { locale: this.locale })}`;
    }
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
    if (this.viewMode === 'day') {
      this.weekDays = [{
        date: this.viewDate,
        isCurrentMonth: true,
        isToday: isSameDay(this.viewDate, new Date()),
        bookings: this.getBookingsForDay(this.viewDate)
      }];
    } else if (this.viewMode === 'week') {
      const weekStart = startOfWeek(this.viewDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(this.viewDate, { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
      this.weekDays = days.map(day => ({
        date: day,
        isCurrentMonth: isSameMonth(day, this.viewDate),
        isToday: isSameDay(day, new Date()),
        bookings: this.getBookingsForDay(day)
      }));
    } else {
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
