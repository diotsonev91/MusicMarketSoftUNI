import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RatingFormComponent } from '../rating-form.component';
import { AdService } from '../../../ad.service';
import { RatingDisplayModel } from '../rating-models/rating-display-model';
import { tap } from 'rxjs';
import { CustomDatePipe } from '../../custom.date.pipe';
import { RatingViewCardComponent } from '../rating-view-card/rating-view-card';
import { RatingSubmitModel } from '../rating-models/rating-submit-model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-rating-view',
  standalone: true,
  imports: [RatingFormComponent,CustomDatePipe, RatingViewCardComponent, StarRatingComponent],
  templateUrl: './rating-view.component.html'  ,
styleUrls:['./rating-view.component.css'],
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
}