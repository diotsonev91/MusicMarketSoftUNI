import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-view',
  standalone: true,
  template: `
    <div 
      class="star-rating" 
      [style.fontSize.px]="starSize" 
      [style.color]="activeColor">
      
      <!-- Render filled stars -->
      @for (star of filledStarsArray; track $index) {
        <i class="fa-solid fa-star"></i>
      }

      <!-- Render half star -->
      @if (hasHalfStar) {
        <i class="fa-solid fa-star-half-stroke"></i>
      }

      <!-- Render unfilled stars -->
      @for (star of emptyStarsArray; track $index) {
        <i class="fa-regular fa-star"></i>
      }
    </div>
  `
})
export class RatingViewComponent {
  @Input() rating: number = 0; // Rating input (e.g., 3.5)
  @Input() totalStars: number = 5; // Total stars to display
  @Input() starSize: number = 16; // Size of the stars
  @Input() activeColor: string = '#ffc107'; // Active star color
  @Input() inactiveColor: string = '#e4e5e9'; // Inactive star color

  // Calculate number of fully filled stars
  get filledStars(): number {
    return Math.floor(this.rating);
  }

  // Check if a half star exists
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
    console.log("rating",this.rating)
    console.log("empty stars" ,this.emptyStars)
    return Array(this.emptyStars).fill(0);
    
  }
}
