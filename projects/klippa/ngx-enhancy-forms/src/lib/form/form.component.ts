import { Component, Input } from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {FormElementComponent} from "./form-element/form-element.component";

export const invalidFieldsSymbol = Symbol('Not all fields are valid');

@Component({
	selector: 'klp-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
})
export class FormComponent {
	@Input() public formGroup: FormGroup;

	// we keep track of what form controls are actually rendered. Only those count when looking at form validation
	private activeControls: Array<{
		formControl: FormControl;
		formElement: FormElementComponent;
	}> = [];

	public registerControl(formControl: FormControl, formElement: FormElementComponent): void {
		this.activeControls.push({ formControl, formElement });
	}

	public unregisterControl(formControl: FormControl): void {
		this.activeControls = this.activeControls.filter((e) => e.formControl !== formControl);
	}

	private disableInactiveFormGroupControls(formGroup: FormGroup): void {
		Object.values(formGroup.controls).forEach((value) => {
			if (value instanceof FormGroup) {
				this.disableInactiveFormGroupControls(value);
			} else if (value instanceof FormArray) {
				this.disableInactiveFormArrayControls(value);
			} else if (value instanceof FormControl) {
				this.disableInactiveFormControl(value);
			}
		});
	}
	private disableInactiveFormArrayControls(formArray: FormArray): void {
		formArray.controls.forEach((value) => {
			if (value instanceof FormGroup) {
				this.disableInactiveFormGroupControls(value);
			} else if (value instanceof FormArray) {
				this.disableInactiveFormArrayControls(value);
			} else if (value instanceof FormControl) {
				this.disableInactiveFormControl(value);
			}
		});
	}
	private disableInactiveFormControl(control: FormControl): void {
		if (!this.activeControls.some((e) => e.formControl === control)) {
			control.disable();
		}
	}

	trySubmit(): Promise<any> {
		this.formGroup.markAllAsTouched();
		const originalDisabledStates = Object.values(this.formGroup.controls).map(e => {
			return { control: e, disabled: e.disabled};
		});
		this.disableInactiveFormGroupControls(this.formGroup);
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
