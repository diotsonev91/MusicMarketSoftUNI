import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { passwordStrength, matchPassword } from '../validators/password.validator';

@Directive({
  selector: '[appPasswordValidator]', // Apply this directive with this selector
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordValidatorDirective implements Validator {
  // Add an input to dynamically accept the field type
  @Input('appPasswordValidator') fieldType: string = '';

  validate(control: AbstractControl): ValidationErrors | null {
    // Check if the field type is 'password'
    if (this.fieldType !== 'password') {
      return null; // Skip validation for non-password fields
    }

    const errors: ValidationErrors = {};

    // Perform password strength validation
    const strengthErrors = passwordStrength(control);
    if (strengthErrors) {
      Object.assign(errors, strengthErrors);
    }

    // Perform password match validation
    const matchErrors = matchPassword(control);
    if (matchErrors) {
      Object.assign(errors, matchErrors);
    }

    return Object.keys(errors).length ? errors : null;
  }
}
