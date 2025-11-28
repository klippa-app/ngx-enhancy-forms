import {AfterViewInit, Directive, ElementRef, Input, OnDestroy} from "@angular/core";
import {awaitableForNextCycle} from "./util/angular";
import {isValueSet} from "./util/values";


@Directive({
    selector: '[elementIsTruncatedCb]',
    standalone: false
})
export class ElementIsTruncatedCbComponent implements AfterViewInit, OnDestroy {
	private observer: MutationObserver;

	@Input() elementIsTruncatedCb = (isTruncated: boolean) => {};
	constructor(private elementRef: ElementRef) {

	}

	ngAfterViewInit(): void {
		if (!isValueSet(this.elementIsTruncatedCb)) {
			return;
		}

		const targetNode = this.elementRef.nativeElement;

		const observerOptions = {
			childList: true,
			attributes: true,
			subtree: true
		};

		const callback = () => {
			this.checkForTruncation();
		};

		this.observer = new MutationObserver(callback);
		this.observer.observe(targetNode, observerOptions);
		this.checkForTruncation();
	}

	private async checkForTruncation(): Promise<void> {
		await awaitableForNextCycle();
		const isTruncated = this.isTruncated(this.elementRef.nativeElement);
		if (isValueSet(isTruncated)) {
			this.elementIsTruncatedCb(isTruncated);
		}
	}

	private isTruncated(element: HTMLElement): boolean {
		if (!(element.scrollWidth > 0)) {
			return;
		}
		const thisElementIsTruncated = element.scrollWidth > element.clientWidth;
		if (!thisElementIsTruncated) {
			return Array.from(element.children).some((child) => this.isTruncated(child as HTMLElement));
		}
		return thisElementIsTruncated;
	}

	ngOnDestroy(): void {
		this.observer?.disconnect();
	}
}
