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
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: UserData | null = null; // Profile data to display
  isCurrentUser = false; // Determines if the profile is for the logged-in user
  error: string | null = null; // Error message display
  publicUserId: string | null = null; // ID of the public profile being viewed

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // React to route changes dynamically
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('userId');
      const currentUserId = this.userService.getCurrentUserId();

      if (!userId) {
        // If no userId, load the current user's profile
        this.loadCurrentUserProfile();
      } else if (userId === currentUserId) {
        // If userId matches the logged-in user, load the current user's profile
        this.loadCurrentUserProfile();
      } else {
        // Otherwise, load the public user's profile
        this.loadPublicProfile(userId);
      }
    });
  }

  private loadCurrentUserProfile(): void {
    // Load current user's profile data
    
    this.userService.getCurrentUser$().subscribe(
      (user) => {
        if (user) {
          this.user = user;
          this.isCurrentUser = true;
          this.publicUserId = user._id; // Set publicUserId for consistency
        } else {
          this.error = 'Current user profile could not be loaded.';
        }
      },
      (error) => {
        this.error = 'Failed to load current user profile.';
        console.error(error);
      }
    );
  }

  private loadPublicProfile(userId: string): void {
    // Load a public user's profile data by ID
    this.userService.getUserProfile(userId).subscribe(
      (user) => {
        if (user) {
          this.user = user;
          this.publicUserId = user._id;
          this.isCurrentUser = false;
        } else {
          this.error = 'Public user profile not found.';
        }
      },
      (error) => {
        this.error = 'Failed to load public user profile.';
        console.error(error);
      }
    );
  }

  editProfile(): void {
    // Navigate to the profile editing page for the logged-in user
    if (this.isCurrentUser) {
      this.router.navigate(['/edit-profile']);
    }
  }
}
