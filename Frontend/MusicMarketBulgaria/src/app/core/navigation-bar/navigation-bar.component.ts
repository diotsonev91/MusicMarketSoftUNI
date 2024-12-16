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
  // Define navigation links with their respective routes and flags
  navLinks = [
    { label: 'About', route: '/', requiresAuth: false, hideWhenLoggedIn: false },
    { label: 'Ads', route: '/ads-view', requiresAuth: false, hideWhenLoggedIn: false },
    { label: 'Profile', route: '/profile', requiresAuth: true, hideWhenLoggedIn: false },
    { label: 'Chat', route: '/chat', requiresAuth: true, hideWhenLoggedIn: false },
    { label: 'Login', route: '/login', requiresAuth: false, hideWhenLoggedIn: true },
    { label: 'Register', route: '/register', requiresAuth: false, hideWhenLoggedIn: true },
    { label: 'Logout', route: '/logout', requiresAuth: true, hideWhenLoggedIn: false },
  ];

  constructor(private authService: AuthService) {}

  // Determine if a link should be displayed based on the user's authentication status
  shouldDisplayLink(link: { label: string; route: string; requiresAuth: boolean; hideWhenLoggedIn: boolean }): boolean {
    const isLoggedIn = this.authService.isLoggedIn();

    if (link.requiresAuth && !isLoggedIn) {
      // Link requires authentication but user is not logged in
      return false;
    }

    if (link.hideWhenLoggedIn && isLoggedIn) {
      // Link should be hidden for logged-in users
      return false;
    }

    // Default: Show the link
    return true;
  }
 
}
