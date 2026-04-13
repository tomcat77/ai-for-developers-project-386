import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DaySlot } from '../../../../../core/models';

@Component({
  selector: 'app-slot-picker',
  templateUrl: './slot-picker.component.html',
  styleUrls: ['./slot-picker.component.scss'],
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatProgressSpinnerModule]
})
export class SlotPickerComponent {
  @Input() slots: DaySlot[] = [];
  @Input() loading = false;
  @Input() selectedSlot: DaySlot | null = null;
  @Output() slotSelect = new EventEmitter<DaySlot>();

  selectSlot(slot: DaySlot): void {
    if (!slot.isAvailable) return;
    this.slotSelect.emit(slot);
  }

  isSelected(slot: DaySlot): boolean {
    return this.selectedSlot?.startTime === slot.startTime;
  }

  isDisabled(slot: DaySlot): boolean {
    return !slot.isAvailable;
  }

  formatTime(slot: DaySlot): string {
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);
    const startStr = start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const endStr = end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return `${startStr} — ${endStr}`;
  }
}