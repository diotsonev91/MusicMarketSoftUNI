import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdService } from '../ad.service';
import { AdData } from '../ad-data.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { AdDetailsCardComponent } from './ad-details-card/ad-details-card.component';
import { AdDetailsImagesComponent } from './ad-details-images/ad-details-images.component';
import { AdUserRelatedTopAdsComponent } from './ad-user-related-top-ads/ad-user-related-top-ads.component';

@Component({
  selector: 'app-ad-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ContactFormComponent, AdDetailsCardComponent, AdDetailsImagesComponent,AdUserRelatedTopAdsComponent],
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.css'],
})
export class AdDetailsComponent implements OnInit {
  ad: AdData | null = null;
  relatedAds: AdData[] = [];

  constructor(
    private route: ActivatedRoute,
    private adService: AdService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); // Get the 'id' parameter
      if (id) {
        this.fetchAdDetails(id);  // Load the details of the current ad
      }
    });
  }

// Use AdService to navigate
goToUser(userId: string): void {
  this.adService.goToUser(userId);
}

  fetchAdDetails(adId: string): void {
    this.adService.getAdById(adId).subscribe({
      next: (ad) => {
        this.ad = ad; // Populate the ad
        if (ad.user) {
          this.loadRelatedAds(ad._id, ad.userId); // Load related ads only after ad is populated
        }
      },
      error: (err) => console.error('Failed to fetch ad details:', err),
    });
  }


  loadRelatedAds(currentAdId: string, currentAdUserId: string): void {
    this.adService.getUserAds(currentAdUserId).subscribe({
      next: (userAds) => {
        this.relatedAds = userAds.filter((ad) => ad._id !== currentAdId);
      },
      error: (err) => console.error('Failed to fetch related ads:', err),
    });
  }

}
