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
export class AdDetailsCardSmComponent {
  @Input() ad: AdData | null = null;
}
