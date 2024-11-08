import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service'; 
import { FormsModule } from '@angular/forms';
import { UserCredentials } from '../../auth/user-credentials.model'; // Adjust path as needed

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule], 
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = ''; // Added confirmPassword property
  username = '';
  firstname = '';
  lastname = '';
  location = '';
  message = '';

  constructor(private authService: AuthService) {}

  // Method to handle registration
  onRegister() {
    // Check if password and confirmPassword match
    if (this.password !== this.confirmPassword) {
      this.message = "Passwords do not match.";
      return;
    }

    // Create a UserCredentials object for email and password
    const credentials: UserCredentials = {
      email: this.email,
      password: this.password
    };

    // Create an object for additional user profile data
    const userData = {
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
      location: this.location
    };

    // Call AuthService to register with both credentials and user profile data
    this.authService.signUp(credentials, userData).subscribe({
      next: () => {
        this.message = 'Registration successful!';
      },
      error: (error) => {
        this.message = `Registration failed: ${error.message}`;
      }
    });
  }
}
