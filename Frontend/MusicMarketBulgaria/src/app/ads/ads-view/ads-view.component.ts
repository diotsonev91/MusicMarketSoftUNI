import { Component, OnInit } from '@angular/core';
import { AdService } from '../ad.service';
import { AdData } from '../ad-data.model';
import { FilterComponent } from '../filter/filter.component';
import { SearchComponent } from '../search/search.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdDetailsCardSmComponent } from '../ad-details/ad-details-card-sm/ad-details-card-sm.component';

@Component({
  selector: 'app-ads-view',
  standalone: true,
  imports: [FilterComponent, SearchComponent, AdDetailsCardSmComponent, CommonModule, RouterModule],
  templateUrl: './ads-view.component.html',
  styleUrls: ['./ads-view.component.css'],
})
export class AdsViewComponent implements OnInit {
  ads: AdData[] = []; // Full list of ads
  filteredAds: AdData[] = []; // Ads after filtering
  searchQuery: string = ''; // Search query from SearchComponent

  sortOption = ''
  currentPage: number = 1; // Current page number
  pageSize: number = 20; // Ads per page

  constructor(private adService: AdService) {}

  ngOnInit(): void {
    this.fetchAds(this.currentPage, this.pageSize);
    //console.log("ads inside view ads",this.ads)
  }

  onNextPage(): void {
    this.currentPage++;
    this.fetchAds(this.currentPage, this.pageSize);
  }
  
  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchAds(this.currentPage, this.pageSize);
    }
  }

  fetchAds(page: number, pageSize: number): void {
    this.adService.getAllAds(page, pageSize).subscribe({
      next: (response) => {
        this.ads = response.data; // The ads for the current page
        this.filteredAds = response.data; // Initially, no filters applied
        //console.log('Current Page:', response.currentPage);
        //console.log('Total Pages:', response.totalPages);
      },
      error: (err) => console.error('Error fetching ads:', err),
    });
  }

  onFiltersChanged(filters: any): void {

    this.currentPage = 1

    const { categories, subcategories, sortOption, minPrice, maxPrice } = filters;
    this.sortOption = filters.sortOption;
    // Determine which AdService method to call
    if (categories.length > 0 && minPrice != null && maxPrice != null) {
      // Fetch ads by category, subcategory, and price range
      if(subcategories){
      this.adService
        .getAdsByCategorySubcategoryPriceRange(categories, subcategories, minPrice, maxPrice)
        .subscribe((ads) => this.handleFilterResponse(ads));
      } else{
        this.adService.getAdsByCategoryAndPriceRange(categories, minPrice, maxPrice)
        .subscribe((ads) => this.handleFilterResponse(ads));
      }
    } else if (categories.length > 0) {
      // Fetch ads by category and subcategory
      this.adService
        .getAdsByCategoryAndSubcategory(categories, subcategories)
        .subscribe((ads) => this.handleFilterResponse(ads));
    } else if (minPrice != null && maxPrice != null) {
      // Fetch ads by price range
      this.adService
        .getAdsByPriceRange(minPrice, maxPrice)
        .subscribe((ads) => this.handleFilterResponse(ads));
    } else {
      // No filters, fetch all ads
      this.fetchAds(this.currentPage, 20);
    }
  }
  
  private handleFilterResponse(ads: AdData[]): void {
    this.filteredAds = ads;
  
    // Apply sorting if needed
    this.applySorting(this.filteredAds);
  }


  private applySorting(ads: AdData[]): void {
    
  
    if (this.sortOption === 'price-asc') {
      ads.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'price-desc') {
      ads.sort((a, b) => b.price - a.price);
    } else if (this.sortOption === 'rating') {
      // Assuming each ad has a `rating` property
      ads.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
  
    this.adService.searchAds(this.searchQuery).subscribe({
      next: (ads) => {
        this.filteredAds = ads; // Use the backend search result
      },
      error: (err) => console.error('Error searching ads:', err),
    });
  }
  
}


