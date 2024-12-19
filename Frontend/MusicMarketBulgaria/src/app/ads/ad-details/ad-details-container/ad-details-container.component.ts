import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdService } from '../../ad.service';
import { AdData } from '../../ad-data.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { AdDetailsCardComponent } from '../ad-details-card/ad-details-card.component';
import { AdDetailsImagesComponent } from '../ad-details-images/ad-details-images.component';
import { AdUserRelatedTopAdsComponent } from '../ad-user-related-top-ads/ad-user-related-top-ads.component';

@Component({
  selector: 'app-ad-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ContactFormComponent, AdDetailsCardComponent, AdDetailsImagesComponent, AdUserRelatedTopAdsComponent],
  templateUrl: './ad-details-container.component.html',
  styleUrls: ['./ad-details-container.component.css'],
})
export class AdDetailsContainerComponent implements OnInit {
  ad: AdData | null = null; // Current ad data
  relatedAds: AdData[] = []; // Related ads
  isLoading: boolean = true; // Loading state
  stateProcessed: boolean = false; // Tracks if extras.state was processed

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adService: AdService,
  ) {
    // Attempt to retrieve `ad` from router state
    const stateAdData = this.router.getCurrentNavigation()?.extras.state?.['ad'] as AdData;

    if (stateAdData) {
      // Use state data if available
      this.ad = stateAdData;
      this.stateProcessed = true;
      this.isLoading = false;
      //console.log('Ad data passed via state:', stateAdData);
    } else {
      // Fallback: wait and then fetch if state is not provided
      console.log('No state data found. Waiting 2 seconds for fallback...');
      setTimeout(() => {
        if (!this.stateProcessed) {
          const adId = this.route.snapshot.paramMap.get('id');
          if (adId) {
            //console.log('Still no state data after 2 seconds. Triggering fallback fetch for adId:', adId);
            this.fetchAdDetails(adId);
          } else {
            //console.error('No adId found in route. Cannot fetch data.');
            this.isLoading = false;
          }
        }
      }, 2000); // Wait 2 seconds
    }
  }

  ngOnInit(): void {
    // If state wasn't processed, retrieve adId and fetch the data
    this.route.paramMap.subscribe(params => {
      const adId = params.get('id'); // Get the 'id' parameter
      if (!this.stateProcessed && adId) {
        //console.log('AdId extracted from route:', adId);
        this.fetchAdDetails(adId);
      }
    });
  }

  goToUser(userId: string): void {
    // Use AdService to navigate
    this.adService.goToUser(userId);
  }

  fetchAdDetails(adId: string): void {
    this.isLoading = true; // Set loading state
    this.adService.getAdById(adId).subscribe({
      next: (ad) => {
        this.ad = ad; // Populate the ad
        this.isLoading = false;
        this.stateProcessed = true; // Mark state as processed
        //console.log('Ad data fetched successfully:', ad);

        if (ad.userId) {
          this.loadRelatedAds(ad._id, ad.userId); // Load related ads
        }
      },
      error: (err) => {
        console.error('Failed to fetch ad details:', err);
        this.isLoading = false;
      },
    });
  }

  loadRelatedAds(currentAdId: string, currentAdUserId: string): void {
    //console.log('Loading related ads for userId:', currentAdUserId);
    this.adService.getUserAds(currentAdUserId).subscribe({
      next: (userAds) => {
        this.relatedAds = userAds; // Populate related ads
        //console.log('Related ads fetched successfully:', userAds);
      },
      error: (err) => console.error('Failed to fetch related ads:', err),
    });
  }
}
