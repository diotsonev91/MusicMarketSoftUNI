import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdService } from '../ad.service';
import { AdData } from '../ad-data.model';
import { AdFormComponent } from '../ad-form/ad-form.component';

@Component({
  selector: 'app-edit-ad',
  standalone: true,
  imports: [AdFormComponent],
  template: `
    @if (isLoading) {
    <div>
      <p>Loading ad data...</p>
    </div>
    } @else {
    <app-ad-form
      [initialData]="adData"
      [submitButtonText]="'Редактирай обява'"
      (formSubmit)="onEditAd($event)"
    >
    </app-ad-form>
    }
  `,
})
export class EditAdComponent implements OnInit {
  adData: Partial<AdData> = {}; // Ad data to populate the form
  adId: string | null = null; // ID of the ad from the route
  isLoading: boolean = true; // Controls loading state
  stateProcessed: boolean = false; // Tracks whether extras.state has been processed
  triggerFetch: boolean = false; // Flag for delayed fetch logic

  constructor(
    private adService: AdService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Attempt to retrieve adData from router state
    const stateAdData = this.router.getCurrentNavigation()?.extras.state?.[
      'adData'
    ] as AdData;

    if (stateAdData) {
      // Use state if available
      this.adData = stateAdData;
      this.stateProcessed = true;
      this.isLoading = false;
      console.log('Ad data passed via state:', stateAdData);
    } else {
      // State not available, set timeout to trigger fallback
      console.log('No state data found. Waiting 0.1 seconds for fallback...');
      setTimeout(() => {
        if (!this.stateProcessed) {
          console.log(
            'Still no state data after 0.1 seconds. Triggering fallback...'
          );
          if (this.adId) this.fetchAdData(this.adId);
        }
      }, 100); // 2-second delay
    }
  }

  ngOnInit(): void {
    // Get adId from route as a fallback identifier
    this.adId = this.route.snapshot.paramMap.get('id');
  }

  private fetchAdData(adId: string): void {
    this.isLoading = true; // Set loading state while fetching data
    console.log('Fetching ad data from backend for adId:', adId);

    this.adService.getAdById(adId).subscribe({
      next: (ad) => {
        this.adData = ad;
        this.isLoading = false;
        this.stateProcessed = true; // Mark state as processed
        console.log('Ad data fetched successfully:', ad);
      },
      error: (err) => {
        console.error('Error fetching ad data:', err);
        this.isLoading = false; // Stop loading on error
      },
    });
  }

  onEditAd({
    adData,
    images,
  }: {
    adData: Partial<AdData>;
    images: File[];
  }): void {
    if (!this.adId) {
      console.error('Ad ID is missing. Cannot proceed with edit.');
      return;
    }

    this.adService
      .editAd(this.adId, adData, images, adData.remainingImages || [])
      .subscribe({
        next: (response) => {
          console.log('Ad edited successfully:', response);
          const adId = response._id; // Extract the ad ID from the response
          if (adId) {
            this.router.navigate([`/ad-details/${adId}`]); // Redirect to ad details page
          } else {
            console.error('Ad ID not found in response.');
          }
        },
        error: (err) => console.error('Failed to update ad:', err),
      });
  }
}
