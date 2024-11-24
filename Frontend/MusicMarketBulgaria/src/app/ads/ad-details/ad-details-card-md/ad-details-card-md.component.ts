import { Component, Input } from '@angular/core';
import { AdData } from '../../ad-data.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ad-details-card-md',
  standalone: true,
  imports: [RouterModule], 
  templateUrl: './ad-details-card-md.component.html',
  styleUrl: './ad-details-card-md.component.css'
})
export class AdDetailsCardMdComponent {
  @Input() ad: AdData | null = null;
  
}
