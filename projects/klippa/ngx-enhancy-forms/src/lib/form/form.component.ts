import {Component, Input, OnInit, Optional, SkipSelf} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, FormGroupName} from '@angular/forms';
import {FormElementComponent} from './form-element/form-element.component';
import {isValueSet} from '../util/values';

export const invalidFieldsSymbol = Symbol('Not all fields are valid');

// Only used as a 'marker' to define a property will be filled in by a sub form
export class SubForm extends FormGroup {
	constructor() {
		super({}, null);
	}
}

@Component({
	selector: 'klp-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
	@Input() public formGroup: FormGroup;

	// we keep track of what form controls are actually rendered. Only those count when looking at form validation
	private activeControls: Array<{
		formControl: FormControl;
		formElement: FormElementComponent;
	}> = [];

	constructor(
		@SkipSelf() @Optional() private parent: FormComponent,
		@Optional() private surroundingFormGroupName: FormGroupName,
	) {
	}

	ngOnInit(): void {
		if (this.parent && isValueSet(this.surroundingFormGroupName?.name)) {
			const groupName = String(this.surroundingFormGroupName.name);
			const groupToOverwrite = this.parent.formGroup.get(groupName);
			if (groupToOverwrite instanceof SubForm) {
				this.parent.formGroup.setControl(groupName, this.formGroup);
			}
		}
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
