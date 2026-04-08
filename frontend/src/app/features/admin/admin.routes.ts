import { Routes } from '@angular/router';
import { AdminCalendarComponent } from './admin-calendar/admin-calendar.component';
import { EventTypesManagerComponent } from './event-types-manager/event-types-manager.component';

export const adminRoutes: Routes = [
  { path: 'calendar', component: AdminCalendarComponent },
  { path: 'event-types', component: EventTypesManagerComponent },
  { path: '', redirectTo: 'calendar', pathMatch: 'full' }
];