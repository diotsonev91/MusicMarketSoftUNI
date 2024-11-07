import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service'; // Adjust path as needed
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule] 
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';

  constructor(private authService: AuthService) {}
//SIMPLE IMPLEMENTATION FOR BASIC FUNCTIONALITY TEST ONLY
  onLogin() {
    this.authService.signIn(this.email, this.password)
      .subscribe({
        next: () => {
          this.message = 'Login successful!';
        },
        error: (error) => {
          this.message = `Login failed: ${error.message}`;
        }
      });
  }
}
