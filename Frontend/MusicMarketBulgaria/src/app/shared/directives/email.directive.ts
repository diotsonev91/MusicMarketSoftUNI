// email-domain.directive.ts
import { Directive, Input, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { emailValidator } from '../validators/email.validator';

const EMAIL_PROVIDER: any = {
    provider: NG_VALIDATORS,
    useExisting: forwardRef(() => EmailDirective), 
    multi: true
}

@Directive({
  selector: '[appEmailDomain]',
  providers: [
   EMAIL_PROVIDER
  ],
  standalone: true,
})
export class EmailDirective implements Validator {
  @Input('appEmailDomain') allowedDomains: string[] = [];

  validate(control: AbstractControl): ValidationErrors | null {
    return emailValidator(this.allowedDomains)(control);
  }
}
