import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Categories } from '../ad_enums/categories.enum';
import { SubCategories } from '../ad_enums/subCategories.enum';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  categories = Object.entries(Categories).map(([key, value]) => ({
    id: key,
    name: value,
    selected: false,
  }));

  subcategories: { [key: string]: string[] } = {
    [Categories.INSTRUMENT]: [
      SubCategories.PERCUSSION,
      SubCategories.WOODWIND,
      SubCategories.STRING,
      SubCategories.BRASS,
      SubCategories.KEYBOARD,
    ],
    [Categories.MUSIC_TECHNIQUE]: [SubCategories.STUDIO, SubCategories.PA],
    [Categories.ACCESSORIES]: [SubCategories.OTHERS],
  };

  activeCategory: string | null = null; // Tracks the active category
  selectedSubcategories: string[] = []; // Tracks selected subcategories
  sortOption: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  @Output() filtersChanged = new EventEmitter<any>();

  applyFilters() {
    const selectedCategories = this.categories
      .filter((category) => category.selected)
      .map((category) => category.name);

    this.filtersChanged.emit({
      categories: selectedCategories,
      subcategories: this.selectedSubcategories, // Include selected subcategories
      sortOption: this.sortOption,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    });

    console.log('Applied Filters:', {
      categories: selectedCategories,
      subcategories: this.selectedSubcategories,
      sortOption: this.sortOption,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    });
  }

  toggleSubcategories(categoryId: string): void {
    this.activeCategory = this.activeCategory === categoryId ? null : categoryId;
    this.selectedSubcategories = []; // Reset subcategories when toggling categories
  }

  selectSubcategory(subCategory: string): void {
    const index = this.selectedSubcategories.indexOf(subCategory);
    if (index > -1) {
      this.selectedSubcategories.splice(index, 1); // Deselect subcategory
    } else {
      this.selectedSubcategories.push(subCategory); // Select subcategory
    }
  }
}
