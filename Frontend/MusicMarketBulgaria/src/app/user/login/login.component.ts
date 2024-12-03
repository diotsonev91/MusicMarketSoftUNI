// login.component.ts
import { Component } from '@angular/core';
import { SharedFormComponent } from '../shared-form/shared-form.component';
import { AuthService } from '../../auth/auth.service';
import { UserCredentials } from '../user-credentials.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedFormComponent], 
  template: `
    <app-shared-form
      [title]="title"
      [fields]="fields"
      [errorMessage]="errorMessage"
      (formSubmit)="onLogin($event)"
    ></app-shared-form>
  `
})
export class LoginComponent {
  title = 'Вход';
  fields = [
    { name: 'email', label: 'Имейл', type: 'email', required: true },
    { name: 'password', label: 'Парола', type: 'password', required: true },
  ];
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(formData: UserCredentials): void {
    this.authService.login(formData).subscribe(
      (response) => {
        this.errorMessage = null;
        
        const userId = response.currentUser._id; // Extract userId from the response
        if (userId) {
          // Navigate to the profile route with the userId as a parameter
          this.router.navigate(['/profile', userId]);
        } else {
          console.error('User ID is missing from the login response');
        }
      },
      (error) => {
        this.errorMessage = error.error?.error || 'An unexpected error occurred';
      }
    );
  }
}
