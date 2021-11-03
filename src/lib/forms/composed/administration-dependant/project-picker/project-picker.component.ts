import { Component, OnInit, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdministrationDependantPickerComponent } from '~/app/shared/ui/forms/composed/administration-dependant/administration-dependant-picker.component';
import { CompanyProjectListAPIRequest } from '~/app/modules/company/models/company.model';

@Component({
	selector: 'app-project-picker',
	templateUrl: './project-picker.component.html',
	styleUrls: ['./project-picker.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: ProjectPickerComponent, multi: true }],
})
export class ProjectPickerComponent extends AdministrationDependantPickerComponent implements OnInit {
	public projectPromise: Promise<
		Array<{
			id: string;
			name: string;
			description: string;
			administrationId: string;
		}>
	>;

	ngOnInit() {
		super.ngOnInit();

		const filters = new CompanyProjectListAPIRequest();
		filters.company = this.companyId;
		filters.max = this.max;
		filters.groups = this.groups;
		filters.active = this.active;

		this.projectPromise = this.companyProject.getCompanyProjects(filters).then((res) => {
			return res.company_projects.map((project) => ({
				id: project.id,
				name: (project.code !== '' ? project.code + ' - ' : '') + project.name,
				description: project.description,
				administrationId: project.administration,
			}));
		});
		this.projectPromise.then(() => this.deselectInvalidItems(this.projectPromise));
	}

	ngOnChanges(simpleChanges: SimpleChanges) {
		if (simpleChanges.shouldBelongToAdministrationIds) {
			// if the provided admin ids change, we need to check if the selected cost centers are still valid to select
			this.deselectInvalidItems(this.projectPromise);
		}
	}
}
