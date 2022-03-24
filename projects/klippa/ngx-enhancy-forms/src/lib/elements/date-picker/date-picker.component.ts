import {Component, Host, Inject, InjectionToken, Input, Optional} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {format as dateFormat, parse} from 'date-fns';
import {MultipleValueAccessorBase} from '../value-accessor-base/multiple-value-accessor-base.component';
import {invalidDateKey} from '../../validators/dateValidator';
import {isNullOrUndefined, isValueSet, stringIsSetAndFilled} from '../../util/values';
import {FormElementComponent} from '../../form/form-element/form-element.component';

export const DATE_PICKER_TRANSLATIONS = new InjectionToken<any>('klp.form.date.translations');

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
	@Input() public placeholder: string;
	@Input() public clearable = false;

	public dateValue: Date | Array<Date>;

	constructor(
		@Host() @Optional() protected parent: FormElementComponent,
		@Host() @Optional() protected controlContainer: ControlContainer,
		@Inject(DATE_PICKER_TRANSLATIONS) @Optional() private translations: any,
	) {
		super(parent, controlContainer);
	}

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

	getDefaultTranslation(key: string): (x: any) => string {
		switch (key) {
			case 'placeholder':
				return () => 'Select date';
		}
	}

	getTranslation(key: string, params: any = null): string {
		if (key === 'placeholder' && this.multiple) {
			return '';
		}
		if (key === 'placeholder' && stringIsSetAndFilled(this.placeholder)) {
			return this.placeholder;
		}
		return this.translations?.[key]?.(params) ?? this.getDefaultTranslation(key)(params);
	}
}
