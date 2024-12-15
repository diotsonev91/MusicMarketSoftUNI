import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="star-rating" [style.fontSize.px]="size" [style.color]="activeColor">
      <!-- Render filled stars -->
      @for (star of filledStarsArray; track star.index) {
        <i class="fa-solid fa-star"></i>
      }

      <!-- Render half star -->
      @if (hasHalfStar) {
        <i class="fa-solid fa-star-half-stroke"></i>
      }

      <!-- Render unfilled stars -->
      @for (star of emptyStarsArray; track star.index) {
        <i class="fa-regular fa-star"></i>
      }
    </div>
  `,
  styles: [
    `
      .star-rating i {
        margin-right: 2px;
      }
    `,
  ],
})
export class StarRatingComponent {
  @Input() rating: number = 0; // Current rating
  @Input() totalStars: number = 5; // Total number of stars
  @Input() size: number = 16; // Size of stars
  @Input() activeColor: string = '#ffc107'; // Color for filled stars
  @Input() inactiveColor: string = '#e4e5e9'; // Color for empty stars

  // Calculate the number of fully filled stars
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
  get filledStarsArray(): { value: number; index: number }[] {
    return Array.from({ length: this.filledStars }, (_, index) => ({
      value: 1, // Representing a filled star
      index,
    }));
  }

  get emptyStarsArray(): { value: number; index: number }[] {
    return Array.from({ length: this.emptyStars }, (_, index) => ({
      value: 0, // Representing an empty star
      index,
    }));
  }
}
