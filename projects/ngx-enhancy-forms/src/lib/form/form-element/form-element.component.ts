import {Component, ElementRef, Host, Input, Optional, ViewChild} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {FormComponent} from '../form.component';

@Component({
	selector: 'lib-enhancy-forms-form-element',
	templateUrl: './form-element.component.html',
	styleUrls: ['./form-element.component.scss'],
})
export class FormElementComponent {
	public attachedControl: AbstractControl;
	@Input() public caption: string;
	@Input() public direction: 'horizontal' | 'vertical' = 'horizontal';
	@Input() public captionSpacing: 'percentages' | 'none' = 'percentages';
	@Input() public swapInputAndCaption = false;
	@ViewChild('internalComponentRef') public internalComponentRef: ElementRef;

	public captionRef: ElementRef;
	public customErrorHandlers: Array<{ error: string; templateRef: ElementRef }> = [];

	constructor(@Host() @Optional() private parent: FormComponent) {
	}

	public registerControl(formControl: FormControl): void {
		this.attachedControl = formControl;
		this.parent.registerControl(formControl, this);
	}

	public unregisterControl(formControl: FormControl): void {
		this.attachedControl = null;
		this.parent.unregisterControl(formControl);
	}

	public getAttachedControl(): AbstractControl {
		return this.attachedControl;
	}

	public registerErrorHandler(error: string, templateRef: ElementRef): void {
		this.customErrorHandlers.push({error, templateRef});
	}

	public registerCaption(templateRef: ElementRef): void {
		this.captionRef = templateRef;
	}

	getErrorToShow(): string | null {
		if (this.attachedControl?.touched === true && this.attachedControl?.errors) {
			return Object.keys(this.attachedControl?.errors)[0];
		}
		return null;
	}

	getCustomErrorHandler(error: string): ({ error: string, templateRef: ElementRef }) {
		return this.customErrorHandlers.find((e) => e.error === error);
	}

	showDefaultError(error: string): boolean {
		return this.getErrorToShow() === error && !this.customErrorHandlers.some((e) => e.error === error);
	}

	getScrollableParent(node): any {
		if (node == null) {
			return null;
		}
		if (node.scrollHeight > node.clientHeight) {
			return node;
		} else {
			return this.getScrollableParent(node.parentNode);
		}
	}

	scrollTo(): void {
		this.internalComponentRef.nativeElement.scrollIntoView(true);
		// to give some breathing room, we scroll 100px more to the top
		this.getScrollableParent(this.internalComponentRef.nativeElement)?.scrollBy(0, -100);
	}
}
