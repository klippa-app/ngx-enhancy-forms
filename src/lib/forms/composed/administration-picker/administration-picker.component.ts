import { Component, Host, Input, OnInit, Optional } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CompanyService } from '~/app/modules/company/company.service';
import { CompanyAdministrationListAPIRequest } from '~/app/modules/company/models/company.model';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { FormElementComponent } from '~/app/shared/ui/forms/form/form-element/form-element.component';
import { AdministrationStat } from '~/app/pages/authenticated/statistics/models/stats';
import { StatisticsService } from '~/app/pages/authenticated/statistics/statistics.service';
import { ReceiptListAPIRequest } from '~/app/modules/receipt/models/receipt';
import { orderBy } from 'lodash';
import { User } from '~/app/modules/user/models/user.model';
import { UserService } from '~/app/modules/user/user.service';
import { CompanyAdministrationService } from '~/app/modules/company/services/dimensions/company-administration.service';

@Component({
	selector: 'app-administration-picker',
	templateUrl: './administration-picker.component.html',
	styleUrls: ['./administration-picker.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: AdministrationPickerComponent, multi: true }],
})
export class AdministrationPickerComponent extends ValueAccessorBase<Array<string>> implements OnInit {
	@Input() multiple = true;
	@Input() showStats = false;
	@Input() showAllGroupsAndInActive = true;
	@Input() statsFilters: ReceiptListAPIRequest = null;

	private readonly user: User;
	private readonly companyId: string;
	public administrationPromise;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
		private companyApiService: CompanyService,
		private statisticsService: StatisticsService,
		private userService: UserService,
		private companyAdministration: CompanyAdministrationService
	) {
		super(parent, controlContainer);
		this.companyId = companyApiService.getCompanyOfLoggedUser().id;
		this.user = this.userService.getCurrentLoggedUser();
	}

	ngOnInit() {
		super.ngOnInit();
		if (this.showStats && this.statsFilters) {
			this.administrationPromise = this.fetchAdministrationStats();
		} else {
			this.administrationPromise = this.fetchAdministrations();
		}
	}

	fetchAdministrationStats() {
		return this.statisticsService.getAdministrationStats(this.statsFilters).then((stats: AdministrationStat[]) => {
			const administrationOptions = stats.map((administrationStat: AdministrationStat) => {
				return {
					id: administrationStat.AdministrationObject.id,
					name: `${administrationStat.AdministrationObject.name} (${administrationStat.totalReceipts})`,
				};
			});
			return orderBy(administrationOptions, ['Label']);
		});
	}

	fetchAdministrations() {
		const filters = new CompanyAdministrationListAPIRequest();
		filters.company = this.companyId;

		if (!this.showAllGroupsAndInActive) {
			filters.groups = this.user.getCompanyGroups();
			filters.active = true;
		}

		return this.companyAdministration.getCompanyAdministrations(filters).then((res) => {
			return res.administrations.map((administration) => ({
				id: administration.id,
				name: (administration.code !== '' ? administration.code + ' - ' : '') + administration.name,
				description: administration.description,
			}));
		});
	}
}
