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
      () => {
        this.errorMessage = null;
        this.router.navigate(['/profile']);
      },
      (error) => {
        this.errorMessage = error.error?.error || 'An unexpected error occurred';;
      }
    );
  }
}
