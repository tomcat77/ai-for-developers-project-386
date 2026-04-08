import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatCardModule, MatIconModule]
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToBooking(): void {
    this.router.navigate(['/book']);
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin/calendar']);
  }
}