import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmEqualValidator(main: string, confirm: string): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const mainCtrl = ctrl.get(main);
    const confirmCtrl = ctrl.get(confirm);

    if (!mainCtrl || !confirmCtrl) {
      return { confirmEqual: 'Invalid control names' };
    }

    const mainValue = mainCtrl.value;
    const confirmValue = confirmCtrl.value;

    // Ne déclenche pas l'erreur tant que l'un des champs est vide
    if (mainValue == null || mainValue === '' || confirmValue == null || confirmValue === '') {
      return null;
    }

    return mainValue === confirmValue ? null : { confirmEqual: true };
  };
}
