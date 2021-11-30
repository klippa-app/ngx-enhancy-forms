import { Component, Host, Input, OnInit, Optional } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import {ValueAccessorBase} from "../value-accessor-base/value-accessor-base.component";
import {FormElementComponent} from "../../form/form-element/form-element.component";

export type AppSelectOptions = Array<{
	id: any;
	name: string;
	description?: string;
	disabled?: boolean;
}>;

@Component({
	selector: 'klp-form-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: SelectComponent, multi: true }],
})
export class SelectComponent extends ValueAccessorBase<string | string[]> {
	@Input() placeholder: string = 'Pick an option';
	@Input() options: AppSelectOptions;
	@Input() multiple = false;
	@Input() clearable = true;
	@Input() public dropdownPosition: string;
	@Input() public customSearchFn: (term: string, item: { id: string; name: string; description: string }) => boolean;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
	) {
		super(parent, controlContainer);
	}
}
