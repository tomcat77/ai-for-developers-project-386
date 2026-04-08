import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'book', loadChildren: () => import('./features/booking/booking.routes').then(m => m.bookingRoutes) },
  { path: 'admin', loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes) },
  { path: '**', redirectTo: '' }
];