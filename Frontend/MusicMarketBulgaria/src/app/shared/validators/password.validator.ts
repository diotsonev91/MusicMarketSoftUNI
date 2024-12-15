import { AbstractControl, ValidationErrors } from '@angular/forms';

function passwordStrength(control: AbstractControl, levels?: string[]): ValidationErrors | null {
  const password = control.value;

  const allValidations = [
    { level: 'minLength', test: (pwd: string) => pwd.length >= 5, errorKey: 'minLength' },
    { level: 'hasUpperCase', test: (pwd: string) => /[A-Z]/.test(pwd), errorKey: 'hasUpperCase' },
    { level: 'hasNumericChar', test: (pwd: string) => /[0-9]/.test(pwd), errorKey: 'hasNumericChar' },
    // { level: 'hasSpecialChar', test: (pwd: string) => /[!@#$^&*(),.?":{}|<>]/.test(pwd), errorKey: 'hasSpecialChar' },
  ];

  // Filter validations based on the levels provided, or use all validations if no levels are specified
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
