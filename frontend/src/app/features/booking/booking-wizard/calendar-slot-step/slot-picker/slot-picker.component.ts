import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AvailableSlot } from '../../../../../core/models';

@Component({
  selector: 'app-slot-picker',
  templateUrl: './slot-picker.component.html',
  styleUrls: ['./slot-picker.component.scss'],
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatProgressSpinnerModule]
})
export class SlotPickerComponent {
  @Input() slots: AvailableSlot[] = [];
  @Input() loading = false;
  @Input() selectedSlot: AvailableSlot | null = null;
  @Output() slotSelect = new EventEmitter<AvailableSlot>();

  selectSlot(slot: AvailableSlot): void {
    this.slotSelect.emit(slot);
  }

  isSelected(slot: AvailableSlot): boolean {
    return this.selectedSlot?.startTime === slot.startTime;
  }

  formatTime(slot: AvailableSlot): string {
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);
    const startStr = start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const endStr = end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return `${startStr} — ${endStr}`;
  }
}