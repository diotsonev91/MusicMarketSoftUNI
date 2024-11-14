// login.component.ts
import { Component } from '@angular/core';
import { SharedFormComponent } from '../../shared/shared-form/shared-form.component';
import { AuthService } from '../auth.service';
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
      (formSubmit)="onLogin($event)"
    ></app-shared-form>
    @if (errorMessage) {
      <p class="error">{{ errorMessage }}</p>
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
      () => {
        this.errorMessage = null;
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }
}
