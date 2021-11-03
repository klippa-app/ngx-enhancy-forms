import { Component, Host, Input, Optional } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { FormElementComponent } from '~/app/shared/ui/forms/form/form-element/form-element.component';
import { ExportTemplatesService } from '~/app/modules/export-templates/services/export-templates.service';
import { ExportType } from '~/app/modules/company/services/exporters/columns.service';

@Component({
	selector: 'app-form-export-template-picker',
	templateUrl: './export-template-picker.component.html',
	styleUrls: ['./export-template-picker.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: ExportTemplatePickerComponent, multi: true }],
})
export class ExportTemplatePickerComponent extends ValueAccessorBase<string> {
	@Input() public exportType: ExportType;
	public optionsPromise: Promise<Array<{ id: any; name: string; description?: string }>>;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
		private exportTemplatesService: ExportTemplatesService
	) {
		super(parent, controlContainer);
	}

	ngOnInit(): void {
		super.ngOnInit();
		this.optionsPromise = this.exportTemplatesService.getAllAvailableTemplates(this.exportType).then((data) => {
			if (data.data.export_templates?.length > 0) {
				return data.data.export_templates?.map((template) => {
					return { id: template.id, name: template.description, description: template.export_type };
				});
			} else {
				return [];
			}
		});
	}
}
