import {Component} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';
import {stringIsSetAndFilled} from '../../util/values';
import {invalidTimeKey} from '../../validators/timeValidator';


@Component({
	selector: 'klp-form-hour-minute-input',
	templateUrl: './hour-minute-input.component.html',
	styleUrls: ['./hour-minute-input.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: HourMinuteInputComponent, multi: true}],
})
export class HourMinuteInputComponent extends ValueAccessorBase<number | typeof invalidTimeKey> {
	public hours: string; // string because it's a text input
	public minutes: string; // string because it's a text input

	private hoursTouched = false;
	private minutesTouched = false;

	formatHours(): void {
		if (!stringIsSetAndFilled(this.hours)) {
			this.hours = '0';
		}
	}

	formatMinutes(): void {
		if (!stringIsSetAndFilled(this.minutes)) {
			this.minutes = '0';
		}
	}

	formatTime(): void {
		if (Number.isFinite(Number(this.hours)) && this.hours.length === 1) {
			this.hours = '0' + this.hours;
		}
		if (Number.isFinite(Number(this.minutes)) && this.minutes.length === 1) {
			this.minutes = '0' + this.minutes;
		}
	}

	writeValue(value: number | typeof invalidTimeKey): void {
		if (Number.isFinite(value)) {
			this.hours = Math.floor(value as number / 60) + '';
			this.minutes = value as number % 60 + '';
			this.formatTime();
			super.writeValue(value);
		} else {
			this.hours = '';
			this.minutes = '';
			super.writeValue(invalidTimeKey);
		}
	}

	notifyNewTime(): void {
		const parsedHours = Number(this.hours);
		const parsedMinutes = Number(this.minutes);

		// when all inputs are empty
		if (!stringIsSetAndFilled(this.hours) && !stringIsSetAndFilled(this.minutes)) {
			this.setInnerValueAndNotify(null);
			return;
		}
		// if we have valid time
		if (
			Number.isFinite(parsedHours) &&
			parsedHours >= 0 &&
			parsedHours <= 99 &&
			Number.isFinite(parsedMinutes) &&
			parsedMinutes >= 0 &&
			parsedMinutes <= 59
		) {
			this.setInnerValueAndNotify(parsedHours * 60 + parsedMinutes);
			return;
		}
		// all other cases, we are not in a valid state
		this.setInnerValueAndNotify(invalidTimeKey);
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
		if (this.hoursTouched && this.minutesTouched) {
			this.touch();
		}
	}
}
