import {Component, Directive, Input, OnDestroy, OnInit, Optional, SkipSelf} from '@angular/core';
import {AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {FormElementComponent} from './form-element/form-element.component';
import {isValueSet} from '../util/values';

export const invalidFieldsSymbol = Symbol('Not all fields are valid');

@Directive({
	// tslint:disable-next-line:directive-selector
	selector: 'klp-sub-form',
})
export class SubFormDirective {
	@Input() injectInto: UntypedFormArray | UntypedFormGroup;
	@Input() at: number | string;
}

@Component({
	selector: 'klp-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnDestroy {
	@Input() public showErrorMessages = true;
	@Input() public errorMessageLocation: 'belowCaption' | 'rightOfCaption' = 'belowCaption';
	@Input() public formGroup: UntypedFormGroup;
	@Input() public patchValueInterceptor: (values: any) => Promise<any>;

	// we keep track of what form controls are actually rendered. Only those count when looking at form validation
	private activeControls: Array<{
		formControl: UntypedFormControl;
		formElement: FormElementComponent;
	}> = [];

	constructor(@SkipSelf() @Optional() private parent: FormComponent, @Optional() private subFormPlaceholder: SubFormDirective) {
	}

	ngOnInit(): void {
		if (isValueSet(this.parent) && isValueSet(this.subFormPlaceholder)) {
			const injectInto = this.subFormPlaceholder.injectInto;
			const injectAt = this.subFormPlaceholder.at;
			if (injectInto instanceof UntypedFormArray) {
				if (typeof injectAt !== 'number') {
					throw new Error(`cannot index FormArray with ${typeof injectAt}`);
				}

				injectInto.setControl(injectAt, this.formGroup);
			} else if (injectInto instanceof UntypedFormGroup) {
				if (typeof injectAt !== 'string') {
					throw new Error(`cannot index FormGroup with ${typeof injectAt}`);
				}

				injectInto.setControl(injectAt, this.formGroup);
			}
		}
		if (isValueSet(this.patchValueInterceptor)) {
			this.addSupportForPatchValueInterceptor();
		}
	}

	ngOnDestroy(): void {
		if (isValueSet(this.parent) && isValueSet(this.subFormPlaceholder)) {
			const injectInto = this.subFormPlaceholder.injectInto;
			const injectAt = this.subFormPlaceholder.at;
			if (injectInto instanceof UntypedFormArray) {
				const idx = injectInto.controls.findIndex(e => e === this.formGroup);
				injectInto.removeAt(idx);
			} else if (injectInto instanceof UntypedFormGroup) {
				if (typeof injectAt !== 'string') {
					throw new Error(`cannot index FormGroup with ${typeof injectAt}`);
				}
				injectInto.removeControl(injectAt);
			}
		}
	}

	private addSupportForPatchValueInterceptor(): void {
		const fn = this.formGroup.patchValue;
		const newFn = (
			value: {
				[key: string]: any;
			},
			options?: {
				onlySelf?: boolean;
				emitEvent?: boolean;
			}
		): void => {
			this.patchValueInterceptor(value).then((val) => {
				setTimeout(() => {
					fn.call(this.formGroup, val, options);
				});
			});
		};
		this.formGroup.patchValue = newFn;
	}

	public registerControl(formControl: UntypedFormControl, formElement: FormElementComponent): void {
		this.activeControls.push({formControl, formElement});
		if (this.parent) {
			this.parent.registerControl(formControl, formElement);
		}
	}

	public unregisterControl(formControl: UntypedFormControl): void {
		this.activeControls = this.activeControls.filter((e) => e.formControl !== formControl);
		if (this.parent) {
			this.parent.unregisterControl(formControl);
		}
	}

	private addFormGroupControls(formGroup: UntypedFormGroup, result: Array<UntypedFormControl>): void {
		Object.values(formGroup.controls).forEach((value) => {
			if (value instanceof UntypedFormGroup) {
				this.addFormGroupControls(value, result);
			} else if (value instanceof UntypedFormArray) {
				this.addFormArrayControls(value, result);
			} else if (value instanceof UntypedFormControl) {
				this.addFormControl(value, result);
			}
		});
	}

	private addFormArrayControls(formArray: UntypedFormArray, result: Array<UntypedFormControl>): void {
		formArray.controls.forEach((value) => {
			if (value instanceof UntypedFormGroup) {
				this.addFormGroupControls(value, result);
			} else if (value instanceof UntypedFormArray) {
				this.addFormArrayControls(value, result);
			} else if (value instanceof UntypedFormControl) {
				this.addFormControl(value, result);
			}
		});
	}

	private getAllFormControls(): Array<UntypedFormControl> {
		const result = [];
		this.addFormGroupControls(this.formGroup, result);
		return result;
	}

	private addFormControl(control: UntypedFormControl, result: Array<UntypedFormControl>): void {
		result.push(control);
	}

	private disableInactiveFormControl(control: UntypedFormControl): void {
		if (!this.activeControls.some((e) => e.formControl === control)) {
			control.disable();
		}
	}

	trySubmit(): Promise<any> {
		this.formGroup.markAllAsTouched();
		const allControls: Array<UntypedFormControl> = this.getAllFormControls();
		const originalDisabledStates = allControls.map(e => {
			return {control: e, disabled: e.disabled};
		});
		allControls.forEach(e => this.disableInactiveFormControl(e));
		allControls.forEach(e => e.updateValueAndValidity());
		const values = this.formGroup.value;
		if (this.formGroup.valid) {
			this.setDisabledStatesForAllControls(originalDisabledStates);
			return Promise.resolve(values);
		} else {
			this.activeControls.find((e) => !e.formControl.valid)?.formElement?.scrollTo();
			this.setDisabledStatesForAllControls(originalDisabledStates);
			return Promise.reject(invalidFieldsSymbol);
		}
	}

	private setDisabledStatesForAllControls(originalDisabledStates: Array<{ control: AbstractControl; disabled: boolean }>): void {
		originalDisabledStates.forEach((e) => {
			if (e.disabled) {
				e.control.disable();
			} else {
				e.control.enable();
			}
		});
	}
}
