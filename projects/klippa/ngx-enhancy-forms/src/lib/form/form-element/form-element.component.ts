import {Component, ElementRef, Host, Inject, InjectionToken, Input, OnInit, Optional, ViewChild} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import {FormComponent} from "../form.component";
import {CustomErrorMessages, FormErrorMessages} from "../../types";

export const FORM_ERROR_MESSAGES = new InjectionToken<CustomErrorMessages>('form.error.messages');

export const DEFAULT_ERROR_MESSAGES: FormErrorMessages = {
	min: "Use a number larger than %min%",
	max: "Use a number smaller than %max%",
	required: "This field is required",
	email: "Use a valid email address",
	minLength: "Has to be longer than %minLength% character(s)",
	maxLength: "Has to be shorter than %maxLength% character(s)",
	pattern: "This input is not valid",
	matchPassword: "Passwords must match",
	date: "Enter a valid date",
}

@Component({
	selector: 'klp-form-element',
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
	public errorMessages: FormErrorMessages = DEFAULT_ERROR_MESSAGES;
	public customErrorHandlers: Array<{ error: string; templateRef: ElementRef }> = [];

	constructor(
		@Host() @Optional() private parent: FormComponent,
		@Inject(FORM_ERROR_MESSAGES) @Optional() private customMessages: CustomErrorMessages
	) {
	}

	public substituteParameters(message: string, parameters: Record<string, any>): string {
		return Object.keys(parameters).reduce((msg, key) => {
			return msg.replace(`%${key}%`, parameters[key]);
		}, message);
	}

	public registerControl(formControl: FormControl) {
		// console.log('register');
		// console.log(this.caption);
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

	getErrorMessages(key: keyof FormErrorMessages) {
		return this.customMessages?.[key]?.() ?? this.errorMessages[key];
	}
}
