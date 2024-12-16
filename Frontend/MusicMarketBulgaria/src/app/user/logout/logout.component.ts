import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'] // Corrected to 'styleUrls'
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.logout();
  }

  // Handle the logout action
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        
      },
      error: (err) => {
        // Handle any errors that occur during logout
        console.error('Logout failed', err);
      }
    });
  }
}
