import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFormComponent } from '../shared-form/shared-form.component';
import { UserData } from '../user-data.model'; // Import RegisterUserData model
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedFormComponent],
  template: `
    <app-shared-form
      [title]="title"
      [fields]="fields"
      [errorMessage]="errorMessage"
      (formSubmit)="onRegister($event)"
    >
    </app-shared-form>
  `,
})
export class RegisterComponent {
  title = 'Регистрация';

  // Define fields dynamically based on RegisterUserData properties
  // Define fields dynamically based on RegisterUserData properties, adding * to required fields
  fields = [
    {
      name: 'username',
      label: 'Потребителско име',
      type: 'text',
      required: true,
    },
    { name: 'email', label: 'Имейл', type: 'email', required: true },
    { name: 'password', label: 'Парола', type: 'password', required: true },
    {
      name: 'confirmPassword',
      label: 'Потвърдете паролата',
      type: 'password',
      required: true,
    },
    { name: 'firstname', label: 'Име', type: 'text', required: false },
    { name: 'lastname', label: 'Фамилия', type: 'text', required: false },
    { name: 'location', label: 'Локация', type: 'text', required: false },
  ].map((field) => ({
    ...field,
    label: field.required ? `${field.label} *` : field.label,
  }));

  errorMessage: string | null = null;

  constructor(private userService: UserService, private router: Router) {}

  onRegister(formData: Partial<UserData & { confirmPassword?: string }>) {
    // Simple check for password confirmation
    if (formData.password !== formData.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    // Call the userService's register method with the form data
    const { confirmPassword, ...userData } = formData; // Exclude confirmPassword
    this.userService.register(userData as UserData).subscribe(
      () => {
        this.errorMessage = null;
        this.router.navigate(['/login']); // Redirect on successful registration
      },
      (error: HttpErrorResponse) => {
        // console.log('Full error response:', error);
        // console.log('Backend error message:', error.error?.error);
        this.errorMessage =
          error.error?.error || 'An unexpected error occurred';
      }
    );
  }
}
