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
import { AdminApiService } from '../../../core/services/admin-api.service';
import { EventType } from '../../../core/models';
import { EventTypeDialogComponent } from './event-type-dialog/event-type-dialog.component';

@Component({
  selector: 'app-event-types-manager',
  templateUrl: './event-types-manager.component.html',
  styleUrls: ['./event-types-manager.component.scss'],
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
export class EventTypesManagerComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  eventTypes: EventType[] = [];
  loading = signal(true);

  ngOnInit(): void {
    this.loadEventTypes();
  }

  loadEventTypes(): void {
    this.loading.set(true);
    this.adminApi.getEventTypes().subscribe({
      next: (eventTypes) => {
        this.eventTypes = eventTypes;
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Не удалось загрузить типы событий', 'Закрыть');
        this.loading.set(false);
      }
    });
  }

  createEventType(): void {
    const dialogRef = this.dialog.open(EventTypeDialogComponent, {
      width: '400px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminApi.createEventType(result).subscribe({
          next: () => {
            this.snackBar.open('Тип события создан', 'Закрыть');
            this.loadEventTypes();
          },
          error: () => {
            this.snackBar.open('Не удалось создать тип события', 'Закрыть');
          }
        });
      }
    });
  }

  editEventType(eventType: EventType): void {
    const dialogRef = this.dialog.open(EventTypeDialogComponent, {
      width: '400px',
      data: { mode: 'edit', eventType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminApi.updateEventType(result).subscribe({
          next: () => {
            this.snackBar.open('Тип события обновлён', 'Закрыть');
            this.loadEventTypes();
          },
          error: (err) => {
            if (err.status === 409) {
              this.snackBar.open('Невозможно изменить длительность: есть активные бронирования', 'Закрыть');
            } else {
              this.snackBar.open('Не удалось обновить тип события', 'Закрыть');
            }
          }
        });
      }
    });
  }
}