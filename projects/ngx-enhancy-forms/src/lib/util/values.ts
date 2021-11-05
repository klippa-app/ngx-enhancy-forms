import {isString} from 'lodash';

export function stringIsSetAndNotEmpty(s: string): boolean {
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

export function stringOrArrayIsSetAndEmpty(value: any[] | string): boolean  {
	return value !== null && value !== undefined && value.length === 0;
}

export function useIfStringIsSet(s: string): string {
	if (stringIsSetAndNotEmpty(s)) {
		return s;
	}
	return undefined;
}

export function useIfArrayIsSetWithOneItem<T>(a: T[]): T {
	if (!isNullOrUndefined(a) && a.length === 1) {
		return a[0];
	}
	return undefined;
}

export function convertParentToChild<C>(originalClass: any, newClass: C): C {
	return Object.assign(newClass, originalClass);
}

export function truncateString(s: string, length: number): string {
	if (s.length < length) {
		return s;
	}
	return s.substring(0, length) + '...';
}
