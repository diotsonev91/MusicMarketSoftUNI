import { Component, Input, SimpleChanges } from '@angular/core';
import { AdData } from '../../ad-data.model';
import { RouterModule } from '@angular/router';
import { AdService } from '../../ad.service';
import { tap } from 'rxjs';
import { StarRatingComponent } from '../ad-rating/star-rating/star-rating.component';

@Component({
  selector: 'app-ad-details-card-md',
  standalone: true,
  imports: [RouterModule, StarRatingComponent], 
  templateUrl: './ad-details-card-md.component.html',
  styleUrl: './ad-details-card-md.component.css'
})
export class AdDetailsCardMdComponent {
  rating: number = 0; // Initial rating
  totalStars: number = 5; // Total stars
  starSize: number = 16; // Size of stars
  activeColor: string = '#ffc107'; // Active star color
  inactiveColor: string = '#e4e5e9'; // Inactive star color
  @Input() ad: AdData | null = null;

  constructor(private adService: AdService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ad'] && changes['ad'].currentValue) {
      this.fetchRatings(); // Fetch ratings whenever adId changes
    }
  }
  private fetchRatings(): void {
    this.adService
      .getAdRates(this.ad?._id || "")
      .pipe(
        tap((response: any) => {
          console.log('Raw response from backend:', response);
        })
      )
      .subscribe({
        next: (response: { averageRating: number }) => {
          this.rating = response.averageRating || 0; // Update rating
          console.log('inside ad-details-card : Fetched ratings:', response);
          console.log('inside ad-details-card : Updated rating for stars:', this.rating);
        },
        error: (err) => console.error('Error fetching ad ratings:', err.message),
      });
  }

}
