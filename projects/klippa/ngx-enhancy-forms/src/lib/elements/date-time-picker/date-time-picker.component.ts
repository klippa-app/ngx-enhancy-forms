import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Host,
	Inject,
	InjectionToken,
	Input,
	OnChanges,
	OnInit,
	Optional,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {invalidDateKey} from '../../validators/dateValidator';
import {DateFilterFn, MatDatepicker} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatDateFormats} from '@angular/material/core';
import {KlpDateFormats} from '../../types';
import {FormElementComponent} from '../../form/form-element/form-element.component';
import {MultipleValueAccessorBase} from '../value-accessor-base/multiple-value-accessor-base.component';
import {arrayIsSetAndFilled, isValueSet, removeDuplicatesFromArray, stringIsSetAndFilled} from '../../util/values';
import {endOfMonth, format as formatDate, startOfMonth} from 'date-fns';

export const KLP_DATE_FORMATS = new InjectionToken<KlpDateFormats>('klp.form.date.formats');
export const DATE_TIME_PICKER_TRANSLATIONS = new InjectionToken<any>('klp.form.dateTime.translations');
export const DATE_PICKER_LOCALE = new InjectionToken<any>('klp.form.dateTime.locale');

export function matDateFormatsFactory(component: DateTimePickerComponent, dateFormats?: KlpDateFormats): MatDateFormats {
	return dateFormats?.(component.format) ?? MAT_NATIVE_DATE_FORMATS;
}

@Component({
	selector: 'klp-form-date-time-picker',
	templateUrl: './date-time-picker.component.html',
	styleUrls: ['./date-time-picker.component.scss'],
	providers: [
		{provide: NG_VALUE_ACCESSOR, useExisting: DateTimePickerComponent, multi: true},
		{
			provide: MAT_DATE_FORMATS,
			deps: [DateTimePickerComponent, [new Optional(), KLP_DATE_FORMATS]],
			useFactory: matDateFormatsFactory,
		},
	],
})
export class DateTimePickerComponent extends MultipleValueAccessorBase<Date | typeof invalidDateKey> implements OnInit, AfterViewInit, OnChanges {
	@Input() public minDate: Date = undefined;
	@Input() public maxDate: Date = undefined;
	@Input() public sameMonthOnly = false;
	@Input() public format = 'dd-MM-yyyy';
	@Input() public placeholder: string;
	@Input() public clearable = false;
	@Input() public showTimeInput = true;
	@Input() public invalidTimeAsMidnight = false; // if the time is not valid, use 00:00 as the time

	@ViewChild('nativeInput') nativeInputRef: ElementRef;
	@ViewChild('picker') datePickerRef: MatDatepicker<Date>;

	openPickerOnDate: Date = null;
	minDateStartOfDay: Date = undefined;
	maxDateEndOfDay: Date = undefined;

	// this is passed as ngmodel and is used to set the initial date. But we also
	// use input and nativeInput callbacks to extend the validation logic so we
	// can distinguish between empty and invalid dates.
	valueForMaterialDatePicker: Date;
	hours: string; // string because it's a text input
	minutes: string; // string because it's a text input
	private selectedDates: Array<Date> = [];
	private datePickingClosingFn: () => void;
	private dateTouched = false;
	private hoursTouched = false;
	private minutesTouched = false;

	constructor(
		@Host() @Optional() protected parent: FormElementComponent,
		@Host() @Optional() protected controlContainer: ControlContainer,
		@Inject(DATE_TIME_PICKER_TRANSLATIONS) @Optional() private translations: any,
		@Inject(DATE_PICKER_LOCALE) @Optional() private datePickerLocale: any,
		private dateAdapter: DateAdapter<Date>,
		private cdr: ChangeDetectorRef
	) {
		super(parent, controlContainer);
		if (isValueSet(datePickerLocale)) {
			dateAdapter.setLocale(datePickerLocale());
		}
	}

	ngOnInit(): void {
		super.ngOnInit();
		if (this.multiple) {
			this.placeholder = '';
			this.showTimeInput = false;
		}
	}

