import { Component } from '@angular/core';
import { AdDetailsCardSmComponent } from '../ad-details/ad-details-card-sm/ad-details-card-sm.component';
import { AdData } from '../ad-data.model';
@Component({
  selector: 'app-ads-view-home',
  standalone: true,
  imports: [AdDetailsCardSmComponent],
  templateUrl: './ads-view-home.component.html',
  styleUrl: './ads-view-home.component.css'
})
export class AdsViewHomeComponent {
  ad: AdData | null = null;
}
