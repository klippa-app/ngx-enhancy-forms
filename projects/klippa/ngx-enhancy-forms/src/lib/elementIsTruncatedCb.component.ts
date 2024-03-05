import {AfterViewInit, Directive, ElementRef, Input} from "@angular/core";
import {awaitableForNextCycle} from "./util/angular";
import {isValueSet} from "./util/values";


@Directive({
	selector: '[elementIsTruncatedCb]'
})
export class ElementIsTruncatedCbComponent implements AfterViewInit {
	@Input() elementIsTruncatedCb = (isTruncated: boolean) => {};
	constructor(private elementRef: ElementRef) {

	}

	ngAfterViewInit(): void {
		if (!isValueSet(this.elementIsTruncatedCb)) {
			console.log('nope');
			return;
		}
		console.log('yes');

		this.elementRef.nativeElement.addEventListener('DOMCharacterDataModified', (event) => {
			if (isValueSet(event.target.wholeText)) {
				this.checkForTruncation();
			}
		}, false);
		this.checkForTruncation();
	}

	ngOnDestroy() {
		console.log('destroyed');
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
}
