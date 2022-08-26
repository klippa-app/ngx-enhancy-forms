import { AbstractControl, ValidationErrors } from '@angular/forms';

export const invalidTimeKey = '--invalid_time--';

export function timeValidator(control: AbstractControl): ValidationErrors | null {
	const invalid = control.value === invalidTimeKey;
	return invalid ? { date: control.value } : null;
}
