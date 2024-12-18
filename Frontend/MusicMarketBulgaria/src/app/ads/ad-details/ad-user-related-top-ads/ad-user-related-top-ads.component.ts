import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AdData } from '../../ad-data.model';
import { AdDetailsCardMdComponent } from '../ad-details-card-md/ad-details-card-md.component';

@Component({
  selector: 'app-ad-user-related-top-ads',
  standalone: true,
  imports: [AdDetailsCardMdComponent],
  templateUrl: './ad-user-related-top-ads.component.html',
  styleUrls: ['../shared.css', './ad-user-related-top-ads.component.css'],
})
export class AdUserRelatedTopAdsComponent implements OnChanges {
  @Input() relatedAds: AdData[] = [];
  filteredAds: AdData[] = []; // Store ads with rating > 3

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['relatedAds'] && changes['relatedAds'].currentValue) {
      //console.log('relatedAds input has changed:', changes['relatedAds'].currentValue);
      this.processRelatedAds(changes['relatedAds'].currentValue);
    }
  }

  processRelatedAds(ads: AdData[]): void {
    // Filter ads with a valid adRate > 3
    this.filteredAds = ads.filter(ad => {
      const isValidAdRate = ad.adRate !== null && ad.adRate !== undefined && ad.adRate > 3;
      console.log("Ad title:", ad.title, "Ad rate:", ad.adRate, "Valid:", isValidAdRate); // Debugging
      return isValidAdRate;
    });
  
   // console.log('Filtered related ads with rating > 3:', this.filteredAds);
  }
}
