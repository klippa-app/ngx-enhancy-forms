import {ControlContainer, ControlValueAccessor, UntypedFormControl} from '@angular/forms';
import {
	Component,
	ElementRef,
	EventEmitter,
	Host,
	Input,
	OnDestroy,
	OnInit,
	Optional,
	Output,
	TemplateRef,
	ViewChild
} from '@angular/core';
import {FormElementComponent} from '../../form/form-element/form-element.component';
import {isNullOrUndefined, isValueSet, stringIsSetAndFilled} from '../../util/values';
import { arrayIsSetAndFilled } from '../../util/arrays';

/**
 * This component is a base in order to create a component that supports ngModel.
 * Some important things to know about it:
 *
 * innerValue = your own inner state, which you should use to store the current state of what ngModel should be.
 * writeValue() = called by angular, when ngModel is changed from OUTSIDE of the component. Feel free to patch this method if you need inner logic to happen when ngModel is altered from the outside. Always remember to also call the super.writeValue if you do!
 * setInnerValueAndNotify() = call this when you want your ngModel to be updated from INSIDE of your component, and provide it to the OUTSIDE.
 * ngOnInit() = Used to support the angular reactive forms framework. If you use ngOnInit in your own component (which happens fairly often) you must not forget to call the super.ngOnInit() method.
 */

@Component({
	selector: '',
	template: '',
})
export class ValueAccessorBase<T> implements ControlValueAccessor, OnInit, OnDestroy {
	public innerValue: T;
	public changed = new Array<(value: T) => void>();
	private touched = new Array<() => void>();
	private prevValue: T = null;

	@Input() public disabled = false;
	// needed to prevent race conditions
	private latestInnerValueChangedInterceptorPromise: Promise<void>;
	@Input() innerValueChangeInterceptor: (prev: T, cur: T) => Promise<void>;
	// we support both providing just the formControlName and the full formControl
	@Input() public formControlName: string = null;
	@Input() public formControl: UntypedFormControl = null;
	@Input() public inErrorState = false;
	@Input() getTailTplFn: () => TemplateRef<any>;
	@Output() public onTouch = new EventEmitter<void>();
	@ViewChild('nativeInputRef') nativeInputRef: ElementRef;

	private attachedFormControl: UntypedFormControl;
	private tailTpl: TemplateRef<any>;

	constructor(
		@Host() @Optional() protected parent: FormElementComponent,
		@Host() @Optional() protected controlContainer: ControlContainer
	) {
	}

	ngOnInit(): void {
		if (this.formControl) {
			this.attachedFormControl = this.formControl;
		} else if (stringIsSetAndFilled(this.formControlName)) {
			this.attachedFormControl = this.controlContainer?.control.get(this.formControlName) as UntypedFormControl;
			if (isNullOrUndefined(this.attachedFormControl)) {
				throw new Error(`Form element '${this.formControlName}' with caption '${this.parent?.caption}' is not declared in your FormGroup.`);
			}
		}
		if (this.attachedFormControl) {
			this.disabled = this.attachedFormControl.disabled;
			this.attachedFormControl.statusChanges.subscribe(() => {
				this.disabled = this.attachedFormControl.disabled;
			});
			this.parent?.registerControl(this.attachedFormControl, this);
		}
	}

	isInErrorState(): boolean {
		if (this.inErrorState) {
			return true;
		}
		return this.attachedFormControl && this.attachedFormControl.status === 'INVALID' && this.attachedFormControl.touched;
	}

	ngOnDestroy(): void {
		if (this.attachedFormControl) {
			this.parent?.unregisterControl(this.attachedFormControl);
		}
	}

	touch(): void {
		this.touched.forEach((f) => f());
		this.onTouch.emit();
	}

	writeValue(value: T): void {
		this.innerValue = value;
		this.prevValue = value;
	}

	registerOnChange(fn: (value: T) => void): void {
		this.changed.push(fn);
	}

	registerOnTouched(fn: () => void): void {
		this.touched.push(fn);
	}

	setInnerValueAndNotify(value: T): void {
		const actuallySetValue = (valueToSet: T): void => {
			this.innerValue = valueToSet;
			this.prevValue = valueToSet;
			this.changed.forEach((fn) => fn(valueToSet));
		};
		if (isValueSet(this.innerValueChangeInterceptor)) {
			this.latestInnerValueChangedInterceptorPromise = this.innerValueChangeInterceptor(this.prevValue, value);
			const myPromise = this.latestInnerValueChangedInterceptorPromise;
			this.latestInnerValueChangedInterceptorPromise.then(() => {
				if (this.latestInnerValueChangedInterceptorPromise === myPromise) {
					actuallySetValue(value);
				} else {
					// ignore outdated promises
				}
			}).catch(() => {
				if (this.latestInnerValueChangedInterceptorPromise === myPromise) {
					actuallySetValue(this.prevValue);
				} else {
					// ignore outdated promises
				}
			});
		} else {
			actuallySetValue(value);
		}
	}

	resetToNull(): void {
		this.setInnerValueAndNotify(null);
	}

	hasValidator(validatorName: string): boolean {
		const validators = Object.keys(this.attachedFormControl?.validator?.({} as any) ?? {});
		if (arrayIsSetAndFilled(validators)) {
			return validators.includes(validatorName);
		}
		return false;
	}

	public focus = (): void => {
		if (isValueSet(this.nativeInputRef?.nativeElement)){
			this.nativeInputRef?.nativeElement?.focus();
		}else {
			throw new Error('the focus() method is not implemented in this element!');
		}
	}

	public setTailTpl = (tpl: TemplateRef<any>): void => {
		this.tailTpl = tpl;
	}
	public getTailTpl = (): TemplateRef<any> => {
		if (isValueSet(this.getTailTplFn)) {
			return this.getTailTplFn();
		}
		return this.tailTpl;
	}
}
