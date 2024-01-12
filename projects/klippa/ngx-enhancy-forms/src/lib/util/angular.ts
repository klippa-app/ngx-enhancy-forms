export function runNextRenderCycle(fn: () => void) {
	setTimeout(fn);
}

export function awaitableForNextCycle(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve);
	});
}
