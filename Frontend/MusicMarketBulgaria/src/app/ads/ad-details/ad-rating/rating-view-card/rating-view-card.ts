import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CustomDatePipe } from '../../custom.date.pipe';
import { RatingDisplayModel } from '../rating-models/rating-display-model';
import { UserData } from '../../../../user/user-data.model';

@Component({
  selector: 'app-rating-view-card',
  standalone: true,
  imports: [CustomDatePipe],
  templateUrl: './rating-view-card.component.html',
  styleUrls: ['./rating-view-card.component.css'],
})
export class RatingViewCardComponent implements OnChanges {
  @Input() review!: RatingDisplayModel; // Expect a single review as input

  user: UserData | null = null; // User data to be displayed

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['review'] && this.review?.userID) {
      // Fetch user data based on the userID
      console.log("review object in reatingview card on changes",this.review.userID._id)
    }
  }
}
