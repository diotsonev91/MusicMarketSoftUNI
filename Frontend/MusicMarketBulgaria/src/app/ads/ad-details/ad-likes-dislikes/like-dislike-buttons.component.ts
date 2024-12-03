import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AdService } from '../../ad.service';

@Component({
  selector: 'app-like-dislike-buttons',
  standalone: true,
  template: `
   <div class="like-dislike--buttons">
  <!-- Thumbs-Up Button -->
  <button 
    class="thumbs-up" 
    (click)="onThumbsUp()"
    [style.color]="userVote === 1 ? '#ffc107' : 'inherit'" 
    [disabled]="!adId">
    <i class="fas fa-thumbs-up"></i>
  </button>
  <span id="likes-count">{{ likes }}</span>

  <!-- Thumbs-Down Button -->
  <button 
    class="thumbs-down" 
    (click)="onThumbsDown()"
    [style.color]="userVote === -1 ? '#ffc107' : 'inherit'" 
    [disabled]="!adId">
    <i class="fas fa-thumbs-down"></i>
  </button>
  <span id="dislikes-count">{{ dislikes }}</span>
</div>
  `,
  styles: [
    `
    .like-dislike--buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .like-dislike--buttons button {
      background: none;
      border: none;
      cursor: pointer;
    }

    .like-dislike--buttons button.active i {
      color: #ffc107; /* Highlight active buttons */
    }

    .like-dislike--buttons button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .like-dislike--buttons i {
      font-size: 1.5rem;
    }
      .yellow {
  color: #ffc107; /* Yellow color for active thumbs */
}

.thumbs-up i, .thumbs-down i {
  transition: color 0.3s ease; /* Smooth color change */
}
    `
  ]
})
export class LikeDislikeButtonsComponent implements  OnChanges {
  @Input() adId!: string | undefined; // The ad's ID
  likes: number = 0; // Count of likes
  dislikes: number = 0; // Count of dislikes
  userVote: number = 0; // User's current vote: 1 (like), -1 (dislike), 0 (neutral)

  constructor(private adService: AdService) {}

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adId'] && this.adId) {
      this.loadAdDetails();
   
    }
  }
  loadAdDetails(): void {
    if (!this.adId) {
      console.warn('adId is undefined. Skipping loadAdDetails.');
      return;
    }
  
    this.adService.getAdLikeDislikeCounts(this.adId).subscribe(({ likes, dislikes }) => {
      this.likes = likes;
      this.dislikes = dislikes;
      console.log('Updated Likes:', this.likes, 'Updated Dislikes:', this.dislikes);
    }, error => {
      console.error('Failed to fetch like/dislike counts:', error);
    });
  
    this.adService.getUserAdState(this.adId).subscribe(({ status }) => {
      this.userVote = status === 'like' ? 1 : status === 'dislike' ? -1 : 0;
      console.log('Updated User Vote:', this.userVote);
    }, error => {
      console.error('Failed to fetch user vote state:', error);
    });
  }
  // Handle thumbs up click
  onThumbsUp(): void {
    const newVote = this.userVote === 1 ? 0 : 1; // Toggle like or reset to neutral
    this.updateVote(newVote);
  }

  // Handle thumbs down click
  onThumbsDown(): void {
    const newVote = this.userVote === -1 ? 0 : -1; // Toggle dislike or reset to neutral
    this.updateVote(newVote);
  }

  updateVote(newVote: number): void {
    if (!this.adId) {
      console.warn('adId is undefined. Cannot update vote.');
      return;
    }
  
    // Optimistically update local state
    const previousVote = this.userVote;
  
    if (newVote === 1) {
      if (previousVote === 1) {
        this.likes--; // Undo like
        this.userVote = 0; // Neutral
      } else {
        this.likes += 1; // Add like
        if (previousVote === -1) this.dislikes--; // Undo dislike if previously disliked
        this.userVote = 1; // Set to like
      }
    } else if (newVote === -1) {
      if (previousVote === -1) {
        this.dislikes--; // Undo dislike
        this.userVote = 0; // Neutral
      } else {
        this.dislikes += 1; // Add dislike
        if (previousVote === 1) this.likes--; // Undo like if previously liked
        this.userVote = -1; // Set to dislike
      }
    } else {
      // Reset to neutral
      if (previousVote === 1) this.likes--; // Undo like
      if (previousVote === -1) this.dislikes--; // Undo dislike
      this.userVote = 0; // Neutral
    }
  
    // Send the updated vote to the backend
    this.adService.addLikeDislike(this.adId, newVote).subscribe(() => {
      // Refresh counts from the backend after server update
      this.loadAdDetails();
    }, error => {
      console.error('Failed to update vote:', error);
      // Rollback optimistic changes on failure
      this.loadAdDetails();
    });
  }
}
