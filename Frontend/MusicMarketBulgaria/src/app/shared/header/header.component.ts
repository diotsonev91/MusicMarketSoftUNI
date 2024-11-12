// src/app/shared/header/header.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Login', route: '/login' },
    { label: 'Register', route: '/register' },
  ];

  shouldDisplayLink(link: any): boolean {
    // Sample logic for conditional display
    return true;
  }
}
