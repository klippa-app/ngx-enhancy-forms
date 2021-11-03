import { Component, OnInit, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdministrationDependantPickerComponent } from '~/app/shared/ui/forms/composed/administration-dependant/administration-dependant-picker.component';
import { CompanyCostUnitListAPIRequest } from '~/app/modules/company/models/company.model';

@Component({
	selector: 'app-cost-unit-picker',
	templateUrl: './cost-unit-picker.component.html',
	styleUrls: ['./cost-unit-picker.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CostUnitPickerComponent, multi: true }],
})
export class CostUnitPickerComponent extends AdministrationDependantPickerComponent implements OnInit {
	public costUnitPromise: Promise<
		Array<{
			id: string;
			name: string;
			description: string;
			administrationId: string;
		}>
	>;

	ngOnInit() {
		super.ngOnInit();

		const filters = new CompanyCostUnitListAPIRequest();
		filters.company = this.companyId;
		filters.max = this.max;
		filters.groups = this.groups;
		filters.active = this.active;

		this.costUnitPromise = this.companyCostUnit.getCompanyCostUnits(filters).then((res) => {
			return res.company_costunits.map((costUnit) => ({
				id: costUnit.id,
				name: (costUnit.code !== '' ? costUnit.code + ' - ' : '') + costUnit.name,
				description: costUnit.description,
				administrationId: costUnit.administration,
			}));
		});
		this.costUnitPromise.then(() => this.deselectInvalidItems(this.costUnitPromise));
	}

	ngOnChanges(simpleChanges: SimpleChanges) {
		if (simpleChanges.shouldBelongToAdministrationIds) {
			// if the provided admin ids change, we need to check if the selected cost centers are still valid to select
			this.deselectInvalidItems(this.costUnitPromise);
		}
	}
}
