export function runNextRenderCycle(fn: () => void): void {
	setTimeout(fn);
}

export function awaitableForNextCycle(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve);
	});
}
