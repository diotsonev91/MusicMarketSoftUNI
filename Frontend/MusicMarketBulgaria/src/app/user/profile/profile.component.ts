import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UserData } from '../user-data.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAdsComponent } from '../../ads/user-ads/user-ads.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UserAdsComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'], // Correct property name: styleUrls
})
export class ProfileComponent implements OnInit {
  user: UserData | null = null; // Profile data to display
  isCurrentUser = false; // Determines if the profile is for the logged-in user
  error: string | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get userId from route parameters (if provided)
    const userId = this.route.snapshot.paramMap.get('userId');

    if (userId) {
      // If userId exists, fetch the profile for that user
      this.loadProfile(userId);
    } else {
      // Otherwise, display the logged-in user's profile
      this.user = this.userService.getCurrentUserData();
      this.isCurrentUser = true;

      // Ensure user is loaded if not already
      if (!this.user) {
        this.userService.loadCurrentUser();
        this.userService.getCurrentUser$().subscribe(
          (user) => {
            this.user = user;
          },
          (error) => {
            this.error = 'Failed to load profile.';
          }
        );
      }
    }
  }


  private loadProfile(userId: string): void {
    this.userService.getUserProfile(userId).subscribe(
      (user) => {
        this.user = user;
        this.isCurrentUser = this.userService.getCurrentUserId() === userId;
      },
      (error) => {
        this.error = 'Failed to load profile.';
        console.error(error);
      }
    );
  }

  editProfile(): void {
    if (this.isCurrentUser) {
      this.router.navigate(['/edit-profile']);
    }
  }
}
