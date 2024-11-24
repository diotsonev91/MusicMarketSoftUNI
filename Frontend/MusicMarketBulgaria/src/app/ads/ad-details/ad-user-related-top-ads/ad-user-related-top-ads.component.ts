import { Component, Input } from '@angular/core';
import { AdData } from '../../ad-data.model';
import { AdDetailsCardMdComponent } from '../ad-details-card-md/ad-details-card-md.component';

@Component({
  selector: 'app-ad-user-related-top-ads',
  standalone: true,
  imports: [AdDetailsCardMdComponent],
  templateUrl: './ad-user-related-top-ads.component.html',
  styleUrls: ['../shared.css','./ad-user-related-top-ads.component.css']
})
export class AdUserRelatedTopAdsComponent {
@Input() relatedAds: AdData[] = [];

}


