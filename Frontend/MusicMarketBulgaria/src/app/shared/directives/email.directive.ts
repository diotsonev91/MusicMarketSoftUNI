import { Directive, Input, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { emailValidator } from '../validators/email.validator';
import { environment } from '../../../environments/environment';

const EMAIL_PROVIDER: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => EmailDirective),
  multi: true,
};

@Directive({
  selector: '[appEmailDomain]',
  providers: [EMAIL_PROVIDER],
  standalone: true,
})
export class EmailDirective implements Validator {
  private allowedDomains = [...environment.allowedDomains];

  @Input('appEmailDomain') fieldType: string = '';

  validate(control: AbstractControl): ValidationErrors | null {
    // Skip validation if field type is not email
    if (this.fieldType !== 'email') {
      return null;
    }

    // Validate the email using the emailValidator
    return emailValidator(this.allowedDomains)(control);
  }
}
