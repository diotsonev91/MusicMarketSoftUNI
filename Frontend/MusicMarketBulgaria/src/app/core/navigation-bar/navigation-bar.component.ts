import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
})
export class NavigationBarComponent implements OnInit {
  userId: string | null = null;

  navLinks: Array<{
    label: string;
    route: string;
    requiresAuth: boolean;
    hideWhenLoggedIn: boolean;
  }> = [];

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Fetch the user ID asynchronously
    this.userService.getCurrentUserIdAsync().subscribe((id) => {
      this.userId = id;
      this.updateNavLinks(); // Update navigation links after fetching userId
    });

    this.updateNavLinks(); // Initialize navLinks with default or null userId
  }

  private updateNavLinks(): void {
    this.navLinks = [
      {
        label: 'About',
        route: '/',
        requiresAuth: false,
        hideWhenLoggedIn: false,
      },
      {
        label: 'Ads',
        route: '/ads-view',
        requiresAuth: false,
        hideWhenLoggedIn: false,
      },
      {
        label: 'Profile',
        route: `/profile/${this.userId || ''}`,
        requiresAuth: true,
        hideWhenLoggedIn: false,
      },
      {
        label: 'Chat',
        route: '/chat',
        requiresAuth: true,
        hideWhenLoggedIn: false,
      },
      {
        label: 'Login',
        route: '/login',
        requiresAuth: false,
        hideWhenLoggedIn: true,
      },
      {
        label: 'Register',
        route: '/register',
        requiresAuth: false,
        hideWhenLoggedIn: true,
      },
      {
        label: 'Logout',
        route: '/logout',
        requiresAuth: true,
        hideWhenLoggedIn: false,
      },
    ];
  }

  shouldDisplayLink(link: {
    label: string;
    route: string;
    requiresAuth: boolean;
    hideWhenLoggedIn: boolean;
  }): boolean {
    const isLoggedIn = this.authService.isLoggedIn();

    if (link.requiresAuth && !isLoggedIn) {
      return false;
    }

    if (link.hideWhenLoggedIn && isLoggedIn) {
      return false;
    }

    return true;
  }
}
