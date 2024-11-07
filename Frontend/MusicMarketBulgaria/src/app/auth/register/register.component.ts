import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [FormsModule], 
})
export class RegisterComponent {
  email = '';
  password = '';
  message = '';

  constructor(private authService: AuthService) {}
//SIMPLE IMPLEMENTATION FOR BASIC FUNCTIONALITY TEST ONLY
  onRegister() {
    this.authService.signUp(this.email, this.password)
      .subscribe({
        next: () => {
          this.message = 'Registration successful!';
        },
        error: (error) => {
          this.message = `Registration failed: ${error.message}`;
        }
      });
    }
}
