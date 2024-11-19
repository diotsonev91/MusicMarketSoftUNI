import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule explicitly for ngModel

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule], // Add FormsModule to imports array
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  @Output() search = new EventEmitter<string>(); // Emit the search query

  query: string = ''; // Bind this property to the input field with ngModel

  onSearch() {
    this.search.emit(this.query); // Emit the search query when the button is clicked
  }
}
