import {ControlContainer, ControlValueAccessor, FormControl} from '@angular/forms';
import {Component, Host, Input, OnDestroy, OnInit, Optional} from '@angular/core';
import {FormElementComponent} from '../../form/form-element/form-element.component';
import {isNullOrUndefined, stringIsSetAndNotEmpty} from '../../util/values';

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
	// tslint:disable-next-line:component-selector
	selector: '',
	template: '',
})
// tslint:disable-next-line:component-class-suffix
export class ValueAccessorBase<T> implements ControlValueAccessor, OnInit, OnDestroy {
	public innerValue: T;
	public changed = new Array<(value: T) => void>();
	private touched = new Array<() => void>();

	@Input() public disabled = false;
	// we support both providing just the formControlName and the full formControl
	@Input() public formControlName: string = null;
	@Input() public formControl: FormControl = null;

	private attachedFormControl: FormControl;

	constructor(
		@Host() @Optional() protected parent: FormElementComponent,
		@Host() @Optional() protected controlContainer: ControlContainer
	) {
	}

	ngOnInit(): void {
		if (this.formControl) {
			this.attachedFormControl = this.formControl;
		} else if (stringIsSetAndNotEmpty(this.formControlName)) {
			this.attachedFormControl = this.controlContainer?.control.get(this.formControlName) as FormControl;
			if (isNullOrUndefined(this.attachedFormControl)) {
				throw new Error(`Form element '${this.formControlName}' with caption '${this.parent?.caption}' is not declared in your FormGroup.`);
			}
		}
		if (this.attachedFormControl) {
			this.disabled = this.attachedFormControl.disabled;
			this.attachedFormControl.statusChanges.subscribe(() => {
				this.disabled = this.attachedFormControl.disabled;
			});
			this.parent?.registerControl(this.attachedFormControl);
		}
	}

	isInErrorState(): boolean {
		return this.attachedFormControl && this.attachedFormControl.status === 'INVALID' && this.attachedFormControl.touched;
	}

	ngOnDestroy(): void {
		if (this.attachedFormControl) {
			this.parent?.unregisterControl(this.attachedFormControl);
		}
	}

	touch(): void {
		this.touched.forEach((f) => f());
	}

	writeValue(value: T): void {
		this.innerValue = value;
	}

	registerOnChange(fn: (value: T) => void): void {
		this.changed.push(fn);
	}

	registerOnTouched(fn: () => void): void {
		this.touched.push(fn);
	}

	setInnerValueAndNotify(value): void {
		this.innerValue = value;
		this.changed.forEach((fn) => fn(value));
	}

	resetToNull(): void {
		this.setInnerValueAndNotify(null);
	}
}
