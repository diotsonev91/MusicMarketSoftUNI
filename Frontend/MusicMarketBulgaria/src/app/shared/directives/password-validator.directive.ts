import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { passwordStrength, matchPassword } from '../validators/password.validator'; // Import both functions

@Directive({
  selector: '[appPasswordValidator]', // Apply this directive with this selector
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordValidatorDirective implements Validator {
  @Input('appPasswordValidator') levels?: string[]; // Pass custom levels for password strength

  validate(control: AbstractControl): ValidationErrors | null {
    const errors: ValidationErrors = {};

    // Perform password strength validation
    const strengthErrors = passwordStrength(control, this.levels);
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
