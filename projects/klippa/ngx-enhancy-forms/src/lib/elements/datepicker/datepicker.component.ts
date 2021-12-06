import {Component, ElementRef, Input, SimpleChanges, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import { isNullOrUndefined, stringIsSetAndNotEmpty } from '../../util/values';
import { invalidDateKey } from '../../validators/dateValidator';
import { MatDatepicker } from '@angular/material/datepicker';
import {ValueAccessorBase} from "../value-accessor-base/value-accessor-base.component";

@Component({
	selector: 'klp-form-datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss'],
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: DatepickerComponent, multi: true },
	],
})
export class DatepickerComponent extends ValueAccessorBase<Date | typeof invalidDateKey> {
	@Input() public minDate: Date = undefined;
	@Input() public maxDate: Date = undefined;
	@Input() public placeholder = 'Select date';

	@ViewChild('nativeInput') nativeInputRef: ElementRef;
	@ViewChild('picker') datePickerRef: MatDatepicker<Date>;

	minDateStartOfDay: Date = undefined;
	maxDateEndOfDay: Date = undefined;

	// this is passed as ngmodel and is used to set the inital date. But we also
	// use input and nativeInput callbacks to extend the validation logic so we
	// can destinguish between empty and invalid dates.
	valueForMaterialDatePicker: Date;

	ngOnChanges(changes: SimpleChanges) {
		if (changes.minDate) {
			this.setMinDate(changes.minDate.currentValue);
		}
		if (changes.maxDate) {
			this.setMaxDate(changes.maxDate.currentValue);
		}
	}

	setMinDate(minDate: Date) {
		if (minDate) {
			this.minDateStartOfDay = new Date(minDate);
			this.minDateStartOfDay.setHours(0, 0, 0, 0);
		} else {
			this.minDateStartOfDay = undefined;
		}
	}

	setMaxDate(maxDate: Date) {
		if (maxDate) {
			this.maxDateEndOfDay = new Date(maxDate);
			this.maxDateEndOfDay.setHours(23, 59, 59, 999);
		} else {
			this.maxDateEndOfDay = undefined;
		}
	}

	// dateChanged is called when the output of the datepicker is changed and
	// parsed correctly. If the date is invalid, it will be called the first time
	// with null but never again until a valid input is provided.
	dateChanged(event: any) {
		const nativeInputValue = this.nativeInputRef.nativeElement.value;
		const date = event.value;
		if (isNullOrUndefined(date) && stringIsSetAndNotEmpty(nativeInputValue)) {
			this.setInnerValueAndNotify(invalidDateKey);
		} else {
			this.setInnerValueAndNotify(date);
		}
	}

	writeValue(value: Date | typeof invalidDateKey) {
		super.writeValue(value);
		this.valueForMaterialDatePicker = value === invalidDateKey ? null : value;
	}

	// nativeValueChanged is called when the internal text value changes, but not
	// when the date is changed via the date picker. We need this so that we can
	// determine if the datepicker is empty or invalid.
	nativeValueChanged(event: any) {
		const nativeInputValue = event.target.value;
		const date = this.valueForMaterialDatePicker;

		if (this.datePickerRef.opened) {
			// if the user is typing instead of using the picker, close it.
			this.datePickerRef.close();
		}

		if (isNullOrUndefined(date) && stringIsSetAndNotEmpty(nativeInputValue)) {
			this.setInnerValueAndNotify(invalidDateKey);
		} else {
			this.setInnerValueAndNotify(date);
		}
	}
}
