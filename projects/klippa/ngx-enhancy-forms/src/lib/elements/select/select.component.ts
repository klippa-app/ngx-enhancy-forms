import {Component, EventEmitter, Host, Input, Optional, Output, TemplateRef} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';
import {FormElementComponent} from '../../form/form-element/form-element.component';

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
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: SelectComponent, multi: true}],
})
export class SelectComponent extends ValueAccessorBase<string | string[]> {
	@Input() placeholder: string = 'Pick an option';
	@Input() options: AppSelectOptions;
	@Input() multiple = false;
	@Input() multipleDisplayedAsAmount = false;
	@Input() clearable = true;
	@Input() public dropdownPosition: string;
	@Input() public customSearchFn: (term: string, item: { id: string; name: string; description: string }) => boolean;
	@Input() public footerElement: TemplateRef<any>;
	@Output() public onSearch = new EventEmitter<string>();
	public currentQueryString: string;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
	) {
		super(parent, controlContainer);
	}

	onTextInput(value: string) {
		this.currentQueryString = value;
		this.onSearch.emit(value);
	}
}
