import {Component, Directive, Input, OnInit, Optional, SkipSelf} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, FormGroupName} from '@angular/forms';
import {FormElementComponent} from './form-element/form-element.component';
import {isValueSet} from '../util/values';

export const invalidFieldsSymbol = Symbol('Not all fields are valid');

@Directive({
	// tslint:disable-next-line:directive-selector
	selector: 'klp-sub-form',
})
export class SubFormDirective {
	@Input() injectInto: AbstractControl;
}

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

	constructor(@SkipSelf() @Optional() private parent: FormComponent, @Optional() private subFormPlaceholder: SubFormDirective) {
	}

	ngOnInit(): void {
		if (isValueSet(this.parent) && isValueSet(this.subFormPlaceholder)) {
			console.log('im initting because im a nested form');
			const parentOfInjectInto = this.subFormPlaceholder.injectInto;
			// debugger;
			if (parentOfInjectInto instanceof FormArray) {
				parentOfInjectInto.setControl(0, this.formGroup);
				// const i = parentOfInjectInto.controls.findIndex((e) => e === this.subFormPlaceholder.injectInto);
				// if (parentOfInjectInto.controls[i] instanceof SubForm) {
				// 	console.log('setting it!');
				// 	parentOfInjectInto.setControl(i, this.formGroup);
				// } else {
				// 	console.log('wrong thing');
				// }
			} else if (parentOfInjectInto instanceof FormGroup) {
				const toReplace = Object.entries(parentOfInjectInto.controls).find(([key, val]) => {
					return val === this.subFormPlaceholder.injectInto;
				});
				if (!(toReplace?.[1] instanceof SubForm)) {
					throw new Error(`You are trying to inject a subForm ('${toReplace?.[0]}') within something that is not annotated as such.`);
				}
				parentOfInjectInto.setControl(toReplace[0], this.formGroup);
			}
		}
	}

	ngOnDestroy() {
		console.log('destroying me', this.formGroup);
		const parentOfInjectInto = this.subFormPlaceholder.injectInto.parent;
		if (parentOfInjectInto instanceof FormArray) {
			const i = parentOfInjectInto.controls.findIndex(e => e === this.formGroup);
			// parentOfInjectInto.setControl(i, new SubForm());
			console.log(i);
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
