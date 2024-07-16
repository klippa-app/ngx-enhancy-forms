export function getAllLimitingContainers(element: Element): Array<HTMLElement> {
	const result = [];
	let current = element;
	while (current.parentElement) {
		if (isLimitingContainer(current.parentElement)) {
			result.push(current.parentElement);
		}
		current = current.parentElement;
	}
	return result;
}

export function isLimitingContainer(element: Element): boolean {
	return element.scrollHeight > element.clientHeight;
}
