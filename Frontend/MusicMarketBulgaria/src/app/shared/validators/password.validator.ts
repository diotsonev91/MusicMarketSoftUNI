import { AbstractControl, ValidationErrors } from '@angular/forms';
import { environment } from '../../../environments/environment';

function passwordStrength(control: AbstractControl): ValidationErrors | null {
  const password = control.value;
  console.log("INSIDE PASSWORD VALIDATOR")
  // Retrieve levels from environment configuration
  const levels = environment.passwordValidationLevels;

  const allValidations = [
    { level: 'minLength', test: (pwd: string) => pwd.length >= 5, errorKey: 'minLength' },
    { level: 'hasUpperCase', test: (pwd: string) => /[A-Z]/.test(pwd), errorKey: 'hasUpperCase' },
    { level: 'hasNumericChar', test: (pwd: string) => /[0-9]/.test(pwd), errorKey: 'hasNumericChar' },
    { level: 'hasSpecialChar', test: (pwd: string) => /[!@#$^&*(),.?":{}|<>]/.test(pwd), errorKey: 'hasSpecialChar' },
  ];

  // Filter validations based on the levels from environment
  const validations = levels
    ? allValidations.filter(({ level }) => levels.includes(level))
    : allValidations;

  const validationErrors: ValidationErrors = {};
  let isPasswordValid = true;

  validations.forEach(({ level, test, errorKey }) => {
    if (test(password)) {
      validationErrors[errorKey] = false;
    } else {
      validationErrors[errorKey] = true;
      isPasswordValid = false;
    }
  });

  return isPasswordValid ? null : validationErrors;
}

function matchPassword(control: AbstractControl): ValidationErrors | null {
  const confirmPassword = control.value;
  const password = control?.parent?.get('password')?.value;
  if (!password) return null;

  return confirmPassword === password ? null : { mismatch: true };
}

export { passwordStrength, matchPassword };
