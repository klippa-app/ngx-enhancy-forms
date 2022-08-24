import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {ValueAccessorBase} from "../value-accessor-base/value-accessor-base.component";

@Component({
	selector: 'klp-form-number-input',
	templateUrl: './number-input.component.html',
	styleUrls: ['./number-input.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: NumberInputComponent, multi: true }],
})
export class NumberInputComponent extends ValueAccessorBase<string | number> {
	@Input() placeholder: string;
	@Input() parseNumber: boolean = false;


	setInnerValueAndNotify(value: string | number) {
		if (this.parseNumber && typeof value === "string") {
			super.setInnerValueAndNotify(Number(value));
		} else {
			super.setInnerValueAndNotify(value);
		}
	}
}
