import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingSubmitModel } from './rating-submit-model';

@Component({
  selector: 'app-rating-form',
  standalone: true,
  imports: [FormsModule], 
  template: `
    <div class="rating-form">
      <h4>Submit Your Rating</h4>
      <label for="rating">Rating (0-5):</label>
      <input
        id="rating"
        type="number"
        [(ngModel)]="rating"
        min="0"
        max="5"
        placeholder="Enter a rating (0-5)"
      />
      
      <label for="review">Review:</label>
      <textarea
        id="review"
        [(ngModel)]="review"
        rows="3"
        placeholder="Write your review"
      ></textarea>
      
      <button (click)="submitRating()">Submit</button>
    </div>
  `,
  styles: [
    `
    .rating-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #f9f9f9;
    }

    label {
      font-size: 14px; /* Adjust font size */
      color: #333; /* Optional: Adjust label color */
      margin-bottom: 5px; /* Optional: Add spacing below the label */
    }

    input, textarea {
      padding: 8px;
      font-size: 14px;
      width: 100%;
      box-sizing: border-box;
    }

    button {
      padding: 8px 12px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: #218838;
    }
  `
  ]
})
export class RatingFormComponent {
  @Input() adId!: string; // Ad ID for context
  @Output() ratingSubmitted = new EventEmitter<Partial<RatingSubmitModel>>(); // Emit rating and review

  rating: number = 0;
  review: string = '';

  submitRating(): void {
    if (this.rating >= 0 && this.rating <= 5) {
      this.ratingSubmitted.emit({ adID: this.adId, ratingValue: this.rating, reviewText: this.review || null,}); // Emit rating and review to parent
    } else {
      alert('Please enter a rating between 0 and 5.');
    }
  }
}
