import { Component, Input } from '@angular/core';
import { AdData } from '../../ad-data.model';

@Component({
  selector: 'app-ad-details-images',
  standalone: true,
  imports: [],
  templateUrl: './ad-details-images.component.html',
  styleUrls: ['./ad-details-images.component.css', '../shared.css'],
})
export class AdDetailsImagesComponent {
  @Input() ad: AdData | null = null;

  currentImageIndex = 0;
  nextImage(): void {
    if (this.ad && this.ad.images) {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.ad.images.length;
    }
  }

  previousImage(): void {
    if (this.ad && this.ad.images) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.ad.images.length) %
        this.ad.images.length;
    }
  }
}
