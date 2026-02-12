import {InjectionToken} from '@angular/core';

export type FormSize = 'small' | 'medium' | 'large';

export type SizeClass = 'input-sm' | 'input-md' | 'input-lg';

export function GetSizeClass(size: FormSize): SizeClass {
	switch (size) {
		case 'small':
			return 'input-sm';
		case 'medium':
			return 'input-md';
		case 'large':
			return 'input-lg';
	}
}

export const KLP_FORM_DEFAULT_SIZE = new InjectionToken<FormSize>('KLP_FORM_DEFAULT_SIZE');

export const DefaultSize = 'medium';
