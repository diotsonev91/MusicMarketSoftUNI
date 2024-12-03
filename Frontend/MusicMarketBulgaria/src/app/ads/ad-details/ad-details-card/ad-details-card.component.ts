import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AdData } from '../../ad-data.model';
import { RatingViewComponent } from '../ad-rating/rating-view.component';
import { CustomDatePipe } from '../custom.date.pipe';
import { LikeDislikeButtonsComponent } from '../ad-likes-dislikes/like-dislike-buttons.component';

@Component({
  selector: 'app-ad-details-card',
  standalone: true,
  imports: [RatingViewComponent, CustomDatePipe, LikeDislikeButtonsComponent],
  templateUrl: './ad-details-card.component.html',
  styleUrls: ['../shared.css','./ad-details-card.component.css']
})
export class AdDetailsCardComponent implements OnChanges,OnInit {
  @Input() ad: AdData | null = null;
  @Input() adRating: number | null = null; // Nullable, passed from parent
  @Output() userClicked = new EventEmitter<string>(); 
  isRatingFormOpen: boolean = false;
  currentAdRating = 0; // Fallback default value
  adId: string = '';
  ngOnInit():void {
    
    if (this.adRating !== null) {
      this.currentAdRating = this.adRating; // Update the current rating
    }
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adRating'] && this.adRating !== null) {
      this.currentAdRating = this.adRating; // Update the current rating
    }
    if (changes['ad'] && this.ad?.['_id']) {
      this.adId = this.ad._id; // Update adId when ad changes
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

  toggleRatingForm(state: boolean): void {
    this.isRatingFormOpen = state;
  }
}
