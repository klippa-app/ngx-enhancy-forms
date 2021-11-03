import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'app-form-sortable-items',
	templateUrl: './sortable-items.component.html',
	styleUrls: ['./sortable-items.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: SortableItemsComponent, multi: true }],
})
export class SortableItemsComponent extends ValueAccessorBase<Array<any>> {
	@ContentChild(TemplateRef) template;
	@Input() sortableItemSize: 'sm' | 'lg' = 'lg';

	itemsOrderChanged = () => {
		this.setInnerValueAndNotify(this.innerValue);
	};
}
