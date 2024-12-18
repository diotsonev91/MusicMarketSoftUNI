import { Component } from '@angular/core';
import { AdService } from '../ad.service';
import { AdData } from '../ad-data.model';
import { Router } from '@angular/router';
import { AdFormComponent } from '../ad-form/ad-form.component';

@Component({
  selector: 'app-create-ad',
  standalone: true,
  imports: [AdFormComponent],
  template: `
    <app-ad-form
      [submitButtonText]="'Добави обява'"
      (formSubmit)="onCreateAd($event)"
    >
    </app-ad-form>
  `,
})
export class CreateAdComponent {
  constructor(private adService: AdService, private router: Router) {}

  onCreateAd({
    adData,
    images,
  }: {
    adData: Partial<AdData>;
    images: File[];
  }): void {
    this.adService.createAd(adData, images).subscribe({
      next: (response) => {
        console.log('Ad created successfully:', response);
        const adId = response._id; // Extract the ad ID from the response
        if (adId) {
          this.router.navigate([`/ad-details/${adId}`]); // Redirect to ad details page
        } else {
          console.error('Ad ID not found in response.');
        }
      },
      error: (err) => console.error('Failed to create ad:', err),
    });
  }
}
