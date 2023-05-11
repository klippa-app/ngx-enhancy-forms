import {
	Component,
	ContentChild,
	Input,
	OnInit,
	TemplateRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Options } from 'sortablejs';
import { isValueSet } from '../../util/values';
import { ValueAccessorBase } from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'klp-form-sortable-items',
	templateUrl: './sortable-items.component.html',
	styleUrls: ['./sortable-items.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: SortableItemsComponent,
			multi: true,
		},
	],
})
export class SortableItemsComponent
	extends ValueAccessorBase<Array<any>>
	implements OnInit
{
	@ContentChild(TemplateRef) template;
	@Input() sortableItemSize: 'sm' | 'lg' = 'lg';
	@Input() useCustomScroll = false;

	public sortablejsOptions: Options;
	private scrollInterval = null;

	ngOnInit(): void {
		super.ngOnInit();
		if (this.useCustomScroll) {
			this.sortablejsOptions = {
				onUpdate: this.itemsOrderChanged,
				onMove: this.onItemDrag,
				onEnd: this.onEnd,
			};
		} else {
			this.sortablejsOptions = { onUpdate: this.itemsOrderChanged };
		}
	}

	itemsOrderChanged = () => {
		this.setInnerValueAndNotify(this.innerValue);
	};

	onItemDrag = (data) => {
		// if the item you're dragging is reaching the top, start scrolling.
		if (data.relatedRect.top < 100) {
			this.scrollPage(100);
		} else {
			this.stopScrolling();
		}
	};

	onEnd = () => {
		this.stopScrolling();
	};

	private scrollPage(scrollAmount: number): void {
		if (!isValueSet(this.scrollInterval)) {
			this.scrollInterval = setInterval(() => {
				window.scroll({
					top: document.scrollingElement.scrollTop - scrollAmount,
					behavior: 'smooth',
				});
				if (document.scrollingElement.scrollTop <= 100) {
					this.stopScrolling();
				}
			}, 100);
		}
	}

	private stopScrolling(): void {
		clearInterval(this.scrollInterval);
		this.scrollInterval = null;
	}
}
