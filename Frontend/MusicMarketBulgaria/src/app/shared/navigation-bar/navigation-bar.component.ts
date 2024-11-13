import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})

export class NavigationBarComponent {
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
