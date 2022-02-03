import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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

	public registerControl(formControl: FormControl, formElement: FormElementComponent) {
		this.activeControls.push({ formControl, formElement });
	}

	public unregisterControl(formControl: FormControl) {
		this.activeControls = this.activeControls.filter((e) => e.formControl !== formControl);
	}

	private disableInactiveFormGroupControls(formGroup: FormGroup) {
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
	private disableInactiveFormArrayControls(formArray: FormArray) {
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
	private disableInactiveFormControl(control: FormControl) {
		if (this.activeControls.some((e) => e.formControl === control)) {
			control.enable();
		} else {
			control.disable();
		}
	}

	trySubmit(): Promise<any> {
		this.formGroup.markAllAsTouched();
		const originalDisabledStates = Object.values(this.formGroup.controls).map(e => {
			return { control: e, disabled: e.disabled};
		});
		console.log(originalDisabledStates);
		this.disableInactiveFormGroupControls(this.formGroup);
		if (this.formGroup.valid) {
			const p = Promise.resolve(this.formGroup.value);
			originalDisabledStates.forEach((e) => {
				if (e.disabled) {
					e.control.disable();
				} else {
					e.control.enable();
				}
			});
			return p;
		} else {
			this.activeControls.find((e) => !e.formControl.valid)?.formElement?.scrollTo();
			return Promise.reject(invalidFieldsSymbol);
		}
	}
}
