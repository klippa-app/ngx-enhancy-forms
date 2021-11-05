import {Component, Input} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {FormElementComponent} from './form-element/form-element.component';

@Component({
	selector: 'lib-enhancy-forms-form',
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
		this.activeControls.push({formControl, formElement});
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
		if (this.activeControls.some((e) => e.formControl === control)) {
			control.enable();
		} else {
			control.disable();
		}
	}

	trySubmit(): Promise<any> {
		this.formGroup.markAllAsTouched();
		this.disableInactiveFormGroupControls(this.formGroup);
		if (this.formGroup.valid) {
			return Promise.resolve(this.formGroup.value);
		} else {
			this.activeControls.find((e) => !e.formControl.valid)?.formElement?.scrollTo();
			return Promise.reject('Not all fields are valid');
		}
	}
}
