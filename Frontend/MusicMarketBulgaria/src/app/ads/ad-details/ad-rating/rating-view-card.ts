import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CustomDatePipe } from '../custom.date.pipe';
import { RatingDisplayModel } from './rating-display-model';
import { UserData } from '../../../user/user-data.model';

@Component({
  selector: 'app-rating-view-card',
  standalone: true,
  imports: [CustomDatePipe],
  template: `
    <div class="review-card">
       <div class="review-header">
        <h4 class="review-username">{{ review.userID.username }}</h4>
         <p class="review-date">{{ review.createdAt | customDate}}</p>
      </div>
      <p class="review-text">{{ review.reviewText }}</p>
    </div>
  `,
  styles: [
    `
/* Individual review card styling */
.review-card {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Header for the review: username and date */
.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
}

/* Username styling */
.review-username {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

/* Review date styling */
.review-date {
  font-size: 14px;
  color: #777;
  margin: 0;
}

/* Review text styling */
.review-text {
  font-size: 15px;
  color: #555;
  line-height: 1.5;
  margin-top: 10px;
}
    `,
  ],
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
