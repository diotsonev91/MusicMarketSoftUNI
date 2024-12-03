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
  error: string | null = null;
  publicUserId: string | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Determine if this is the current user's profile or a public profile
    const routeSegment = this.route.snapshot.url[0]?.path;
    const userId = this.route.snapshot.paramMap.get('userId');

    if (routeSegment === 'profile') {
      this.loadCurrentUserProfile();
    } else if (routeSegment === 'user' && userId) {
      this.loadPublicProfile(userId);
    } else {
      this.error = 'Invalid route or missing userId.';
    }
  }

  private loadCurrentUserProfile(): void {
    // Load the current user's profile
    this.userService.setCurrentUserInUserStore();
    this.userService.getCurrentUser$().subscribe(
      (user) => {
        this.user = user;
        this.isCurrentUser = true; // Indicates it's the logged-in user's profile
      },
      (error) => {
        this.error = 'Failed to load profile.';
        console.error(error);
      }
    );
  }

  private loadPublicProfile(userId: string): void {
    // Load a public profile by user ID
    this.userService.getUserProfile(userId).subscribe(
      (user) => {
        this.user = user;
        console.log("userId inside the loadPublic profile",this.user._id)
        this.isCurrentUser = false; // Indicates it's a public profile
        this.publicUserId = this.user._id;
      },
      (error) => {
        this.error = 'Failed to load profile.';
        console.error(error);
      }
    );
  }

  editProfile(): void {
    // Navigate to the profile editing page for the current user
    if (this.isCurrentUser) {
      this.router.navigate(['/edit-profile']);
    }
  }
}
