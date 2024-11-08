import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service'; 
import { FormsModule } from '@angular/forms'; 
import { UserCredentials } from '../../auth/user-credentials.model'; 
import {UserCredential} from '@angular/fire/auth';
//!for test only! will print here the user data from DB 
import { UserService } from '../../user/user.service'; // Import UserService
import { User } from '../../user/user.model'; // Import User interface


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule] 
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';

  userCredential: UserCredential | null = null; 

  constructor(private authService: AuthService) {}

  
  onLogin() {
    const credentials: UserCredentials = {
      email: this.email,
      password: this.password
    };

    this.authService.signIn(credentials)
      .subscribe({
        next: (userCredential) => {
          if (userCredential) {
            this.userCredential = userCredential; // Store full user data
            this.message = 'Login successful!';
            console.log('Full user data:', this.userCredential);

            // Get the ID token (access token) asynchronously
            userCredential.user.getIdToken().then((token) => {
              console.log('Access Token:', token);
            }).catch((error) => {
              console.error('Error fetching access token:', error);
            });

            // Example: Access other fields from userCredential
            console.log('User UID:', this.userCredential.user.uid);
            console.log('User email:', this.userCredential.user.email);
          } else {
            this.message = 'Login failed: Invalid credentials';
          }
          
        },
        error: (error) => {
          this.message = `Login failed: ${error.message}`;
        }
      });
    this.authService.signIn(credentials)
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