	ngAfterViewInit(): void {
		if (this.multiple) {
			// we are going to overwrite the datepicker closing fn later, so we are saving it here to restore it when needed
			this.datePickingClosingFn = this.datePickerRef.close;
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.minDate) {
			this.determineMinAndMaxDates();
		}
		if (changes.maxDate) {
			this.determineMinAndMaxDates();
		}
	}

	setMinDate(minDate: Date): void {
		if (minDate) {
			this.minDateStartOfDay = new Date(minDate);
			this.minDateStartOfDay.setHours(0, 0, 0, 0);
		} else {
			this.minDateStartOfDay = undefined;
		}
	}

	setMaxDate(maxDate: Date): void {
		if (maxDate) {
			this.maxDateEndOfDay = new Date(maxDate);
			this.maxDateEndOfDay.setHours(23, 59, 59, 999);
		} else {
			this.maxDateEndOfDay = undefined;
		}
	}

	getSelectedMonths(): number {
		return removeDuplicatesFromArray(this.selectedDates.map((e) => formatDate(e, 'MMMM'))).length;
	}

	// dateChanged is called when the output of the datepicker is changed and
	// parsed correctly. If the date is invalid, it will be called the first time
	// with null but never again until a valid input is provided.
	dateChanged(event: any): void {
		const date = event.value;
		if (this.multiple) {
			this.datePickerRef.close = () => {
			};

			if (this.selectedDates.some((e) => e.getTime() === date.getTime())) {
				this.selectedDates = this.selectedDates.filter((e) => e.getTime() !== date.getTime());
			} else {
				this.selectedDates = [...this.selectedDates, date];
			}
			// START HACK
			// the date picker does not provide any rerender calls. Therefore, we are going to change the minDate in order to force the render
			// This is needed to show all selected days in our date picker
			// We also set the innerValue to null (with this.valueForMaterialDatePicker = null;), otherwise you can not
			// deselect your last picked date
			this.cdr.detectChanges();
			this.valueForMaterialDatePicker = null;
			const oldMinDate = this.minDateStartOfDay;
			this.minDateStartOfDay = new Date(0);
			this.cdr.detectChanges();
			this.minDateStartOfDay = oldMinDate;
			// END HACK

			if (this.sameMonthOnly) {
				if (this.selectedDates.length >= 2) {
					if (date < startOfMonth(this.selectedDates[0]) || date > endOfMonth(this.selectedDates[0])) {
						this.selectedDates = [date];
					}
				}
				this.determineMinAndMaxDates();
			}

			this.setInnerValueAndNotify(this.selectedDates);
			setTimeout(() => {
				this.datePickerRef.close = this.datePickingClosingFn;
			});
		} else {
			this.notifyNewDate();
		}
	}

	determineMinAndMaxDates(): void {
		if (this.sameMonthOnly) {
			if (this.selectedDates.length >= 2) {
				this.setMinDate(startOfMonth(this.selectedDates[0]));
				this.setMaxDate(endOfMonth(this.selectedDates[0]));
			} else {
				this.setMinDate(this.minDate);
				this.setMaxDate(this.maxDate);
			}
		} else {
			this.setMinDate(this.minDate);
			this.setMaxDate(this.maxDate);
		}
	}

