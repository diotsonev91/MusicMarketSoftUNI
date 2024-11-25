import { Component, OnInit } from '@angular/core';
import { AdService } from '../ad.service'; 
import { AdData } from '../ad-data.model';
import { Router, RouterModule } from '@angular/router'; 


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

  constructor(private adService: AdService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserAds();
  }

  loadUserAds(): void {
    this.adService.getLoggedUserAds().subscribe({
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
