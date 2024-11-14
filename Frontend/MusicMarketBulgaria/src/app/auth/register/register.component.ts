import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SharedFormComponent } from '../../shared/shared-form/shared-form.component';
import { RegisterUserData } from '../register-user-data.model'; // Import RegisterUserData model

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedFormComponent],
  template: `
   <app-shared-form 
      [title]="title" 
      [fields]="fields" 
      (formSubmit)="onRegister($event)">
      [errorMessage]="errorMessage"
    </app-shared-form>
    
  `,
  styles: [`.error {
    color: red;
    
    display: flex;
    justify-content: center;
}`]
  
})
export class RegisterComponent {
  title = 'Регистрация';
  
  // Define fields dynamically based on RegisterUserData properties
  // Define fields dynamically based on RegisterUserData properties, adding * to required fields
  fields = [
    { name: 'username', label: 'Потребителско име', type: 'text', required: true },
    { name: 'email', label: 'Имейл', type: 'email', required: true },
    { name: 'password', label: 'Парола', type: 'password', required: true },
    { name: 'confirmPassword', label: 'Потвърдете паролата', type: 'password', required: true },
    { name: 'firstName', label: 'Име', type: 'text', required: false },
    { name: 'lastName', label: 'Фамилия', type: 'text', required: false },
    { name: 'location', label: 'Локация', type: 'text', required: false },
  ].map(field => ({ 
    ...field, 
    label: field.required ? `${field.label} *` : field.label 
  }));

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(formData: Partial<RegisterUserData & { confirmPassword?: string }>) {
    // Simple check for password confirmation
    if (formData.password !== formData.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    // Call the AuthService's register method with the form data
    const { confirmPassword, ...userData } = formData; // Exclude confirmPassword
    this.authService.register(userData as RegisterUserData).subscribe(
      () => {
        this.errorMessage = null;
        this.router.navigate(['/login']); // Redirect on successful registration
      },
      (errorResponse) => {
       
          this.errorMessage = errorResponse.error; 
  
      }
    );
  }
}
