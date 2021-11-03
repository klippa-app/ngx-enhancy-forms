import { Component, Host, Input, Optional } from '@angular/core';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { APIService } from '~/app/api/services/api.service';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isNullOrUndefined, stringOrArrayIsSetAndEmpty, useIfArrayIsSetWithOneItem } from '~/app/util/values';
import { FormElementComponent } from '~/app/shared/ui/forms/form/form-element/form-element.component';

@Component({
	selector: 'app-country-picker',
	templateUrl: './country-picker.component.html',
	styleUrls: ['./country-picker.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CountryPickerComponent, multi: true }],
})
export class CountryPickerComponent extends ValueAccessorBase<Array<string> | string> {
	@Input() multiple = false;
	@Input() clearable = true;
	@Input() filterOnCountryIds: string[];

	public countriesPromise;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
		private apiService: APIService
	) {
		super(parent, controlContainer);
	}

	ngOnInit() {
		super.ngOnInit();
		this.countriesPromise = this.apiService.getFromApi('country/names/en-GB').then((res) => {
			const countries = this.setOptionsBasedOnIdFilter(res.data);
			return countries.map((e) => ({ id: e.code, name: e.name }));
		});
	}

	setOptionsBasedOnIdFilter(countries) {
		if (!isNullOrUndefined(this.filterOnCountryIds)) {
			const tempCountries = countries.filter((item) => this.filterOnCountryIds.includes(item.code));
			// set the value if there is only one option and none is selected and filter on country ids is used
			if (stringOrArrayIsSetAndEmpty(this.innerValue)) {
				this.writeValue(useIfArrayIsSetWithOneItem(tempCountries)?.id);
			}
			return tempCountries;
		}
		return countries;
	}

	writeValue(value: any) {
		// some receipts, for some reason, have an empty string as key for a country.
		// fix that here, we only accept null/undefined, non empty strings and arrays
		// We can remove this once we rewrite the receipt editor
		if (typeof value === 'string' && value.length > 0) {
			super.writeValue(value);
		} else if (isNullOrUndefined(value) || Array.isArray(value)) {
			super.writeValue(value);
		} else {
			this.resetToNull();
		}
	}
}
