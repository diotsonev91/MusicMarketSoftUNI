import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RatingFormComponent } from './rating-form.component';
import { AdService } from '../../ad.service';
import { RatingDisplayModel } from './rating-display-model';
import { tap } from 'rxjs';
import { CustomDatePipe } from '../custom.date.pipe';
import { RatingViewCardComponent } from './rating-view-card';
import { RatingSubmitModel } from './rating-submit-model';

@Component({
  selector: 'app-rating-view',
  standalone: true,
  imports: [RatingFormComponent,CustomDatePipe, RatingViewCardComponent],
  template: `
  <div>
    <div 
      class="star-rating" 
      [style.fontSize.px]="24" 
      [style.color]="'#ffc107'">
      
      <!-- Render filled stars -->
      @for (star of filledStarsArray; track star) {
        <i class="fa-solid fa-star"></i>
      }

      <!-- Render half star -->
      @if (hasHalfStar) {
        <i class="fa-solid fa-star-half-stroke"></i>
      }

      <!-- Render unfilled stars -->
      @for (star of emptyStarsArray; track star) {
        <i class="fa-regular fa-star"></i>
      }
    </div>

    <!-- Button to toggle reviews -->
    @if(!showRatingForm){
    <button (click)="toggleReviews()" class="reviews-button">
      {{ showReviews ? 'Hide Reviews' : 'Show Reviews' }}
    </button>
    }

    <!-- Conditionally render reviews -->
    @if (showReviews && !showRatingForm) {
      <div class="reviews">
        @for (review of reviews; track review.adID) {
          <app-rating-view-card [review]="review"></app-rating-view-card>
        }
      </div>
    }
    @if(!showReviews){
    <!-- Button to toggle rating form -->
    <button (click)="toggleRatingForm()" class="add-rating-button">
      {{ showRatingForm ? 'Cancel' : 'Add Rating' }}
    </button>
    }
    @if (showRatingForm && ! showReviews) {
      <app-rating-form 
        [adId]="adId" 
        (ratingSubmitted)="handleRatingSubmitted($event)">
      </app-rating-form>
    }
  </div>
`,
styles: [
  `
    .reviews {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

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

/* Add Rating Button */
.add-rating-button {
  margin-top: 10px;
  padding: 8px 16px;
  font-size: 14px;
  background-color: rgb(59, 39, 78);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 4px;
}

.add-rating-button:hover {
  background-color: #4b2f6a;
}

/* Reviews Toggle Button */
.reviews-button {
  margin: 10px 0;
  padding: 8px 16px;
  font-size: 14px;
  background-color: rgb(51, 51, 51);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 4px;
}

.reviews-button:hover {
  background-color: #444;
}

/* Star Rating Styling */
.star-rating i {
  margin-right: 2px;
}
  `,
],
})
export class RatingViewComponent implements OnChanges {
  rating: number = 0; // Initial rating
  totalStars: number = 5; // Total stars
  starSize: number = 16; // Size of stars
  activeColor: string = '#ffc107'; // Active star color
  inactiveColor: string = '#e4e5e9'; // Inactive star color
  reviews: RatingDisplayModel[] = []; // Holds the list of reviews
  showReviews: boolean = false; // Controls the visibility of reviews
  showRatingForm: boolean = false;
  @Input() adId!: string; // ID of the ad

  @Output() formToggled = new EventEmitter<boolean>(); // Emits when the form is toggled
  @Output() reviewToggled = new EventEmitter<boolean>();
  
  constructor(private adService: AdService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adId'] && changes['adId'].currentValue) {
      console.log('AD ID in Rating View:', this.adId);
      this.fetchRatings(); // Fetch ratings whenever adId changes
    }
  }

  private fetchRatings(): void {
    this.adService
      .getAdRates(this.adId)
      .pipe(
        tap((response: any) => {
          console.log('Raw response from backend:', response);
        })
      )
      .subscribe({
        next: (response: { ratings: RatingDisplayModel[]; averageRating: number }) => {
          this.rating = response.averageRating || 0; // Update rating
          this.reviews = response.ratings; 
          console.log('Fetched ratings:', response);
          console.log('Updated rating for stars:', this.rating);
        },
        error: (err) => console.error('Error fetching ad ratings:', err.message),
      });
  }

  // Toggle visibility of the rating form
  toggleRatingForm(): void {
    this.showRatingForm = !this.showRatingForm;
    this.formToggled.emit(this.showRatingForm); // Emit the form's visibility status
  }

  handleRatingSubmitted(event: Partial<RatingSubmitModel>): void {
    console.log('Rating submitted:', event.ratingValue, 'Review:', event.reviewText);
    this.toggleRatingForm(); // Close the form after submission
    event.adID = this.adId;
    this.adService.rateAdd(event).subscribe({
      next: (response) => {
        console.log('Rating submitted successfully:', response);
        // Re-fetch ratings to update the stars
      },
      error: (err) => console.error('Error submitting rating:', err.message),
    });
  }

  toggleReviews(): void {
    this.showReviews = !this.showReviews; // Toggle reviews visibility
    this.formToggled.emit(this.showReviews);
  }
  // Calculate number of fully filled stars
  get filledStars(): number {
    return Math.floor(this.rating);
  }

  // Check if there is a half star
  get hasHalfStar(): boolean {
    return this.rating % 1 !== 0;
  }

  // Calculate the number of empty stars
  get emptyStars(): number {
    return this.totalStars - this.filledStars - (this.hasHalfStar ? 1 : 0);
  }

  // Arrays for rendering stars
  get filledStarsArray(): number[] {
    return Array(this.filledStars).fill(0);
  }

  get emptyStarsArray(): number[] {
    return Array(this.emptyStars).fill(0);
  }
}