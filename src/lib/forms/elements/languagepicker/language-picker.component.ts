import { Component, Host, OnDestroy, Optional } from '@angular/core';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { FormElementComponent } from '~/app/shared/ui/forms/form/form-element/form-element.component';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import * as fromGeneric from '~/app/modules/generic/generic.reducer';
import { AppState } from '~/app/reducers';
import { Subscription } from 'rxjs';
import { Language } from '~/app/modules/generic/models/language';
import { AppSelectOptions } from '~/app/shared/ui/forms/elements/select/select.component';

@Component({
	selector: 'app-form-language-picker',
	templateUrl: './language-picker.component.html',
	styleUrls: ['./language-picker.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: FormLanguagePickerComponent, multi: true }],
})
export class FormLanguagePickerComponent extends ValueAccessorBase<string | string[]> implements OnDestroy {
	private languageSubscription: Subscription;

	public languageOptions: AppSelectOptions;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
		private store: Store<AppState>
	) {
		super(parent, controlContainer);

		this.languageSubscription = store
			.select('generic')
			.pipe(select(fromGeneric.selectAllLanguages))
			.subscribe((languages) => this.setLanguageOptions(languages));
	}

	ngOnDestroy(): void {
		this.languageSubscription.unsubscribe();
	}

	setLanguageOptions(languages: Language[]) {
		this.languageOptions = languages.map((language) => {
			return {
				id: language.getCode(),
				name: language.getTitle(),
			};
		});
	}
}
