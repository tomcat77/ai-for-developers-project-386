import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EventType } from '../../../../core/models';

@Component({
  selector: 'app-event-type-summary',
  templateUrl: './event-type-summary.component.html',
  styleUrls: ['./event-type-summary.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule]
})
export class EventTypeSummaryComponent {
  @Input() eventType: EventType | null = null;
  @Input() selectedDate: Date | null = null;
  @Input() selectedSlot: { startTime: string; endTime: string } | null = null;
}