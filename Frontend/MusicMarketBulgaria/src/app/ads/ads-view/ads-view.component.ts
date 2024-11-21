import { Component, OnInit } from '@angular/core';
import { AdService } from '../ad.service';
import { AdData } from '../ad-data.model';
import { FilterComponent } from '../filter/filter.component';
import { SearchComponent } from '../search/search.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ads-view',
  standalone: true,
  imports: [FilterComponent, SearchComponent, CommonModule, RouterModule],
  templateUrl: './ads-view.component.html',
  styleUrls: ['./ads-view.component.css'],
})
export class AdsViewComponent implements OnInit {
  ads: AdData[] = []; // Full list of ads
  filteredAds: AdData[] = []; // Ads after filtering
  searchQuery: string = ''; // Search query from SearchComponent

  constructor(private adService: AdService) {}

  ngOnInit(): void {
    // Fetch all ads initially
    this.adService.getAllAds().subscribe({
      next: (ads) => {
        this.ads = ads;
        this.filteredAds = ads; // Initially, no filters applied
      },
      error: (err) => console.error('Error fetching ads:', err),
    });
  }

  onFiltersChanged(filters: any) {
    const { categories, sortOption, minPrice, maxPrice } = filters;

    this.filteredAds = this.ads.filter((ad) => {
      const matchesCategory =
        categories.length === 0 || categories.includes(ad.category.toLowerCase());
      const matchesPrice =
        (!minPrice || ad.price >= minPrice) && (!maxPrice || ad.price <= maxPrice);
      return matchesCategory && matchesPrice;
    });

    if (sortOption === 'price-asc') {
      this.filteredAds.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      this.filteredAds.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      // Assuming each ad has a `rating` property
      this.filteredAds.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  }

  onSearch(query: string) {
    this.searchQuery = query.toLowerCase();
    this.filteredAds = this.filteredAds.filter((ad) =>
      ad.title.toLowerCase().includes(this.searchQuery)
    );
  }
}
