import { Routes } from '@angular/router';
import { BookingCatalogComponent } from './booking-catalog/booking-catalog.component';
import { BookingWizardComponent } from './booking-wizard/booking-wizard.component';

export const bookingRoutes: Routes = [
  { path: '', component: BookingCatalogComponent },
  { path: ':id', component: BookingWizardComponent }
];