import {
	Component,
	Directive, EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Optional,
	Output,
	SimpleChanges,
	SkipSelf
} from '@angular/core';
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
	@Input() public warnings: Map<AbstractControl, string> = new Map<AbstractControl, string>();
	@Input() public patchValueInterceptor: (values: any) => Promise<any>;
	@Output() public onInjected = new EventEmitter<Record<string, any>>();

	// we keep track of what form controls are actually rendered. Only those count when looking at form validation
	private activeControls: Array<{
		formControl: UntypedFormControl;
		formElement: FormElementComponent;
	}> = [];

	constructor(@SkipSelf() @Optional() private parent: FormComponent, @Optional() private subFormPlaceholder: SubFormDirective) {
	}

	ngOnInit(): void {
		if (isValueSet(this.patchValueInterceptor)) {
			this.addSupportForPatchValueInterceptor();
		}
		if (isValueSet(this.parent) && isValueSet(this.subFormPlaceholder)) {
			const injectInto = this.subFormPlaceholder.injectInto;
			const injectAt = this.subFormPlaceholder.at;
			if (injectInto instanceof UntypedFormArray) {
				if (typeof injectAt !== 'number') {
					throw new Error(`cannot index FormArray with ${typeof injectAt}`);
				}
				if (injectInto.at(injectAt)?.disabled) {
					this.formGroup.disable();
				}
				const valueBeforeInject = injectInto.at(injectAt)?.value;
				if (isValueSet(valueBeforeInject)) {
					this.formGroup.patchValue(valueBeforeInject);
				}
				injectInto.setControl(injectAt, this.formGroup);
				this.onInjected.emit(valueBeforeInject);
			} else if (injectInto instanceof UntypedFormGroup) {
				if (typeof injectAt !== 'string') {
					throw new Error(`cannot index FormGroup with ${typeof injectAt}`);
				}
				if (injectInto.get(injectAt)?.disabled) {
					this.formGroup.disable();
				}
				const valueBeforeInject = injectInto.get(injectAt)?.value;
				if (isValueSet(valueBeforeInject)) {
					this.formGroup.patchValue(valueBeforeInject);
				}
				injectInto.setControl(injectAt, this.formGroup);
				this.onInjected.emit(valueBeforeInject);
			}
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
				injectInto.setControl(idx, new FormControl());
			} else if (injectInto instanceof UntypedFormGroup) {
				if (typeof injectAt !== 'string') {
					throw new Error(`cannot index FormGroup with ${typeof injectAt}`);
				}
				injectInto.setControl(injectAt, new FormControl());
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
		const enableFn: (opts?: { onlySelf?: boolean; emitEvent?: boolean }) => void = formControl.enable;
		formControl.enable = (opts?: { onlySelf?: boolean; emitEvent?: boolean }) => {
			if (!this.readOnly) {
				enableFn.call(formControl, opts);
			}
		};
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

	public getFormElementByFormControl(control: UntypedFormControl): FormElementComponent {
		return this.activeControls.find((e) => e.formControl === control)?.formElement;
	}

	public getWarningToShow(control: AbstractControl): string {
		return this.warnings.get(control);
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

		return new Promise((resolve, reject) => {
			if (this.formGroup.pending) {
				const sub = this.formGroup.statusChanges.subscribe((res) => {
					if (res !== 'PENDING') {
						sub.unsubscribe();
						this.handleSubmission(originalDisabledStates, renderedAndEnabledValues, renderedButDisabledValues, formGroupValue)
						.then(resolve)
						.catch(reject);
					}
				});
			} else {
				this.handleSubmission(originalDisabledStates, renderedAndEnabledValues, renderedButDisabledValues, formGroupValue)
				.then(resolve)
				.catch(reject);
			}
		});

	}

	private handleSubmission(
		originalDisabledStates: Array<{ control: FormControl<any>; disabled: boolean }>,
		renderedAndEnabledValues: Record<any, any>,
		renderedButDisabledValues: Record<any, any>,
		formGroupValue): Promise<any>
	{
		if (this.formGroup.invalid) {
			this.activeControls.find((e) => !e.formControl.valid)?.formElement?.scrollTo();
			this.setDisabledStatesForAllControls(originalDisabledStates);
			return Promise.reject(invalidFieldsSymbol);
		} else {
			this.setDisabledStatesForAllControls(originalDisabledStates);
			const renderedValues = deepMerge(renderedAndEnabledValues, renderedButDisabledValues);
			return Promise.resolve([formGroupValue, renderedValues]);
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
