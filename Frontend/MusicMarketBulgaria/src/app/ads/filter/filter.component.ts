import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  categories = [
    { id: 'guitars', name: 'Китари', selected: false },
    { id: 'pianos', name: 'Пиана', selected: false },
    { id: 'microphones', name: 'Микрофони', selected: false },
    { id: 'speakers', name: 'Тонколони', selected: false },
  ];

  sortOption: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  @Output() filtersChanged = new EventEmitter<any>();

  applyFilters() {
    const selectedCategories = this.categories
      .filter((category) => category.selected)
      .map((category) => category.id);

    this.filtersChanged.emit({
      categories: selectedCategories,
      sortOption: this.sortOption,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    });
  }
}
