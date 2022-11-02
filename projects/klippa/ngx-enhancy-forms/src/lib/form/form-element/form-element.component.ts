import {Component, Directive, ElementRef, Host, Inject, InjectionToken, Input, OnInit, Optional, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, UntypedFormControl, FormGroup} from '@angular/forms';
import {FormComponent} from '../form.component';
import {CustomErrorMessages, FormErrorMessages} from '../../types';
import { ValueAccessorBase } from '../../elements/value-accessor-base/value-accessor-base.component';
import { isValueSet } from '../../util/values';

export const FORM_ERROR_MESSAGES = new InjectionToken<CustomErrorMessages>('form.error.messages');

export const DEFAULT_ERROR_MESSAGES: FormErrorMessages = {
	min: 'Use a number larger than %min%',
	max: 'Use a number smaller than %max%',
	required: 'This field is required',
	email: 'Use a valid email address',
	minLength: 'Has to be longer than %minLength% character(s)',
	maxLength: 'Has to be shorter than %maxLength% character(s)',
	pattern: 'This input is not valid',
	matchPassword: 'Passwords must match',
	date: 'Enter a valid date',
};

@Component({
	selector: 'klp-form-element',
	templateUrl: './form-element.component.html',
	styleUrls: ['./form-element.component.scss'],
})
export class FormElementComponent {
	public attachedControl: AbstractControl;
	@Input() public caption: string;
	@Input() public direction: 'horizontal' | 'vertical' = 'horizontal';
	@Input() public captionSpacing: 'percentages' | 'none' = 'percentages';
	@Input() public spaceDistribution: '40-60' | '30-70' = '40-60';
	@Input() public swapInputAndCaption: boolean = false;
	@ViewChild('internalComponentRef') public internalComponentRef: ElementRef;

	public captionRef: ElementRef;
	public errorMessages: FormErrorMessages = DEFAULT_ERROR_MESSAGES;
	public customErrorHandlers: Array<{ error: string; templateRef: ElementRef }> = [];
	private input: ValueAccessorBase<any>;

	constructor(
		@Host() @Optional() private parent: FormComponent,
		@Inject(FORM_ERROR_MESSAGES) @Optional() private customMessages: CustomErrorMessages,
	) {
	}

	public shouldShowErrorMessages(): boolean {
		return this.parent?.showErrorMessages !== false;
	}

	public substituteParameters(message: string, parameters: Record<string, any>): string {
		return Object.keys(parameters).reduce((msg, key) => {
			return msg.replace(`%${key}%`, parameters[key]);
		}, message);
	}

	public registerControl(formControl: UntypedFormControl, input: ValueAccessorBase<any> = null): void {
		this.attachedControl = formControl;
		this.parent.registerControl(formControl, this);
		this.input = input;
	}

	public unregisterControl(formControl: UntypedFormControl): void {
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

	getErrorToShow(): string {
		if (this.attachedControl?.touched === true && this.attachedControl?.errors) {
			return Object.keys(this.attachedControl?.errors)[0];
		}
		return null;
	}

	getCustomErrorHandler(error: string): { error: string; templateRef: ElementRef } {
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

	scrollTo(): void{
		this.internalComponentRef.nativeElement.scrollIntoView(true);
		// to give some breathing room, we scroll 100px more to the top
		this.getScrollableParent(this.internalComponentRef.nativeElement)?.scrollBy(0, -100);
	}

	isRequired(): boolean {
		if (isValueSet(this.input)) {
			return this.input.hasValidator('required');
		}
		return false;
	}

	getErrorMessage(key: keyof FormErrorMessages): string {
		return this.customMessages?.[key]?.() ?? this.errorMessages[key];
	}

	public getErrorLocation(): 'belowCaption' | 'rightOfCaption' {
		return this.parent?.errorMessageLocation ?? 'belowCaption';
	}
}
