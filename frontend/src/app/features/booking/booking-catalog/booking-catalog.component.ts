import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { BookingApiService } from '../../../core/services/booking-api.service';
import { EventType } from '../../../core/models';
import { CalendarOwner } from '../../../core/models';

@Component({
  selector: 'app-booking-catalog',
  templateUrl: './booking-catalog.component.html',
  styleUrls: ['./booking-catalog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class BookingCatalogComponent implements OnInit {
  private bookingApi = inject(BookingApiService);
  protected router = inject(Router);
  
  owner: CalendarOwner | null = null;
  eventTypes: EventType[] = [];
  loading = signal(true);
  error = '';

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    
    this.bookingApi.getOwner().subscribe({
      next: (owner) => this.owner = owner,
      error: () => {}
    });

    this.bookingApi.getEventTypes().subscribe({
      next: (eventTypes) => {
        this.eventTypes = eventTypes;
        this.loading.set(false);
      },
      error: () => {
        this.error = 'Не удалось загрузить типы событий';
        this.loading.set(false);
      }
    });
  }

  selectEventType(eventType: EventType): void {
    this.router.navigate(['/book', eventType.id]);
  }
}