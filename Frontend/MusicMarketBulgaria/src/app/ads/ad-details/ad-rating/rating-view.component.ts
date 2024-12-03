import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RatingFormComponent } from './rating-form.component';

@Component({
  selector: 'app-rating-view',
  standalone: true,
  imports: [RatingFormComponent],
  template: `
    <div 
      class="star-rating" 
      [style.fontSize.px]="starSize" 
      [style.color]="activeColor">
      
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

    <!-- Button to toggle the rating form -->
    <button (click)="toggleRatingForm()" class="add-rating-button">Add Rating</button>

    <!-- Dynamically load the rating form -->
    @if (showRatingForm) {
      <app-rating-form 
        [adId]="adId" 
        (ratingSubmitted)="handleRatingSubmitted($event)">
      </app-rating-form>
    }
  `,
  styles: [
    `
      .add-rating-button {
        margin-top: 10px;
        padding: 8px 16px;
        font-size: 14px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .add-rating-button:hover {
        background-color: #0056b3;
      }
    `
  ]
})
export class RatingViewComponent {
  @Input() rating: number = 0; // Initial rating
  @Input() totalStars: number = 5; // Total stars
  @Input() starSize: number = 16; // Size of stars
  @Input() activeColor: string = '#ffc107'; // Active star color
  @Input() inactiveColor: string = '#e4e5e9'; // Inactive star color
  @Input() adId!: string; // ID of the ad

  @Output() formToggled = new EventEmitter<boolean>(); // Emits a boolean
  showRatingForm: boolean = false;

  // Toggle visibility of the rating form

  toggleRatingForm(): void {
    this.showRatingForm = !this.showRatingForm;
    this.formToggled.emit(this.showRatingForm); // Emit boolean
  }

  handleRatingSubmitted(event: { rating: number; review: string }): void {
    console.log('Rating:', event.rating);
    console.log('Review:', event.review);
    // Handle the rating and review logic here
    this.toggleRatingForm(); // Close the form after submission
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
