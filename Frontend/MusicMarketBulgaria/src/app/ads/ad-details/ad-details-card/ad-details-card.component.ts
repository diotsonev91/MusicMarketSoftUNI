import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AdData } from '../../ad-data.model';
import { RatingViewComponent } from '../ad-rating/rating-view.component';
import { CustomDatePipe } from '../custom.date.pipe';

@Component({
  selector: 'app-ad-details-card',
  standalone: true,
  imports: [RatingViewComponent, CustomDatePipe],
  templateUrl: './ad-details-card.component.html',
  styleUrls: ['../shared.css','./ad-details-card.component.css']
})
export class AdDetailsCardComponent implements OnChanges,OnInit {
  @Input() ad: AdData | null = null;
  @Input() adRating: number | null = null; // Nullable, passed from parent
  @Output() userClicked = new EventEmitter<string>(); 

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

   // Emit userId when the author's name is clicked
   onAuthorClick(): void {
    if (this.ad?.userId) {
      console.log("user id in onAuthorclick", this.ad?.userId)
      this.userClicked.emit(this.ad.userId);
    } else {
      console.error('User ID is not defined');
    }
  }
}
