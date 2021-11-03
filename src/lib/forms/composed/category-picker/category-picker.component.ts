import { Component, Host, Input, OnInit, Optional } from '@angular/core';
import { CompanyService } from '~/app/modules/company/company.service';
import { CompanyCategoryListAPIRequest } from '~/app/modules/company/models/company.model';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormElementComponent } from '~/app/shared/ui/forms/form/form-element/form-element.component';
import { CompanyCategoryService } from '~/app/modules/company/services/dimensions/company-category.service';

@Component({
	selector: 'app-category-picker',
	templateUrl: './category-picker.component.html',
	styleUrls: ['./category-picker.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CategoryPickerComponent, multi: true }],
})
export class CategoryPickerComponent extends ValueAccessorBase<Array<string>> implements OnInit {
	@Input() multiple = true;

	public categoryPromise;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
		private companyApiService: CompanyService,
		private companyCategorie: CompanyCategoryService
	) {
		super(parent, controlContainer);
	}

	ngOnInit() {
		super.ngOnInit();
		const filters = new CompanyCategoryListAPIRequest();
		filters.company = this.companyApiService.getCompanyOfLoggedUser().id;

		this.categoryPromise = this.companyCategorie.getCompanyCategories(filters).then((res) => {
			return res.company_categories.map((category) => ({
				id: category.id,
				name: (category.code !== '' ? category.code + ' - ' : '') + category.name,
				description: category.description,
			}));
		});
	}
}
