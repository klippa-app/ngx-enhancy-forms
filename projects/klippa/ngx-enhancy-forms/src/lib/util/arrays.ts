import { isArray } from 'lodash-es';
import { isValueSet } from './values';

export function removeDuplicatesFromArraysWithComparator(comparator: (e1: any, e2: any) => boolean, ...arrays: any[]): any {
	let combined = [];

	for (const array of arrays) {
		combined = combined.concat(array);
	}

	return combined.filter((c, i) => {
		const firstOccurrenceIndex = combined.findIndex((c2) => comparator(c, c2));
		return i === firstOccurrenceIndex;
	});
}

export function removeDuplicatesFromArray<T>(array: Array<T>): Array<T> {
	return array.filter((c, i) => {
		const firstOccurrenceIndex = array.findIndex((c2) => c2 === c);
		return i === firstOccurrenceIndex;
	});
}

export function insertAtIndex(arr, index, item): void {
	arr.splice(index, 0, item);
}

export function arrayIsSetAndFilled(arr: any): boolean {
	return isArray(arr) && arr !== null && arr !== undefined && arr.length > 0;
}

export function asArray(value: any): Array<any> {
	if (isValueSet(value)) {
		if (Array.isArray(value)) {
			return value;
		}
		return [value];
	}
	return [];
}

export function splitArrayByCondition<T>(value: Array<T>, condition: (current: T) => boolean): Array<Array<T>> {
	return value.reduce((acc, cur) => {
		if (condition(cur)) {
			acc.push([]);
		} else {
			acc[acc.length - 1].push(cur);
		}
		return acc;
	}, [[]]);
}
