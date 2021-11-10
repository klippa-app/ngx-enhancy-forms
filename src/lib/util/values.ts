import { isString } from 'lodash';

export function stringIsSetAndNotEmpty(s: string) {
	return isString(s) && s.length > 0;
}

export function isNullOrUndefined(value: any) {
	return value === null || value === undefined;
}

export function numberIsSet(value: any) {
	return isValueSet(value) && typeof value === 'number';
}

export function isValueSet(value: any) {
	return value !== null && value !== undefined;
}

export function stringOrArrayIsSetAndEmpty(value: any[] | string) {
	return value !== null && value !== undefined && value.length === 0;
}

export function useIfStringIsSet(s: string) {
	if (stringIsSetAndNotEmpty(s)) {
		return s;
	}
	return undefined;
}

export function useIfArrayIsSetWithOneItem(a: Array<any>): any {
	if (!isNullOrUndefined(a) && a.length === 1) {
		return a[0];
	}
	return undefined;
}

export function convertParentToChild<C>(originalClass: any, newClass: C): C {
	return Object.assign(newClass, originalClass);
}

export function truncateString(s: string, length: number) {
	if (s.length < length) {
		return s;
	}
	return s.substring(0, length) + '...';
}
