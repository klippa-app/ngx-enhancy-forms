import { Component, Host, Optional } from '@angular/core';
import { format } from '~/app/util/i18n';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { FormElementComponent } from '~/app/shared/ui/forms/form/form-element/form-element.component';

export const supportedFormats = ['DD-MM-YYYY', 'D-M-YYYY', 'MM-DD-YYYY', 'M-D-YYYY', 'YYYY-MM-DD', 'YYYY-M-D', 'YYYY-DD-MM', 'YYYY-D-M'];

// date fns does not accept capital d or y in date formats.
function convertToDateFns(val: string) {
	return val.replace(/D/g, 'd').replace(/Y/g, 'y');
}

export function getSupportedFormatsAsDateFns() {
	return supportedFormats.map(convertToDateFns);
}

@Component({
	selector: 'app-date-format-picker',
	templateUrl: './date-format-picker.component.html',
	styleUrls: ['./date-format-picker.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: DateFormatPickerComponent, multi: true }],
})
export class DateFormatPickerComponent extends ValueAccessorBase<string> {
	dateFormats;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer
	) {
		super(parent, controlContainer);
		this.dateFormats = supportedFormats.map((id) => {
			const replaced = convertToDateFns(id);
			return {
				id,
				name: `${format(new Date(), replaced)} (${id})`,
			};
		});
	}
}
