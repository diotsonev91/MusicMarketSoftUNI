import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { UserData } from '../user-data.model';
import { SharedFormComponent } from '../shared-form/shared-form.component';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [SharedFormComponent],
  template: `
    <app-shared-form
      #sharedForm
      [title]="title"
      [fields]="fields"
      [errorMessage]="errorMessage"
      (formSubmit)="onEditUser($event)">
    </app-shared-form>
    <div class="dangerous-zone-container">
      <h2 class="dangerous-zone-heading">Danger zone</h2>
      <h2 class="dangerous-zone-heading">-------------------</h2>
      <button class="delete-button" (click)="deleteProfile()">Delete Profile</button>
    </div>
  `,
  styleUrls: ['./edit-user.component.css'], // Optional for styling
})
export class EditUserComponent implements OnInit {
  @ViewChild('sharedForm') sharedForm!: SharedFormComponent; // Reference to SharedFormComponent

  title = 'Edit Profile';
  fields = [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'firstname', label: 'First Name', type: 'text', required: false },
    { name: 'lastname', label: 'Last Name', type: 'text', required: false },
    { name: 'location', label: 'Location', type: 'text', required: false },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'New Password', type: 'password', required: false },
    { name: 'confirmPassword', label: 'Confirm New Password', type: 'password', required: false },

  ].map((field) => ({
    ...field,
    label: field.required ? `${field.label} *` : field.label,
  }));

  errorMessage: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngAfterViewInit(): void {
    this.loadUserProfile();
  }

 /**
   * Fetch the logged-in user's profile using `user$` observable.
   */
 loadUserProfile(): void {
  
  this.userService.getCurrentUser$().subscribe(
    (user) => {
      if (user) {
        const formValues = Object.keys(user).reduce((values, key) => {
          values[key] = user[key as keyof UserData] || '';
          return values;
        }, {} as { [key: string]: any });

        if (this.sharedForm) {
          console.log("have shared form see values", formValues)
          this.sharedForm.updateFormValues(formValues); // Populate the form with user data
        }
      }
    },
    (error) => {
      this.errorMessage = 'Failed to load user data.';
      console.error(error);
    }
  );
}

  onEditUser(updatedData: Partial<UserData & { password?: string; confirmPassword?: string }>): void {
    console.log("EDIT USER COMPONENT WORKS")
    delete updatedData.confirmPassword; // Remove confirmPassword before sending to the server

    this.userService.updateLoggedUserProfile(updatedData).subscribe(
      () => {
        this.errorMessage = null;
        this.router.navigate(['/profile']); // Navigate to profile after successful update
      },
      (error) => {
        this.errorMessage = error.error?.error || 'Failed to update profile.';
        console.error(error);
      }
    );
  }

  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      this.userService.deleteLoggedUser().subscribe(
        () => {
          alert('Profile deleted successfully.');
          this.router.navigate(['/']); // Redirect to home or login after deletion
        },
        (error) => {
          this.errorMessage = error.error?.error || 'Failed to delete profile.';
          console.error(error);
        }
      );
    }
  }
}
