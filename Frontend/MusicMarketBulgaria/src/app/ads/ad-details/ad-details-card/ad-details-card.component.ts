import { Component, Input } from '@angular/core';
import { AdData } from '../../ad-data.model';

@Component({
  selector: 'app-ad-details-card',
  standalone: true,
  imports: [],
  templateUrl: './ad-details-card.component.html',
  styleUrls: ['../shared.css','./ad-details-card.component.css']
})
export class AdDetailsCardComponent {
  @Input() ad: AdData | null = null;
}
