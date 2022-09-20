import {
	Component, ElementRef,
	EventEmitter,
	Host,
	Inject,
	InjectionToken,
	Input,
	OnChanges,
	Optional,
	Output,
	SimpleChanges,
	TemplateRef, ViewChild
} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';
import {FormElementComponent} from '../../form/form-element/form-element.component';
import {isValueSet, stringIsSetAndFilled} from '../../util/values';

export type AppSelectOptions = Array<AppSelectOption>;
export type AppSelectOption = {
	id: any;
	name: string;
	description?: string;
	active?: boolean;
	disabled?: boolean;
};

export const SELECT_TRANSLATIONS = new InjectionToken<any>('klp.form.select.translations');

@Component({
	selector: 'klp-form-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: SelectComponent, multi: true}],
})
export class SelectComponent extends ValueAccessorBase<string | string[]> implements OnChanges{
	@Input() placeholder: string;
	@Input() options: AppSelectOptions;
	@Input() multiple = false;
	@Input() multipleDisplayedAsAmount = false;
	@Input() clearable = true;
	@Input() public dropdownPosition: string;
	@Input() public customSearchFn: (term: string, item: { id: string; name: string; description: string }) => boolean;
	@Input() public footerElement: TemplateRef<any>;
	@Output() public onSearch = new EventEmitter<string>();
	@Output() public onEndReached = new EventEmitter<void>();
	@Output() public onOpened = new EventEmitter<void>();
	@ViewChild('ngSelect') ngSelect;

	private lastItemIndexReached = -1;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
		@Inject(SELECT_TRANSLATIONS) @Optional() private translations: any,
		private elRef: ElementRef,
	) {
		super(parent, controlContainer);
	}


	ngOnChanges(changes: SimpleChanges): void {
		if (isValueSet(changes.options)) {
			this.lastItemIndexReached = -1;
		}
	}

	getDefaultTranslation(key: string): (x: any) => string {
		switch (key) {
			case 'placeholder':
				return () => 'Pick an option';
			case 'amountSelected':
				return (amount) => `${amount} selected`;
		}
	}

	getTranslation(key: string, params: any = null): string {
		if (key === 'placeholder' && stringIsSetAndFilled(this.placeholder)) {
			return this.placeholder;
		}
		return this.translations?.[key]?.(params) ?? this.getDefaultTranslation(key)(params);
	}

	onScroll(lastItemIndex: number): void {
		const visibleItems = this.ngSelect?.itemsList?.filteredItems?.length ?? 0;
		if (this.lastItemIndexReached < lastItemIndex && lastItemIndex === visibleItems) {
			this.onEndReached.emit();
		}
		this.lastItemIndexReached = Math.max(lastItemIndex, this.lastItemIndexReached);
	}

	searchQueryChanged(searchQuery: string): void {
		this.onSearch.emit(searchQuery);
	}

	onOpen(): void {
		// waiting for the thing to render until we fire the event
		setTimeout(() => {
			this.onOpened.emit();
		});
	}
}
