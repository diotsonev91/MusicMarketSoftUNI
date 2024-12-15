import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service'; // Adjust the import path as necessary

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'] // Corrected to 'styleUrls'
})
export class NavigationBarComponent {
  // Define navigation links with their respective routes and authentication requirements
  navLinks = [
    { label: 'About', route: '/', requiresAuth: false  },
    { label: 'Ads', route: '/ads-view', requiresAuth: false },
    { label: 'Login', route: '/login', requiresAuth: false },
    { label: 'Register', route: '/register', requiresAuth: false },
    { label: 'Logout', route: '/logout', requiresAuth: true },
    
  ];

  constructor(private authService: AuthService) {}

  // Determine if a link should be displayed based on the user's authentication status
  shouldDisplayLink(link: { label: string; route: string; requiresAuth: boolean }): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    return link.requiresAuth === isLoggedIn;
  }

 
}
