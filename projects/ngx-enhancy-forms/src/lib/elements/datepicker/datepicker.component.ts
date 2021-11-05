import {Component, ElementRef, Input, SimpleChanges, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';
import {_} from '~/lib/util/i18n';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {NgxDateFnsDateAdapter} from 'ngx-mat-datefns-date-adapter';
import {isMatch} from 'date-fns';
import {getSupportedFormatsAsDateFns} from '~/app/shared/ui/forms/composed/date-format-picker/date-format-picker.component';
import {isNullOrUndefined, stringIsSetAndNotEmpty} from '~/app/util/values';
import {invalidDateKey} from '~/app/shared/ui/forms/validators/dateValidator';
import {MatDatepicker} from '@angular/material/datepicker';

class MultiParseDateFnsDateAdapter extends NgxDateFnsDateAdapter {
	// override the parse function to take arrays of parseFormats and try each in turn.
	parse(value: any, parseFormat: any) {
		if (typeof value === 'string') {
			if (value.length === 0) {
				return null;
			}
			// replace all '/' and '.' with '-' for locales that use '/' or '.' seperated dates.
			value = value.replace(/[\/.]/g, '-');
		}
		if (Array.isArray(parseFormat)) {
			for (const format of parseFormat) {
				if (isMatch(value, format)) {
					return super.parse(value, format);
				}
			}
		}
		return null;
	}
}

@Component({
	selector: 'lib-enhancy-forms-datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss'],
	providers: [
		{provide: NG_VALUE_ACCESSOR, useExisting: DatepickerComponent, multi: true},
		{provide: DateAdapter, useClass: MultiParseDateFnsDateAdapter, deps: [MAT_DATE_LOCALE]},
		{
			provide: MAT_DATE_FORMATS,
			useFactory: (component) => {
				return {
					parse: {
						// if the selected format fails to parse try all supported and all long locale formats.
						dateInput: [component.format, ...getSupportedFormatsAsDateFns(), 'PP', 'PPP', 'PPPP'],
					},
					display: {
						dateInput: component.format, // Display as selected format.
						monthLabel: 'MMM',
						monthYearLabel: 'MMM yyyy',
						dateA11yLabel: 'MMM dd, yyyy',
						monthYearA11yLabel: 'MMMM yyyy',
					},
				};
			},
			deps: [DatepickerComponent],
		},
	],
})
export class DatepickerComponent extends ValueAccessorBase<Date | typeof invalidDateKey> {
	@Input() public minDate: Date = undefined;
	@Input() public maxDate: Date = undefined;
	@Input() public format = 'dd-MM-yyyy';
	@Input() public placeholder = _('Select date');

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
