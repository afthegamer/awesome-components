import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validValidator(): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const value = ctrl.value;

    if (typeof value === 'string' && value.includes('VALID')) {
      return null;
    }

    return { validValidator: value };
  };
}
