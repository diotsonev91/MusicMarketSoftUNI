import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdData } from '../ad-data.model';

@Injectable({ providedIn: 'root' })
export class AdStateService {
  private cachedAds = new BehaviorSubject<AdData[] | null>(null);

  get ads$() {
    return this.cachedAds.asObservable();
  }

  setAds(ads: AdData[]): void {
    this.cachedAds.next(ads);
  }

  clearAds(): void {
    this.cachedAds.next(null);
  }

  // Clear a specific ad from the cached list
  clearAd(adId: string): void {
    const currentAds = this.cachedAds.value;

    if (currentAds) {
      const filteredAds = currentAds.filter((ad) => ad._id !== adId);
      this.cachedAds.next(filteredAds);
    }
  }
  // Add or update an ad in the cached list
  updateAd(ad: AdData): void {
    const currentAds = this.cachedAds.value;

    if (currentAds) {
      // Check if the ad already exists in the list
      const adIndex = currentAds.findIndex(
        (existingAd) => existingAd._id === ad._id
      );

      if (adIndex !== -1) {
        // Update the existing ad
        const updatedAds = [...currentAds];
        updatedAds[adIndex] = ad;
        this.cachedAds.next(updatedAds);
      } else {
        // Add the new ad to the list
        this.cachedAds.next([...currentAds, ad]);
      }
    } else {
      // Initialize with the new ad if the list is empty
      this.cachedAds.next([ad]);
    }
  }
}
