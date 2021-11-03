import { Component, Host, Input, Optional } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { CompanyService } from '~/app/modules/company/company.service';
import { FormElementComponent } from '~/app/shared/ui/forms/form/form-element/form-element.component';

@Component({
	selector: 'app-company-picker',
	templateUrl: './company-picker.component.html',
	styleUrls: ['./company-picker.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CompanyPickerComponent, multi: true }],
})
export class CompanyPickerComponent extends ValueAccessorBase<Array<string>> {
	@Input() multiple = false;
	@Input() clearable = true;
	companiesPromise;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
		private companyAPIService: CompanyService
	) {
		super(parent, controlContainer);
		this.companiesPromise = this.companyAPIService.getCompanies().then((res) => {
			return res.map((e) => ({ id: e.id, name: e.name }));
		});
	}
}
