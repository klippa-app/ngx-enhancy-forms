import { Component, Host, Input, OnInit, Optional } from '@angular/core';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { isNullOrUndefined } from '~/app/util/values';
import { User } from '~/app/modules/user/models/user.model';
import { UserService } from '~/app/modules/user/user.service';
import { FormElementComponent } from '~/app/shared/ui/forms/form/form-element/form-element.component';
import { ControlContainer } from '@angular/forms';
import { CompanyService } from '~/app/modules/company/company.service';
import { CompanyCostCenterService } from '~/app/modules/company/services/dimensions/company-cost-center.service';
import { CompanyCostUnitService } from '~/app/modules/company/services/dimensions/company-cost-unit.service';
import { CompanyProjectService } from '~/app/modules/company/services/dimensions/company-project.service';

@Component({
	selector: '',
	template: '',
})
export class AdministrationDependantPickerComponent extends ValueAccessorBase<Array<string> | string> implements OnInit {
	@Input() public shouldBelongToAdministrationIds: Array<string> | null = [];
	@Input() multiple = true;
	@Input() showAllGroupsAndInActive = true;

	protected user: User;
	protected readonly companyId: string;
	protected max = 1000;
	protected groups: Array<string>;
	protected active: boolean;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
		protected userService: UserService,
		protected companyApiService: CompanyService,
		protected companyCostCenter: CompanyCostCenterService,
		protected companyCostUnit: CompanyCostUnitService,
		protected companyProject: CompanyProjectService
	) {
		super(parent, controlContainer);
		this.companyId = companyApiService.getCompanyOfLoggedUser().id;
		this.user = this.userService.getCurrentLoggedUser();
	}

	ngOnInit() {
		super.ngOnInit();

		if (!this.showAllGroupsAndInActive) {
			this.groups = this.user.getCompanyGroups();
			this.active = true;
		}
	}

	belongsToProvidedAdministration(entry, adminIds: Array<string>): boolean {
		if (adminIds?.length > 0) {
			return adminIds.includes(entry.administrationId);
		}
		// if we dont have any admins provided, just show them all
		return true;
	}

	writeValue(value: Array<string>) {
		if (this.multiple) {
			if (Array.isArray(value)) {
				super.writeValue(value);
			} else {
				super.writeValue([value]);
			}
		} else {
			if (Array.isArray(value)) {
				super.writeValue(value[0]);
			} else {
				super.writeValue(value);
			}
		}
	}

	deselectInvalidItems(allPossibleItemsPromise: Promise<Array<{ id: string; administrationId: string }>>) {
		allPossibleItemsPromise?.then((allPossibleItems) => {
			const adminIds = this.shouldBelongToAdministrationIds;
			if (!isNullOrUndefined(this.innerValue)) {
				let selectedItems = allPossibleItems.filter((item) => this.innerValue.includes(item.id));
				if (adminIds.length > 0) {
					selectedItems = selectedItems.filter((item) => adminIds.includes(item.administrationId));
				}
				this.writeValue(selectedItems.map((e) => e.id));
			} else {
				this.writeValue([]);
			}
		});
	}
}
