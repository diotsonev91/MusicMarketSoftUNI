import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AdData } from '../../ad-data.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ad-details-card-sm',
  standalone: true,
  imports: [RouterModule], 
  templateUrl: './ad-details-card-sm.component.html',
  styleUrls: ['./ad-details-card-sm.component.css']
})
export class AdDetailsCardSmComponent implements OnChanges {
  @Input() ad: AdData | null = null;

  ngOnChanges(changes: SimpleChanges): void {
  
    if (changes['ad'] && changes['ad'].currentValue) {
      console.log('Received ad data in ad-details-card-sm:', changes['ad'].currentValue);
    } else if (changes['ad'] && changes['ad'].currentValue === null) {
      console.log('Ad data cleared in ad-details-card-sm');
    }
  }
}
