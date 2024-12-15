import { Component, OnInit } from '@angular/core';
import { AdService } from '../ad.service';
import { AdData } from '../ad-data.model';
import { AdDetailsCardSmComponent } from '../ad-details/ad-details-card-sm/ad-details-card-sm.component';

@Component({
  selector: 'app-ads-view-home',
  standalone: true,
  imports: [AdDetailsCardSmComponent],
  templateUrl: './ads-view-home.component.html',
  styleUrls: ['./ads-view-home.component.css'], // Fixed `styleUrls` property
})
export class AdsViewHomeComponent implements OnInit {
  topRatedAds: AdData[] = []; // Store the top-rated ads
  loading: boolean = true; // Loading state
  error: string | null = null; // Error state

  constructor(private adService: AdService) {}

  ngOnInit(): void {
    this.fetchTopRatedAds(); // Fetch top-rated ads on initialization
  }

  /**
   * Fetch the top-rated ads from the backend.
   */
  private fetchTopRatedAds(): void {
    console.log("called fetchTopRatedAds")
    this.adService.getTopRatedAds().subscribe({
      next: (ads) => {
        this.topRatedAds = ads;
        this.loading = false;
        console.log('Fetched top-rated ads:', ads);
      },
      error: (err) => {
        this.error = 'Failed to load top-rated ads.';
        console.error('Error fetching top-rated ads:', err);
        this.loading = false;
      },
    });
  }
}
