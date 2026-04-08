import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  };
}