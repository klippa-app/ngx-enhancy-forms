import { isString } from 'lodash-es';

export function stringIsSetAndFilled(s: string): boolean {
	return isString(s) && s.length > 0;
}

export function isNullOrUndefined(value: any): boolean {
	return value === null || value === undefined;
}

export function numberIsSet(value: any): boolean {
	return isValueSet(value) && typeof value === 'number';
}

export function isValueSet(value: any): boolean {
	return value !== null && value !== undefined;
}

export function stringOrArrayIsSetAndEmpty(value: any[] | string): boolean {
	return value !== null && value !== undefined && value.length === 0;
}

export function truncateString(s: string, length: number): string {
	if (s.length < length) {
		return s;
	}
	return s.substring(0, length) + '...';
}

