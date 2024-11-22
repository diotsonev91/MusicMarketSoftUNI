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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchAdDetails(id);
      this.loadRelatedAds(id);
    }
  }

  fetchAdDetails(id: string): void {
    this.adService.getAdById(id).subscribe({
      next: (ad) => (this.ad = ad),
      error: (err) => console.error('Failed to fetch ad details:', err),
    });
  }

  loadRelatedAds(currentAdId: string): void {
    this.adService.getAllAds().subscribe({
      next: (ads) => {
        // Filter out the current ad
        this.relatedAds = ads.filter((ad) => ad._id !== currentAdId).slice(0, 4);
      },
      error: (err) => console.error('Failed to fetch related ads:', err),
    });
  }

}
