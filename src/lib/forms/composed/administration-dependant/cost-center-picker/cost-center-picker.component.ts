import { Component, OnInit, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdministrationDependantPickerComponent } from '~/app/shared/ui/forms/composed/administration-dependant/administration-dependant-picker.component';
import { CompanyCostCenterListAPIRequest } from '~/app/modules/company/models/company.model';

@Component({
	selector: 'app-cost-center-picker',
	templateUrl: './cost-center-picker.component.html',
	styleUrls: ['./cost-center-picker.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CostCenterPickerComponent, multi: true }],
})
export class CostCenterPickerComponent extends AdministrationDependantPickerComponent implements OnInit {
	public costCenterPromise: Promise<
		Array<{
			id: string;
			name: string;
			description: string;
			administrationId: string;
		}>
	>;

	ngOnInit() {
		super.ngOnInit();

		const filters = new CompanyCostCenterListAPIRequest();
		filters.company = this.companyId;
		filters.max = this.max;
		filters.groups = this.groups;
		filters.active = this.active;

		this.costCenterPromise = this.companyCostCenter.getCompanyCostCenters(filters).then((res) => {
			return res.company_costcenters.map((costCenter) => ({
				id: costCenter.id,
				name: (costCenter.code !== '' ? costCenter.code + ' - ' : '') + costCenter.name,
				description: costCenter.description,
				administrationId: costCenter.administration,
			}));
		});
		this.costCenterPromise.then(() => this.deselectInvalidItems(this.costCenterPromise));
	}

	ngOnChanges(simpleChanges: SimpleChanges) {
		if (simpleChanges.shouldBelongToAdministrationIds) {
			// if the provided admin ids change, we need to check if the selected cost centers are still valid to select
			this.deselectInvalidItems(this.costCenterPromise);
		}
	}
}
