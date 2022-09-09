import {Component, Host, Input, Optional} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {ValueAccessorBase} from './value-accessor-base.component';
import {FormElementComponent} from '../../form/form-element/form-element.component';
import {isValueSet} from '../../util/values';

@Component({
	selector: '',
	template: '',
})
export class MultipleValueAccessorBase<T> extends ValueAccessorBase<Array<T> | T> {
	@Input() multiple = false;

	constructor(
		@Host() @Optional() protected parent: FormElementComponent,
		@Host() @Optional() protected controlContainer: ControlContainer
	) {
		super(parent, controlContainer);
	}

	writeValue(value: Array<T> | T): void {
		// if the outside world passes a value in the wrong format, it should be corrected
		if (this.multiple && !Array.isArray(value)) {
			const correctedVal = [value].filter(isValueSet);
			super.writeValue(correctedVal);
			super.setInnerValueAndNotify(correctedVal);
		} else if (!this.multiple && Array.isArray(value)) {
			const correctedVal = value[0];
			super.writeValue(correctedVal);
			super.setInnerValueAndNotify(correctedVal);
		} else {
			super.writeValue(value);
		}
	}

	setInnerValueAndNotify(value: T | Array<T>): void {
		if (this.multiple && !Array.isArray(value)) {
			super.setInnerValueAndNotify([value].filter(isValueSet));
		} else if (!this.multiple && Array.isArray(value)) {
			super.setInnerValueAndNotify(value[0]);
		} else {
			super.setInnerValueAndNotify(value);
		}
	}
}
