import {Component, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {format as dateFormat, parse} from 'date-fns';
import {MultipleValueAccessorBase} from '../value-accessor-base/multiple-value-accessor-base.component';
import {invalidDateKey} from '../../validators/dateValidator';
import {isNullOrUndefined} from '../../util/values';

@Component({
	selector: 'klp-form-date-picker',
	templateUrl: './date-picker.component.html',
	styleUrls: ['./date-picker.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: DatePickerComponent, multi: true}],
})
export class DatePickerComponent extends MultipleValueAccessorBase<string | typeof invalidDateKey> {
	@Input() public minDate: Date = undefined;
	@Input() public maxDate: Date = undefined;
	@Input() public sameMonthOnly = false;
	@Input() public format = 'dd-MM-yyyy';
	@Input() public placeholder = 'Select date';
	@Input() public clearable = false;

	public dateValue: Date | Array<Date>;

	writeValue(value: string | Array<string> | typeof invalidDateKey): void {
		if (value === invalidDateKey) {
			super.writeValue(invalidDateKey);
		} else if (isNullOrUndefined(value)) {
			this.dateValue = null;
			super.writeValue(null);
		} else {
			if (Array.isArray(value)) {
				this.dateValue = value.map((e) => parse(e, 'yyyy-MM-dd', new Date()));
			} else {
				this.dateValue = parse(value, 'yyyy-MM-dd', new Date());
			}
			super.writeValue(value);
		}
	}

	dateChanged(value: Date | Array<Date> | typeof invalidDateKey): void {
		if (value === invalidDateKey) {
			this.setInnerValueAndNotify(invalidDateKey);
		} else if (isNullOrUndefined(value)) {
			this.dateValue = null;
			this.setInnerValueAndNotify(null);
		} else {
			this.dateValue = value;
			if (Array.isArray(value)) {
				this.setInnerValueAndNotify(value.map((e) => dateFormat(e, 'yyyy-MM-dd')));
			} else {
				this.setInnerValueAndNotify(dateFormat(value, 'yyyy-MM-dd'));
			}
		}
	}
}
