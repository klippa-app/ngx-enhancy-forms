import { Component, Host, Input, OnInit, Optional } from '@angular/core';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CompanyGroupListAPIRequest } from '~/app/modules/company/models/company.model';
import { CompanyService } from '~/app/modules/company/company.service';
import { FormElementComponent } from '~/app/shared/ui/forms/form/form-element/form-element.component';

@Component({
	selector: 'app-group-picker',
	templateUrl: './group-picker.component.html',
	styleUrls: ['./group-picker.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: GroupPickerComponent, multi: true }],
})
export class GroupPickerComponent extends ValueAccessorBase<Array<string>> implements OnInit {
	@Input() multiple = true;

	public groupsPromise;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
		private companyApiService: CompanyService
	) {
		super(parent, controlContainer);
	}

	ngOnInit() {
		super.ngOnInit();
		const filters = new CompanyGroupListAPIRequest();
		filters.company = this.companyApiService.getCompanyOfLoggedUser().id;

		this.groupsPromise = this.companyApiService.getCompanyGroups(filters).then((res) => {
			return res.company_groups.map((group) => ({
				id: group.id,
				name: (group.code !== '' ? group.code + ' - ' : '') + group.name,
				description: group.description,
			}));
		});
	}
}
