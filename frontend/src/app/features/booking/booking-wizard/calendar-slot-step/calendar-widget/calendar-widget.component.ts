import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { isSameDay, isSameMonth, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, format, startOfWeek, endOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

@Component({
  selector: 'app-calendar-widget',
  templateUrl: './calendar-widget.component.html',
  styleUrls: ['./calendar-widget.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class CalendarWidgetComponent implements OnChanges {
  @Input() selectedDate: Date | null = null;
  @Output() dateSelect = new EventEmitter<Date>();

  viewDate: Date = new Date();
  locale = ru;

  isSameDay = isSameDay;
  isSameMonth = isSameMonth;

  days: Date[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate'] && this.selectedDate) {
      this.viewDate = this.selectedDate;
    }
    this.generateDays();
  }

  generateDays(): void {
    const monthStart = startOfMonth(this.viewDate);
    const monthEnd = endOfMonth(this.viewDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    this.days = eachDayOfInterval({ start: calStart, end: calEnd });
  }

  previousMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
    this.generateDays();
  }

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
    this.generateDays();
  }

  selectDate(day: Date): void {
    this.dateSelect.emit(day);
  }

  isSelected(day: Date): boolean {
    return this.selectedDate !== null && isSameDay(day, this.selectedDate);
  }

  isToday(day: Date): boolean {
    return isSameDay(day, new Date());
  }

  isCurrentMonth(day: Date): boolean {
    return isSameMonth(day, this.viewDate);
  }

  getMonthYear(): string {
    return format(this.viewDate, 'MMMM yyyy', { locale: this.locale });
  }

  getDayNumber(day: Date): string {
    return format(day, 'd');
  }
}