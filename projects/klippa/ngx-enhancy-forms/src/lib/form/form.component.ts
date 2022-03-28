import {Component, Directive, Input, OnDestroy, OnInit, Optional, SkipSelf} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, FormGroupName} from '@angular/forms';
import {FormElementComponent} from './form-element/form-element.component';
import {isValueSet} from '../util/values';

export const invalidFieldsSymbol = Symbol('Not all fields are valid');

@Directive({
	// tslint:disable-next-line:directive-selector
	selector: 'klp-sub-form',
})
export class SubFormDirective {
	@Input() injectInto: FormArray | FormGroup;
	@Input() at: number | string;
}

@Component({
	selector: 'klp-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnDestroy {
	@Input() public formGroup: FormGroup;
	@Input() public patchValueInterceptor: (values: any) => Promise<any>;

	// we keep track of what form controls are actually rendered. Only those count when looking at form validation
	private activeControls: Array<{
		formControl: FormControl;
		formElement: FormElementComponent;
	}> = [];

	constructor(@SkipSelf() @Optional() private parent: FormComponent, @Optional() private subFormPlaceholder: SubFormDirective) {
	}

	ngOnInit(): void {
		if (isValueSet(this.parent) && isValueSet(this.subFormPlaceholder)) {
			const injectInto = this.subFormPlaceholder.injectInto;
			const injectAt = this.subFormPlaceholder.at;
			if (injectInto instanceof FormArray) {
				if (typeof injectAt !== 'number') {
					throw new Error(`cannot index FormArray with ${typeof injectAt}`);
				}

				injectInto.setControl(injectAt, this.formGroup);
			} else if (injectInto instanceof FormGroup) {
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
			if (injectInto instanceof FormArray) {
				const idx = injectInto.controls.findIndex(e => e === this.formGroup);
				injectInto.removeAt(idx);
			} else if (injectInto instanceof FormGroup) {
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

	public registerControl(formControl: FormControl, formElement: FormElementComponent): void {
		this.activeControls.push({formControl, formElement});
		if (this.parent) {
			this.parent.registerControl(formControl, formElement);
		}
	}

	public unregisterControl(formControl: FormControl): void {
		this.activeControls = this.activeControls.filter((e) => e.formControl !== formControl);
		if (this.parent) {
			this.parent.unregisterControl(formControl);
		}
	}

	private addFormGroupControls(formGroup: FormGroup, result: Array<FormControl>): void {
		Object.values(formGroup.controls).forEach((value) => {
			if (value instanceof FormGroup) {
				this.addFormGroupControls(value, result);
			} else if (value instanceof FormArray) {
				this.addFormArrayControls(value, result);
			} else if (value instanceof FormControl) {
				this.addFormControl(value, result);
			}
		});
	}

	private addFormArrayControls(formArray: FormArray, result: Array<FormControl>): void {
		formArray.controls.forEach((value) => {
			if (value instanceof FormGroup) {
				this.addFormGroupControls(value, result);
			} else if (value instanceof FormArray) {
				this.addFormArrayControls(value, result);
			} else if (value instanceof FormControl) {
				this.addFormControl(value, result);
			}
		});
	}

	private getAllFormControls(): Array<FormControl> {
		const result = [];
		this.addFormGroupControls(this.formGroup, result);
		return result;
	}

	private addFormControl(control: FormControl, result: Array<FormControl>): void {
		result.push(control);
	}

	private disableInactiveFormControl(control: FormControl): void {
		if (!this.activeControls.some((e) => e.formControl === control)) {
			control.disable();
		}
	}

	trySubmit(): Promise<any> {
		this.formGroup.markAllAsTouched();
		const allControls: Array<FormControl> = this.getAllFormControls();
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
