import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AdService } from '../../../ad.service';

@Component({
  selector: 'app-rating-buttons',
  standalone: true,
  template: `
    <div class="rating-buttons">
      <button 
        class="thumbs-up" 
        (click)="onThumbsUp()"
        [class.active]="userVote === 1">
        <i class="fas fa-thumbs-up"></i>
      </button>
      <span id="likes-count">{{ likes }}</span>
      <button 
        class="thumbs-down" 
        (click)="onThumbsDown()"
        [class.active]="userVote === -1">
        <i class="fas fa-thumbs-down"></i>
      </button>
    </div>
  `,
  styles: [
    `
    .rating-buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .rating-buttons button {
      background: none;
      border: none;
      cursor: pointer;
    }

    .rating-buttons button.active i {
      color: #ffc107; /* Highlight active buttons */
    }

    .rating-buttons button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .rating-buttons i {
      font-size: 1.5rem;
    }
    `
  ]
})
export class RatingButtonsComponent {
  @Input() adId!: string; // ID of the ad
  @Input() likes: number = 0; // Current likes count
  @Input() userVote: number = 0; // User's current vote: -1, 0, or 1

  @Output() ratingChange = new EventEmitter<number>(); // Emits updated likes count

  constructor(private adService: AdService) {}

  onThumbsUp(): void {
    const newVote = this.userVote === 1 ? 0 : 1; // Toggle vote
    this.updateVote(newVote);
  }

  onThumbsDown(): void {
    const newVote = this.userVote === -1 ? 0 : -1; // Toggle vote
    this.updateVote(newVote);
  }

  private updateVote(newVote: number): void {
    this.adService.addRating(this.adId, newVote).subscribe({
      next: (updatedLikes) => {
        this.userVote = newVote; // Update the user's vote state
        this.likes = updatedLikes; // Update likes count
        this.ratingChange.emit(this.likes); // Notify parent component
      },
      error: (err) => console.error('Error updating vote:', err),
    });
  }
}
