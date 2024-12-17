import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service'; // Adjust the import path as necessary
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'] // Corrected to 'styleUrls'
})
export class NavigationBarComponent implements OnInit{


  userId: string = '';

  navLinks: Array<{ label: string; route: string; requiresAuth: boolean; hideWhenLoggedIn: boolean }> = [];

  constructor(private authService: AuthService, private userService: UserService) {}
  ngOnInit(): void {
    this.userId = this.userService.getCurrentUserId() || '';
  // Define navigation links with their respective routes and flags
  this.navLinks = [
    { label: 'About', route: '/', requiresAuth: false, hideWhenLoggedIn: false },
    { label: 'Ads', route: '/ads-view', requiresAuth: false, hideWhenLoggedIn: false },
    { label: 'Profile', route: `/profile/${this.userId}`, requiresAuth: true, hideWhenLoggedIn: false },
    { label: 'Chat', route: '/chat', requiresAuth: true, hideWhenLoggedIn: false },
    { label: 'Login', route: '/login', requiresAuth: false, hideWhenLoggedIn: true },
    { label: 'Register', route: '/register', requiresAuth: false, hideWhenLoggedIn: true },
    { label: 'Logout', route: '/logout', requiresAuth: true, hideWhenLoggedIn: false },
  ];

  }

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
