import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdService } from '../ad.service';
import { AdData } from '../ad-data.model';
import { AdFormComponent } from '../ad-form/ad-form.component';

@Component({
  selector: 'app-edit-ad',
  standalone: true,
  imports: [AdFormComponent],
  template: `
    <app-ad-form
      [initialData]="adData"
      [submitButtonText]="'Редактирай обява'" 
      (formSubmit)="onEditAd($event)">
    </app-ad-form>
  `,
})
export class EditAdComponent implements OnInit {
  adData: Partial<AdData> = {};

  constructor(
    private adService: AdService,
    private route: ActivatedRoute,
    
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    const stateAdData = navigation?.extras.state?.['adData'] as AdData;
    if (stateAdData) {
      this.adData = stateAdData;
      console.log('Ad data passed via state:', stateAdData);
    }
  }

  ngOnInit(): void {
    
    const stateAdData = this.adData;
    if (stateAdData) {
      this.adData = stateAdData; // Use the passed adData
      console.log('Ad data passed via state:', stateAdData);
    } else {
      console.log('State is undefined, fetching ad from backend.');
      const adId = this.route.snapshot.paramMap.get('id');
      if (adId) {
        this.adService.getAdById(adId).subscribe({
          next: (ad) => {
            this.adData = ad;
            console.log('Ad data fetched from backend:', ad);
          },
          error: (err) => console.error('Failed to fetch ad:', err),
        });
      }
    }
  }
  onEditAd({ adData, images }: { adData: Partial<AdData>; images: File[] }): void {
    this.adService.editAd(this.adData._id!, adData, images, adData.remainingImages || []).subscribe({
      next: () => this.router.navigate(['/ads']),
      error: (err) => console.error('Failed to update ad:', err),
    });
  }
}
