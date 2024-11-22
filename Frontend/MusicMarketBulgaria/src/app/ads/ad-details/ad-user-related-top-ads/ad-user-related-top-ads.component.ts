import { Component, Input } from '@angular/core';
import { AdData } from '../../ad-data.model';

@Component({
  selector: 'app-ad-user-related-top-ads',
  standalone: true,
  imports: [],
  templateUrl: './ad-user-related-top-ads.component.html',
  styleUrls: ['../shared.css','./ad-user-related-top-ads.component.css']
})
export class AdUserRelatedTopAdsComponent {
@Input() relatedAds: AdData[] = [];

}


