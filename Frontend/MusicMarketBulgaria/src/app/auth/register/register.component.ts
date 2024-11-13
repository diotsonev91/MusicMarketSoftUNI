// register.component.ts
import { Component } from '@angular/core';
import { SharedFormComponent } from '../../shared/shared-form/shared-form.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedFormComponent],
  template: `<app-shared-form [title]="title" [fields]="fields" (formSubmit)="onRegister($event)"></app-shared-form>`,
})
export class RegisterComponent {
  title = 'Регистрация';
  fields = [
    { name: 'username', label: 'Потребителско име', type: 'text', required: true },
    { name: 'email', label: 'Имейл', type: 'email', required: true },
    { name: 'password', label: 'Парола', type: 'password', required: true },
    { name: 'confirmPassword', label: 'Потвърдете паролата', type: 'password', required: true },
  ];

  onRegister(formData: any) {
    console.log('Register form data:', formData);
  }
}
