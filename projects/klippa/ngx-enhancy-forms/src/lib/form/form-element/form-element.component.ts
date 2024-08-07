import {
	AfterViewInit,
	Component,
	ContentChild,
	ElementRef,
	Inject,
	InjectionToken,
	Input, OnDestroy,
	Optional,
	TemplateRef,
	ViewChild
} from '@angular/core';
import {AbstractControl, NG_VALUE_ACCESSOR, UntypedFormControl} from '@angular/forms';
import {ValueAccessorBase} from '../../elements/value-accessor-base/value-accessor-base.component';
import {CustomErrorMessages, FormErrorMessages} from '../../types';
import {isValueSet, stringIsSetAndFilled} from '../../util/values';
import {FormComponent} from '../form.component';
import {getAllLimitingContainers} from '../../util/dom';
import {Subscription} from "rxjs";


export const FORM_ERROR_MESSAGES = new InjectionToken<CustomErrorMessages>('form.error.messages');

export const DEFAULT_ERROR_MESSAGES: FormErrorMessages = {
	min: 'Use a number larger than %min%',
	max: 'Use a number smaller than %max%',
	required: 'Required',
	email: 'Use a valid email address',
	minLength: 'Has to be longer than %minLength% character(s)',
	maxLength: 'Has to be shorter than %maxLength% character(s)',
	pattern: 'This input is not valid',
	matchPassword: 'Passwords must match',
	date: 'Enter a valid date',
};

type PopupState = 'onHover' | 'lockedOpen';

@Component({
	selector: 'klp-form-element',
	templateUrl: './form-element.component.html',
	styleUrls: ['./form-element.component.scss'],
})
export class FormElementComponent implements AfterViewInit, OnDestroy {
	public attachedControl: AbstractControl;
	@Input() public caption: string;
	@Input() public direction: 'horizontal' | 'vertical' = 'horizontal';
	@Input() public captionSpacing: 'percentages' | 'none' = 'percentages';
	@Input() public verticalAlignment: 'center' | 'top' = 'center';
	@Input() public spaceDistribution: '40-60' | '34-66' | '30-70' | 'fixedInputWidth' = '40-60';
	@Input() public swapInputAndCaption = false;
	@Input() public errorMessageAsTooltip = false;
	@ViewChild('internalComponentRef') public internalComponentRef: ElementRef;
	@ViewChild('tailTpl') public tailTpl: TemplateRef<any>;
	@ViewChild('captionDummyForSpaceCalculation') public captionDummyForSpaceCalculation: ElementRef;
	@ViewChild('absoluteAnchor') public absoluteAnchor: ElementRef;
	@ViewChild('fixedAnchor') public fixedAnchor: ElementRef;
	@ViewChild('fixedWrapper') public fixedWrapper: ElementRef;
	@ContentChild(NG_VALUE_ACCESSOR) fieldInput: ValueAccessorBase<any>;

	public captionRef: TemplateRef<any>;
	public errorMessages: FormErrorMessages = DEFAULT_ERROR_MESSAGES;
	public customErrorHandlers: Array<{ error: string; templateRef: TemplateRef<any> }> = [];
	private input: ValueAccessorBase<any>;
	public errorFullyVisible: boolean;
	private popupState: PopupState = 'onHover';
	private subscriptions: Array<Subscription> = [];

	constructor(
		@Optional() private parent: FormComponent,
		@Inject(FORM_ERROR_MESSAGES) @Optional() private customMessages: CustomErrorMessages,
		private elRef: ElementRef,
	) {
	}

	async ngAfterViewInit(): Promise<void> {
		const subscription = this.fieldInput?.onTouch.asObservable().subscribe(() => {
			this.determinePopupState();
		});
		if (isValueSet(subscription))  {
			this.subscriptions.push(subscription);
		}
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


		const subscription = this.attachedControl.statusChanges.subscribe(() => {
			this.determinePopupState();
		});
		this.subscriptions.push(subscription);
		this.determinePopupState();
	}

	public determinePopupState(): void {
		const prevState = this.popupState;
		this.initializeTailTpl();
		if (stringIsSetAndFilled(this.getErrorToShow())) {
			this.popupState = 'onHover';
		} else if (isValueSet(this.getWarningToShow())) {
			this.popupState = 'lockedOpen';
		} else {
			this.popupState = 'onHover';
		}

		this.setUpErrorTooltipListeners(prevState, this.popupState);
	}

	private setUpErrorTooltipListeners(prev: PopupState, current: PopupState): void {
		if (prev === current) {
			return;
		}
		const containers = [...getAllLimitingContainers(this.elRef.nativeElement), window];
		if (current === 'lockedOpen') {
			containers.forEach(e => {
				e.addEventListener('scroll', this.setErrorTooltipOffset);
			});
		} else {
			containers.forEach(e => {
				e.removeEventListener('scroll', this.setErrorTooltipOffset);
			});
		}
	}

	public unregisterControl(formControl: UntypedFormControl): void {
		this.attachedControl = null;
		this.parent.unregisterControl(formControl);
	}

	public getAttachedControl(): AbstractControl {
		return this.attachedControl;
	}

	public getAttachedInput(): ValueAccessorBase<any> {
		return this.input;
	}

	public registerErrorHandler(error: string, templateRef: TemplateRef<any>): void {
		this.customErrorHandlers.push({error, templateRef});
	}

