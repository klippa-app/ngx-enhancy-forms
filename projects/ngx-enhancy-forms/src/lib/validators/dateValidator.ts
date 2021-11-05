import {AbstractControl, ValidationErrors} from '@angular/forms';

export const invalidDateKey = '--invalid_date--';

export function dateValidator(control: AbstractControl): ValidationErrors | null {
	const invalid = control.value === invalidDateKey;
	return invalid ? {date: control.value} : null;
}
