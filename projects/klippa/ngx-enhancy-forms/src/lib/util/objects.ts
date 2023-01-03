function mergeArray(arrA: Array<any>, arrB: Array<any>): Array<any> {
	const arr = new Array(Math.max(arrA.length, arrB.length));

	for (let i = 0; i < arr.length; i++) {
		if (typeof arrA[i] === 'object' && typeof arrB[i] === 'object') {
			arr[i] = deepMerge(arrA[i], arrB[i]);
		} else {
			arr[i] = arrB[i] ?? arrA[i];
		}
	}

	return arr;
}

export function deepMerge<
	A extends Object | Array<any>,
	B extends Object | Array<any>
>(objA: A, objB: B): A | B {
	if (Array.isArray(objA) || Array.isArray(objB)) {
		if (Array.isArray(objA) && Array.isArray(objB)) {
			return mergeArray(objA, objB) as A | B;
		}

		// if a and b differ in type, prefer b.
		return objB ?? objA;
	}

	const merged: A | B = {} as A | B;

	const keys = new Set<keyof A | keyof B>([
		...Object.keys(objA),
		...Object.keys(objB),
	] as Array<keyof A | keyof B>);

	keys.forEach((key) => {
		const a = objA[key as keyof A];
		const b = objB[key as keyof B];

		if (typeof a === 'object' && typeof b === 'object') {
			merged[key as keyof (A | B)] = deepMerge(a as any, b as any) as any;
			return;
		}

		// if a and b differ in type, prefer b.
		merged[key as keyof (A | B)] = (b ?? a) as any;
	});

	return merged;
}