	public registerCaption(templateRef: TemplateRef<any>): void {
		this.captionRef = templateRef;
	}

	public getWarningToShow(): string | TemplateRef<any> {
		return this.parent?.getWarningToShow(this.attachedControl);
	}

	public getWarningToShowAsTemplateRef(): TemplateRef<any> {
		if (this.parent?.getWarningToShow(this.attachedControl) instanceof TemplateRef) {
			return this.parent?.getWarningToShow(this.attachedControl) as TemplateRef<any>;
		}
		throw new Error('Warning is not a TemplateRef');
	}

	public getWarningToShowIsTemplateRef(): boolean {
		return this.getWarningToShow() instanceof TemplateRef;
	}

	getErrorToShow(): string {
		const firstError = Object.keys(this.attachedControl?.errors ?? {})[0];
		if (this.attachedControl?.touched !== true) {
			return null;
		}
		if (!this.attachedControl?.errors) {
			return null;
		}
		return firstError;
	}

	getCustomErrorHandler(error: string): { error: string; templateRef: TemplateRef<any> } {
		return this.customErrorHandlers.find((e) => e.error === error);
	}

	showDefaultError(error: string): boolean {
		return this.getErrorToShow() === error && !this.customErrorHandlers.some((e) => e.error === error);
	}

	getScrollableParent(node): any {
		if (node === window.document.documentElement) {
			return window.document.documentElement;
		}
		const overflowY = getComputedStyle(node).overflowY;
		if (node.clientHeight < node.scrollHeight && (overflowY === 'auto' || overflowY === 'scroll')) {
			return node;
		} else {
			return this.getScrollableParent(node.parentNode);
		}
	}

	scrollTo(): void {
		const parent = this.getScrollableParent(this.internalComponentRef.nativeElement);
		const parentTop = parent === window.document.documentElement ? 0 : parent.getBoundingClientRect().top;
		const elementTop = this.internalComponentRef.nativeElement.getBoundingClientRect().top;
		const parentScrollTop = parent.scrollTop;
		const answer = elementTop - parentTop + parentScrollTop;

		parent.scrollTo({
			top: answer - 30,
			behavior: 'smooth'
		});
	}

	isRequired(): boolean {
		if (isValueSet(this.input)) {
			return this.input.hasValidator('required');
		}
		return false;
	}

	getErrorMessage(key: keyof FormErrorMessages): string {
		if (key === 'formLevel') {
			return this.attachedControl.errors?.formLevel;
		}
		return this.customMessages?.[key]?.() ?? this.errorMessages[key];
	}

	public getErrorLocation(): 'belowCaption' | 'rightOfCaption' {
		return this.parent?.errorMessageLocation ?? 'belowCaption';
	}

	public shouldShowErrorTooltipOpened(): boolean {
		return this.popupState === 'lockedOpen';
	}

	public hasHoverableErrorTooltip(): boolean {
		if (!this.hasRightOfCaptionError() && !this.errorMessageAsTooltip) {
			return false;
		}
		if (this.popupState !== 'onHover') {
			return false;
		}
		if (stringIsSetAndFilled(this.getErrorToShow())) {
			return !this.errorFullyVisible;
		}
		if (isValueSet(this.getWarningToShow())) {
			return true;
		}
		return false;
	}

	public hasRightOfCaptionError(): boolean {
		if (this.errorMessageAsTooltip) {
			return false;
		}
		if (this.direction !== 'vertical' || this.getErrorLocation() !== 'rightOfCaption') {
			return false;
		}
		return true;
	}

	public setErrorMessageIsTruncated = (isTruncated: boolean) => {
		this.errorFullyVisible = !isTruncated;
	}

	public shouldShowWarningPopup(): boolean {
		return isValueSet(this.getWarningToShow());
	}

	public closePopup(): void {
		const prevState = this.popupState;
		this.popupState = 'onHover';
		this.setUpErrorTooltipListeners(prevState, this.popupState);
	}

	public togglePopup(): void {
		if (!this.errorMessageAsTooltip && !this.hasRightOfCaptionError()) {
			return;
		}
		if (this.errorFullyVisible) {
			return;
		}
		const prevState = this.popupState;
		if (this.popupState === 'lockedOpen') {
			this.popupState = 'onHover';
		} else {
			this.popupState = 'lockedOpen';
		}
		this.setUpErrorTooltipListeners(prevState, this.popupState);
	}

	public setErrorTooltipOffset = (): void => {
		if (this.popupState !== 'lockedOpen' && this.popupState !== 'onHover') {
			return;
		}
		const popupOffsetY = this.absoluteAnchor?.nativeElement.getBoundingClientRect().top - this.fixedAnchor?.nativeElement.getBoundingClientRect().top;
		if (this.fixedWrapper?.nativeElement) {
			this.fixedWrapper.nativeElement.style.transform = `translateY(${popupOffsetY}px)`;
		}
	};

	ngOnDestroy(): void {
		this.subscriptions.forEach(e => e.unsubscribe());
	}

	private initializeTailTpl(): void {
		if (stringIsSetAndFilled(this.getErrorToShow()) || isValueSet(this.getWarningToShow())) {
			if (!isValueSet(this.fieldInput?.getTailTpl())) {
				this.fieldInput?.setTailTpl(this.tailTpl);
			}
		}
	}
}
