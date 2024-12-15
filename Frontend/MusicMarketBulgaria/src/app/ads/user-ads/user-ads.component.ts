import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AdService } from '../ad.service'; 
import { AdData } from '../ad-data.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { AdStateService } from './ad-state.service';


@Component({
  selector: 'app-user-ads',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user-ads.component.html',
  styleUrls: ['./user-ads.component.css'],
})
export class UserAdsComponent implements OnInit {
  ads: AdData[] = [];
  loadingAds = true;
  error: string | null = null;
  @Input() userId: string | null = null; // Accept user ID as input
  adsOwner: String = "Моите обяви"
  ownedByLoggedUser: boolean = false;

  constructor(private adService: AdService,private adStateService:AdStateService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
      // Extract userId from the route manually
      const fullUrl = this.router.url; // Get the current URL
      this.userId = this.extractUserIdFromUrl(fullUrl);
      console.log('Extracted User ID:', this.userId);
  
      if (this.userId) {
        this.loadUserAds();
      } else {
        this.error = 'Invalid route: User ID is missing.';
      }
  }
  
  private extractUserIdFromUrl(url: string): string | null {
    const parts = url.split('/'); // Split the URL by slashes
    const userIdIndex = parts.indexOf('user') + 1 || parts.indexOf('profile') + 1 ; // Get the index after "user"
    return parts[userIdIndex] || null; // Return the ID or null if not found
  }
  
  loadUserAds(): void {
    console.log('User ID inside user-ads:', this.userId);
  
    if (this.userId && this.userId !== this.adService.getLoggedUserId()) {
        // Load ads for the provided user ID
      console.log('Loading ads for user ID:', this.userId);
      this.ownedByLoggedUser = false;
      this.adsOwner = 'Обяви на потребителя'; // "Ads of the user" in Bulgarian
      this.adService.getUserAds(this.userId).subscribe({
        next: (data: AdData[]) => {
          this.ads = data;
          this.loadingAds = false;
        },
        error: (err) => {
          this.error = 'Failed to load user ads.';
          console.error(err);
          this.loadingAds = false;
        },
      });
    } else {

      this.adsOwner = 'Моите обяви'; 
      this.ownedByLoggedUser = true;
       // Check if ads are cached for the logged-in user
      this.adStateService.ads$.subscribe((cachedAds) => {
        if (cachedAds) {
           // Use cached ads
          console.log('Using cached ads for the logged-in user.');
          this.ads = cachedAds;
          this.loadingAds = false;
        } else {
            // Fetch ads from the backend
            console.log('Loading ads for the logged-in user from the backend.');
            this.adService.getLoggedUserAds().subscribe({
              next: (data: AdData[]) => {
                this.ads = data;
                this.adStateService.setAds(data); // Cache the fetched ads
                this.loadingAds = false;
              },
              error: (err) => {
                this.error = 'Failed to load user ads.';
                console.error(err);
                this.loadingAds = false;
              },
          });
        }
      });
    }
  }
  
  createAd(): void {
    this.router.navigate(['/create-ad']);
  }

  editAd(adId: string): void {
    const selectedAd = this.ads.find((ad) => ad._id === adId); // Find the ad by ID
    if (selectedAd) {
      console.log({ adId, selectedAd });
      this.router.navigate(['/edit-ad', adId], { state: { adData: selectedAd } }); // Pass the ad data in state
    } else {
      console.error('Ad not found');
    }
  }

  deleteAd(adId: string): void {
    this.adService.deleteAd(adId).subscribe({
      next: () => {
        console.log(`Ad with ID ${adId} deleted.`);
        this.ads = this.ads.filter((ad) => ad._id !== adId);
      },
      error: (err) => {
        console.error('Failed to delete ad:', err);
        this.error = 'Failed to delete the ad.';
      },
    });
  }
}
