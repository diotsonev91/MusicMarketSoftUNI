import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AdData } from '../../ad-data.model';
import { RatingViewComponent } from '../ad-rating/rating-view/rating-view.component';
import { CustomDatePipe } from '../custom.date.pipe';
import { LikeDislikeButtonsComponent } from '../ad-likes-dislikes/like-dislike-buttons.component';
import { UserService } from '../../../user/user.service';

@Component({
  selector: 'app-ad-details-card',
  standalone: true,
  imports: [RatingViewComponent, CustomDatePipe, LikeDislikeButtonsComponent],
  templateUrl: './ad-details-card.component.html',
  styleUrls: ['../shared.css', './ad-details-card.component.css'],
})
export class AdDetailsCardComponent implements OnChanges {
  @Input() ad: AdData | null = null;

  @Output() userClicked = new EventEmitter<string>();
  isRatingFormOpen: boolean = false;
  hideButtons: boolean = false;
  adId: string = '';

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.userService.getCurrentUserId() == null) {
      this.hideButtons = true;
    }
    if (changes['ad'] && this.ad?.['_id']) {
      this.adId = this.ad._id; // Update adId when ad changes
    }
  }

  // Emit userId when the author's name is clicked
  onAuthorClick(): void {
    if (this.ad?.userId) {
      console.log('user id in onAuthorclick', this.ad?.userId);
      this.userClicked.emit(this.ad.userId);
    } else {
      console.error('User ID is not defined');
    }
  }

  toggleRatingForm(state: boolean): void {
    this.isRatingFormOpen = state;
  }

  toggleReview(state: boolean): void {
    this.isRatingFormOpen = state;
  }
}
