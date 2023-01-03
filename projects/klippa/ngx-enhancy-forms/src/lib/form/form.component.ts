import {Component, Directive, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges, SkipSelf} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {FormElementComponent} from './form-element/form-element.component';
import {isValueSet} from '../util/values';
import { deepMerge } from '../util/objects';

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
export class FormComponent implements OnInit, OnDestroy, OnChanges {
	@Input() public readOnly = false;
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

	ngOnChanges(simpleChanges: SimpleChanges): void {
		if (simpleChanges.readOnly?.currentValue === true) {
			this.activeControls.forEach(e => e.formControl.disable());
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
		if (this.readOnly) {
			formControl.disable();
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
		const formGroupValue = this.formGroup.value;
		const renderedAndEnabledValues = this.getRenderedFieldValuesFormGroup(this.formGroup, true);
		const renderedButDisabledValues = this.getRenderedFieldValuesFormGroup(this.formGroup, false);
		if (this.formGroup.valid) {
			this.setDisabledStatesForAllControls(originalDisabledStates);
			const merged = deepMerge(renderedAndEnabledValues, renderedButDisabledValues);
			return Promise.resolve([formGroupValue, merged]);
		} else {
			this.activeControls.find((e) => !e.formControl.valid)?.formElement?.scrollTo();
			this.setDisabledStatesForAllControls(originalDisabledStates);
			return Promise.reject(invalidFieldsSymbol);
		}
	}

	private getRenderedFieldValuesFormGroup(formGroup: FormGroup, enabled: boolean, valueObject = {}): object {
		Object.entries(formGroup.controls).forEach(([name, control]) => {
			if (control instanceof FormControl && control.enabled === enabled && this.activeControls.some(e => e.formControl === control)) {
				valueObject[name] = control.value;
			} else if (control instanceof FormArray) {
				valueObject[name] = [];
				this.getRenderedFieldValuesFormArray(control, enabled, valueObject[name]);
			} else if (control instanceof FormGroup) {
				valueObject[name] = {};
				this.getRenderedFieldValuesFormGroup(control, enabled, valueObject[name]);
			}
		});
		return valueObject;
	}

	private getRenderedFieldValuesFormArray(formArray: FormArray, enabled: boolean, valueArray: Array<any>): void {
		formArray.controls.forEach((control: AbstractControl) => {
			if (control instanceof FormControl && control.enabled === enabled && this.activeControls.some(e => e.formControl === control)) {
				valueArray.push(control.value);
			} else if (control instanceof FormArray) {
				const newArray = [];
				valueArray.push(newArray);
				this.getRenderedFieldValuesFormArray(control, enabled, newArray);
			} else if (control instanceof FormGroup) {
				const newObject = {};
				valueArray.push(newObject);
				this.getRenderedFieldValuesFormGroup(control, enabled, newObject);
			}
		});
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
