import { Component, Host, Input, Optional } from '@angular/core';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { APIService } from '~/app/api/services/api.service';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import * as fromGeneric from '~/app/modules/generic/generic.reducer';
import { AppState } from '~/app/reducers';
import { sortBy } from 'lodash';
import { Currency } from '~/app/modules/generic/models/currency';
import { FormElementComponent } from '~/app/shared/ui/forms/form/form-element/form-element.component';

@Component({
	selector: 'app-currency-picker',
	templateUrl: './currency-picker.component.html',
	styleUrls: ['./currency-picker.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CurrencyPickerComponent, multi: true }],
})
export class CurrencyPickerComponent extends ValueAccessorBase<Array<string>> {
	public currenciesPromise: Promise<Array<Currency>>;
	private currenciesSubscription;

	@Input() public filterExchangeCurrencies = false;
	@Input() public multiple = false;
	@Input() public clearable = true;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
		private apiService: APIService,
		private store: Store<AppState>
	) {
		super(parent, controlContainer);
		this.currenciesSubscription = this.store
			.select('generic')
			.pipe(select(fromGeneric.selectAllCurrencies))
			.subscribe((currenciesFromStore) => {
				this.currenciesPromise = new Promise<any>((resolve) => {
					let currencies = currenciesFromStore;
					if (this.filterExchangeCurrencies) {
						currencies = currencies.filter((c) => c.isExchangeable());
					}
					currencies = sortBy(currencies, ['Label']);
					return resolve(currencies);
				});
			});
	}

	ngOnDestroy() {
		this.currenciesSubscription?.unsubscribe();
	}

	filterCurrency(filter: string, currency: Currency) {
		return currency.matches(filter);
	}
}
