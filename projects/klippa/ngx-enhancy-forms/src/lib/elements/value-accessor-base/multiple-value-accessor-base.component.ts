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
		if (this.multiple) {
			if (Array.isArray(value)) {
				super.writeValue(value.filter(isValueSet));
			} else {
				super.writeValue([value].filter(isValueSet));
			}
		} else {
			if (Array.isArray(value)) {
				super.writeValue(value[0]);
			} else {
				super.writeValue(value);
			}
		}
	}

	setInnerValueAndNotify(value: T | Array<T>): void {
		if (this.multiple) {
			if (Array.isArray(value)) {
				super.setInnerValueAndNotify(value.filter(isValueSet));
			} else {
				super.setInnerValueAndNotify([value].filter(isValueSet));
			}
		} else {
			if (Array.isArray(value)) {
				super.setInnerValueAndNotify(value[0]);
			} else {
				super.setInnerValueAndNotify(value);
			}
		}
	}
}
