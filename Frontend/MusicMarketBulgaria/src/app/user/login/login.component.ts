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
    <div class="login-image-container">
  <img
    src="images/login-image.webp"
    alt="Login illustration"
    class="login-image"
  />
</div>
  `,
  styles: `
 .login-image-container {
  display: flex;
  justify-content: center; /* Centers the image horizontally */
  animation: fall-down 2s ease-in-out forwards; /* Add animation */
}

.login-image {
  width: 500px;
  height: 300px;
  margin-top: -300px;
  object-fit: cover; /* Ensures the image maintains its aspect ratio */
  border-radius: 8px; /* Optional: Adds rounded corners */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Optional: Adds a subtle shadow */
}

/* Keyframes for the falling and disappearing animation */
@keyframes fall-down {
  0% {
    transform: translateY(0); /* Start at the original position */
   
  }
  50% {
    transform: translateY(290px); /* End 500px lower */
  
  }
  100% {
    transform: translateY(300px); /* Stay at the final position */
   
   
  }
}
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
