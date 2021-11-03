import { Component, Host, Input, Optional } from '@angular/core';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { ExportType } from '~/app/modules/company/services/exporters/columns.service';
import { TranslateService } from '@ngx-translate/core';
import { FormElementComponent } from '~/app/shared/ui/forms/form/form-element/form-element.component';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CompanyService } from '~/app/modules/company/company.service';
import { UserService } from '~/app/modules/user/user.service';
import { UserRole } from '~/app/modules/user/models/user.model';
import { ExportModuleLabelPipe } from '~/app/modules/export-templates/components/export-templates-overview/export-module-label/export-module-label.component';

@Component({
	selector: 'app-export-module-picker',
	templateUrl: './export-module-picker.component.html',
	styleUrls: ['./export-module-picker.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: ExportModulePickerComponent, multi: true }],
})
export class ExportModulePickerComponent extends ValueAccessorBase<string> {
	@Input() clearable = true;
	public exportModuleOptions: Array<{ id: ExportType; name: string }>;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
		private translate: TranslateService,
		private companyService: CompanyService,
		private userService: UserService,
		private exportModuleLabelPipe: ExportModuleLabelPipe
	) {
		super(parent, controlContainer);
	}

	ngOnInit() {
		super.ngOnInit();
		const isSuperAdmin = this.userService.getCurrentLoggedUser().hasRole(UserRole.Admin);
		const modules = this.companyService.getCompanyOfLoggedUser()?.modules;
		const usesExpenses = this.companyService.getCompanyOfLoggedUser()?.canUseExpenses();
		const usesInvoices = this.companyService.getCompanyOfLoggedUser()?.canUseInvoices();
		this.exportModuleOptions = [];

		if (isSuperAdmin || usesExpenses || usesInvoices) {
			this.exportModuleOptions.push({
				id: ExportType.RECEIPT,
				name: this.exportModuleLabelPipe.transform(ExportType.RECEIPT),
			});
		}

		if (isSuperAdmin || modules?.creditcard_statements?.enabled === true) {
			this.exportModuleOptions.push({
				id: ExportType.CREDITCARD,
				name: this.exportModuleLabelPipe.transform(ExportType.CREDITCARD),
			});
		}

		if (isSuperAdmin || this.companyService.hasManualIntegrationEnabled()) {
			this.exportModuleOptions.push({
				id: ExportType.BOOKING,
				name: this.exportModuleLabelPipe.transform(ExportType.BOOKING),
			});
		}
	}
}
