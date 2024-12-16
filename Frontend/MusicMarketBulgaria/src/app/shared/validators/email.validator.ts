import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(allowedDomains: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    console.log('Validating:', control.value); // Log the input value
    if (email) {
      // Check if the email contains '@'
      if (!email.includes('@')) {
        console.log("here will return invalid format true")
        return { invalidEmailFormat: true }; 
      }

      // Extract domain and check allowed domains
      const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();
      const isDomainAllowed = allowedDomains.map(d => d.toLowerCase()).includes(domain);

      return isDomainAllowed
        ? null
        : { invalidEmailDomain: { allowedDomains, actualDomain: domain } }; 
    }
    
    return null;
  };
}
