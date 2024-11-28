import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UserData } from '../user-data.model';
import { Router } from '@angular/router';
import { UserAdsComponent } from '../../ads/user-ads/user-ads.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UserAdsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  user: UserData | null = null; // Use the UserData model for type safety
  ads: any[] = []; // Will later align with the Ad model
  error: string | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
 
  }

  /**
   * Fetch the logged-in user's profile.
   */
  loadUserProfile(): void {
    this.userService.getLoggedUserProfile().subscribe({
      next: (data: UserData) => {
        this.user = data; // Set the user data
        this.userService.setUser(data); // Update BehaviorSubject with fetched data
      },
      error: (err) => {
        this.error = 'Failed to load user profile.';
        console.error(err);
      },
    });
  }

  editProfile(): void {
    console.log('Edit profile clicked');
    this.router.navigate(['/edit-profile']);
  }
}
