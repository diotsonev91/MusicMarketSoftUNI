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
}
