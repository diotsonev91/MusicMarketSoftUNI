import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AdData } from '../../ad-data.model';
import { RatingViewComponent } from '../ad-rating/rating-view.component';

@Component({
  selector: 'app-ad-details-card',
  standalone: true,
  imports: [RatingViewComponent],
  templateUrl: './ad-details-card.component.html',
  styleUrls: ['../shared.css','./ad-details-card.component.css']
})
export class AdDetailsCardComponent implements OnChanges,OnInit {
  @Input() ad: AdData | null = null;
  @Input() adRating: number | null = null; // Nullable, passed from parent

  currentAdRating = 0; // Fallback default value

  ngOnInit():void {
    if (this.adRating !== null) {
      this.currentAdRating = this.adRating; // Update the current rating
      console.log(this.currentAdRating)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adRating'] && this.adRating !== null) {
      this.currentAdRating = this.adRating; // Update the current rating
      console.log(this.currentAdRating)
    }
  }
}