	notifyNewDate(): void {
		const nativeInputValue = this.nativeInputRef.nativeElement.value;
		const parsedHours = Number(this.hours);
		const parsedMinutes = Number(this.minutes);

		// if we dont have the time element
		if (!this.showTimeInput) {
			if (!stringIsSetAndFilled(nativeInputValue)) {
				this.setInnerValueAndNotify(null);
				return;
			}
			if (this.valueForMaterialDatePicker instanceof Date) {
				this.setInnerValueAndNotify(this.valueForMaterialDatePicker);
				return;
			}
		}
		// when all inputs are empty
		if (!stringIsSetAndFilled(nativeInputValue) && !stringIsSetAndFilled(this.hours) && !stringIsSetAndFilled(this.minutes)) {
			this.setInnerValueAndNotify(null);
			return;
		}
		// if we have date and time
		if (
			stringIsSetAndFilled(this.hours) &&
			Number.isFinite(parsedHours) &&
			parsedHours >= 0 &&
			parsedHours <= 23 &&
			stringIsSetAndFilled(this.minutes) &&
			Number.isFinite(parsedMinutes) &&
			parsedMinutes >= 0 &&
			parsedMinutes <= 59 &&
			this.valueForMaterialDatePicker instanceof Date
		) {
			const newDateWithHours = new Date(this.valueForMaterialDatePicker.setHours(parsedHours));
			const newDateWithMinutes = new Date(newDateWithHours.setMinutes(parsedMinutes));
			this.setInnerValueAndNotify(newDateWithMinutes);
			return;
		}
		if (this.invalidTimeAsMidnight) {
			if (this.valueForMaterialDatePicker instanceof Date) {
				this.setInnerValueAndNotify(this.valueForMaterialDatePicker);
				return;
			}
		}
		// all other cases, we are not in a valid state
		this.setInnerValueAndNotify(invalidDateKey);
	}

	writeValue(value: Date | Array<Date> | typeof invalidDateKey): void {
		super.writeValue(value);
		if (Array.isArray(value)) {
			this.selectedDates = value;
			this.determineMinAndMaxDates();
			this.valueForMaterialDatePicker = null;
			if (arrayIsSetAndFilled(value)) {
				this.openPickerOnDate = this.selectedDates[0];
			}
		} else {
			this.valueForMaterialDatePicker = value === invalidDateKey ? null : value;
			if (value instanceof Date) {
				this.hours = String(value.getHours());
				this.minutes = String(value.getMinutes());
				this.formatTime();
				this.openPickerOnDate = value;
			} else {
				this.hours = '';
				this.minutes = '';
				this.openPickerOnDate = null;
				this.selectedDates = [];
			}
		}
	}

	// nativeValueChanged is called when the internal text value changes, but not
	// when the date is changed via the date picker. We need this so that we can
	// determine if the datepicker is empty or invalid.
	nativeValueChanged(): void {
		if (this.datePickerRef.opened) {
			// if the user is typing instead of using the picker, close it.
			this.datePickerRef.close();
		}
		this.notifyNewDate();
	}

	resetToNull(): void {
		this.setInnerValueAndNotify(null);
		this.valueForMaterialDatePicker = null;
		this.nativeInputRef.nativeElement.value = null;
		this.hours = '';
		this.minutes = '';
		this.selectedDates = [];
	}

	isSelected = (d: Date) => {
		if (this.multiple) {
			return this.selectedDates.some((e) => e.getTime() === d.getTime()) ? 'selected' : '';
		}
		return '';
	};
	filterDates: DateFilterFn<any> = (e) => {
		if (this.disabled) {
			return false;
		}
		return true;
	};

	formatTime(): void {
		if (Number.isFinite(Number(this.hours)) && this.hours.length === 1) {
			this.hours = '0' + this.hours;
		}
		if (Number.isFinite(Number(this.minutes)) && this.minutes.length === 1) {
			this.minutes = '0' + this.minutes;
		}
	}

	touchDate(): void {
		this.dateTouched = true;
		this.determineAllTouched();
	}

	touchHours(): void {
		this.hoursTouched = true;
		this.determineAllTouched();
	}

	touchMinutes(): void {
		this.minutesTouched = true;
		this.determineAllTouched();
	}

	determineAllTouched(): void {
		if ((this.dateTouched && this.hoursTouched && this.minutesTouched) || (this.dateTouched && !this.showTimeInput)) {
			this.touch();
		}
	}


	getDefaultTranslation(key: string): (x: any) => string {
		switch (key) {
			case 'placeholder':
				return () => 'Select date';
			case 'selectDays':
				return () => 'Select day(s)';
			case 'selectedDate':
				return (d: Date) => d.toLocaleDateString();
			case 'daysSelected':
				return (amount) => `${amount} days selected`;
			case 'selectedInMonth':
				return (d: Date) => ` in ${formatDate(d, 'MMMM')}`;
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
