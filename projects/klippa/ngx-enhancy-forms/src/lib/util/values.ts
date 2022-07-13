import { isString } from 'lodash';

export function stringIsSetAndFilled(s: string) {
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

export function removeDuplicatesFromArray(array: Array<any>) {
	return array.filter((c, i) => {
		const firstOccurrenceIndex = array.findIndex((c2) => c2 === c);
		return i === firstOccurrenceIndex;
	});
}

export function stringOrArrayIsSetAndEmpty(value: any[] | string) {
	return value !== null && value !== undefined && value.length === 0;
}

export function truncateString(s: string, length: number) {
	if (s.length < length) {
		return s;
	}
	return s.substring(0, length) + '...';
}

export function arrayIsSetAndFilled(arr: any): boolean {
	return Array.isArray(arr) && arr !== null && arr !== undefined && arr.length > 0;
}
