import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UserData } from '../user-data.model';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  user: UserData | null = null; // Use the UserData model for type safety
  ads: any[] = []; // Will later align with the Ad model
  loadingAds = true;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserAds();
  }

  /**
   * Fetch the logged-in user's profile.
   */
  loadUserProfile(): void {
    this.userService.getLoggedUserProfile().subscribe({
      next: (data: UserData) => (this.user = data),
      error: (err) => {
        this.error = 'Failed to load user profile.';
        console.error(err);
      },
    });
  }

  /**
   * Fetch the ads for the logged-in user.
   * Ads will remain empty for now as `ads` in the UserData model is `null`.
   */
  loadUserAds(): void {
    this.userService.getLoggedUserAds().subscribe({
      next: (data: any[]) => {
        this.ads = data; // For now, use the fetched ads as a separate array
        this.loadingAds = false;
      },
      error: (err) => {
        this.error = 'Failed to load user ads.';
        console.error(err);
        this.loadingAds = false;
      },
    });
  }

  createAd(): void {
    console.log('Redirect to create ad form.');
  }

  editAd(adId: string): void {
    console.log(`Edit ad: ${adId}`);
  }

  deleteAd(adId: string): void {
    console.log(`Delete ad: ${adId}`);
  }

  editProfile(): void {
    console.log('Edit profile clicked');
  }
}
