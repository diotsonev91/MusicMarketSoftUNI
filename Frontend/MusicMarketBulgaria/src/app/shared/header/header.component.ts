// src/app/shared/header/header.component.ts
import { Component } from '@angular/core';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavigationBarComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
 
}
