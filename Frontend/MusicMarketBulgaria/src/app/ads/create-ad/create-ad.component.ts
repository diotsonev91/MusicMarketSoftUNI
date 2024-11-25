import { Component } from '@angular/core';
import { AdService } from '../ad.service';
import { AdData } from '../ad-data.model';
import { AdFormComponent } from '../ad-form/ad-form.component';

@Component({
  selector: 'app-create-ad',
  standalone: true,
  imports: [AdFormComponent],
  template: `
    <app-ad-form
      [submitButtonText]="'Create Ad'"
      (formSubmit)="onCreateAd($event)">
    </app-ad-form>
  `,
})
export class CreateAdComponent {
  constructor(private adService: AdService) {}

  onCreateAd({ adData, images }: { adData: Partial<AdData>; images: File[] }): void {
    this.adService.createAd(adData, images).subscribe({
      next: (response) => console.log('Ad created successfully:', response),
      error: (err) => console.error('Failed to create ad:', err),
    });
  }
}
