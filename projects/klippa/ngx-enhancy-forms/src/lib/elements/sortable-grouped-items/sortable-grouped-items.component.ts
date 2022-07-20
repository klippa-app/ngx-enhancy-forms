import {Component} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {arrayIsSetAndFilled, splitArrayByCondition} from '../../util/arrays';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'klp-form-sortable-grouped-items',
	templateUrl: './sortable-grouped-items.component.html',
	styleUrls: ['./sortable-grouped-items.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: SortableGroupedItemsComponent, multi: true}],
})
export class SortableGroupedItemsComponent<T> extends ValueAccessorBase<Array<Array<T>>> {
	public items: Array<T | string>;
	reloader = true; // sortable items doesnt correctly update, so we have this boolean that flips to rerender the sortable items comp

	writeValue(value: Array<Array<T>>): void {
		super.writeValue(value);
		this.reloader = false;
		setTimeout(() => {
			if (arrayIsSetAndFilled(value)) {
				this.items = value.flatMap(e => [...e, '']);
			} else {
				this.items = [];
			}
			this.reloader = true;
		});
	}

	public onItemsRearranged(value: Array<T | string>): void {
		const result: Array<Array<T>> = splitArrayByCondition(value, e => e === '').filter(arrayIsSetAndFilled) as any;
		this.setInnerValueAndNotify(result);
		this.reloader = false;
		setTimeout(() => {
			this.items = [...this.items, ''].filter((e, i) => {
				if (i === 0 && e === '') {
					return false;
				}
				if (e === '' && this.items[i - 1] === '') {
					return false;
				}
				return true;
			});
			this.reloader = true;
		});
	}
}
