import { Component, ElementRef, Host, Input, Optional, ViewChild } from '@angular/core';
import { FormComponent } from '~/app/shared/ui/forms/form/form.component';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
	selector: 'app-form-element',
	templateUrl: './form-element.component.html',
	styleUrls: ['./form-element.component.scss'],
})
export class FormElementComponent {
	public attachedControl: AbstractControl;
	@Input() public caption: String;
	@Input() public direction: 'horizontal' | 'vertical' = 'horizontal';
	@Input() public captionSpacing: 'percentages' | 'none' = 'percentages';
	@Input() public swapInputAndCaption: boolean = false;
	@ViewChild('internalComponentRef') public internalComponentRef: ElementRef;

	public captionRef: ElementRef;
	public customErrorHandlers: Array<{ error: string; templateRef: ElementRef }> = [];

	constructor(@Host() @Optional() private parent: FormComponent) {}

	public registerControl(formControl: FormControl) {
		this.attachedControl = formControl;
		this.parent.registerControl(formControl, this);
	}

	public unregisterControl(formControl: FormControl) {
		this.attachedControl = null;
		this.parent.unregisterControl(formControl);
	}

	public getAttachedControl() {
		return this.attachedControl;
	}

	public registerErrorHandler(error: string, templateRef: ElementRef) {
		this.customErrorHandlers.push({ error, templateRef });
	}

	public registerCaption(templateRef: ElementRef) {
		this.captionRef = templateRef;
	}

	getErrorToShow() {
		if (this.attachedControl?.touched === true && this.attachedControl?.errors) {
			return Object.keys(this.attachedControl?.errors)[0];
		}
		return null;
	}

	getCustomErrorHandler(error: string) {
		return this.customErrorHandlers.find((e) => e.error === error);
	}

	showDefaultError(error: string) {
		return this.getErrorToShow() === error && !this.customErrorHandlers.some((e) => e.error === error);
	}

	getScrollableParent(node) {
		if (node == null) {
			return null;
		}
		if (node.scrollHeight > node.clientHeight) {
			return node;
		} else {
			return this.getScrollableParent(node.parentNode);
		}
	}

	scrollTo() {
		this.internalComponentRef.nativeElement.scrollIntoView(true);
		// to give some breathing room, we scroll 100px more to the top
		this.getScrollableParent(this.internalComponentRef.nativeElement)?.scrollBy(0, -100);
	}
}
