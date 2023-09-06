import {
	AfterViewInit,
	Component,
	ContentChild,
	Directive,
	ElementRef,
	EventEmitter,
	Host,
	Inject,
	InjectionToken,
	Input,
	OnChanges, OnDestroy,
	Optional,
	Output,
	SimpleChanges,
	TemplateRef,
	ViewChild
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

@Directive({ selector: '[klpSelectOptionTpl]' })
export class KlpSelectOptionTemplateDirective {}

@Component({
	selector: 'klp-form-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: SelectComponent, multi: true}],
})
export class SelectComponent extends ValueAccessorBase<string | string[]> implements OnChanges, AfterViewInit, OnDestroy{
	@Input() placeholder: string;
	@Input() prefix: string;
	@Input() orientation: 'vertical' | 'horizontal' = 'horizontal';
	@Input() options: AppSelectOptions;
	@Input() multiple = false;
	@Input() multipleDisplayedAsAmount = false;
	@Input() clearable = true;
	@Input() truncateOptions = true;
	@Input() withSeparatingLine = false;
	@Input() searchable = true;
	@Input() public dropdownPosition: 'auto' | 'bottom' | 'top' | 'left' | 'right' = null;
	@Input() public customSearchFn: (term: string, item: { id: string; name: string; description: string }) => boolean;
	@Input() public footerElement: TemplateRef<any>;
	@Output() public onSearch = new EventEmitter<string>();
	@Output() public onEndReached = new EventEmitter<void>();
	@Output() public onOpened = new EventEmitter<void>();
	@Output() public onClosed = new EventEmitter<void>();
	@Output() public onBlur = new EventEmitter<void>();
	@Output() public onClear = new EventEmitter<void>();
	@Output() public onEnterKey = new EventEmitter<string>();
	@ViewChild('ngSelect') ngSelect;
	@ContentChild(KlpSelectOptionTemplateDirective, { read: TemplateRef }) customOptionTpl: TemplateRef<any>;

	private lastItemIndexReached = -1;
	public dropdownPositionToUse: 'auto' | 'bottom' | 'top' | 'left' | 'right' = 'bottom';

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
		@Inject(SELECT_TRANSLATIONS) @Optional() private translations: any,
		private elRef: ElementRef,
	) {
		super(parent, controlContainer);
	}

	ngAfterViewInit(): void {
		this.addPrefix();
		this.elRef.nativeElement.querySelector('input').addEventListener('keydown', this.keyListener);
	}

	private keyListener = (e) => {
		if (e.key === 'Enter') {
			this.onEnterKey.emit(e.target.value);
		}
	}

	private addPrefix(): void {
		if (stringIsSetAndFilled(this.prefix)) {
			const container = this.elRef.nativeElement.querySelector('.ng-select-container');
			const newNode = document.createElement('div');
			newNode.className = 'prefix';
			newNode.innerText = this.prefix;
			container.insertBefore(newNode, container.children[0]);
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (isValueSet(changes.options)) {
			this.lastItemIndexReached = -1;
			this.setWidthBasedOnOptionsWidths();
		}
		this.dropdownPositionToUse = this.dropdownPosition;
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
		this.setWidthBasedOnOptionsWidths();
	}

	searchQueryChanged(searchQuery: string): void {
		this.onSearch.emit(searchQuery);
	}

	onOpen(): void {
		if (this.orientation === 'horizontal' && !isValueSet(this.dropdownPosition)) {
			this.determineDropdownPosition();
		}
		// waiting for the thing to render until we fire the event
		setTimeout(() => {
			this.onOpened.emit();
			this.setWidthBasedOnOptionsWidths();
		});
	}

	private setWidthBasedOnOptionsWidths(): void {
		if (this.truncateOptions === false) {
			setTimeout(() => {
				const widths: Array<number> = Array.from(this.elRef.nativeElement.querySelectorAll('.ng-option div')).map(
					(e: any) => e.scrollWidth,
				);
				const maxWidth = Math.max(...widths);
				const dropdownPanel = this.elRef.nativeElement.querySelector('ng-dropdown-panel');
				if (dropdownPanel) {
					dropdownPanel.style.width = `${Math.max(this.elRef.nativeElement.clientWidth, maxWidth + 40, dropdownPanel.getBoundingClientRect().width)}px`;
				}

				let limitingParentContainer = this.elRef.nativeElement;
				while (limitingParentContainer.parentElement && !this.isLimitingContainer(limitingParentContainer)) {
					limitingParentContainer = limitingParentContainer.parentElement;
				}

				if (dropdownPanel) {
					const spaceInParent = limitingParentContainer.clientWidth;
					const spaceLeftOfElRef = this.elRef?.nativeElement.getBoundingClientRect().left - limitingParentContainer.getBoundingClientRect().left;
					const spaceRightOfElRef = spaceInParent - spaceLeftOfElRef;
					const shiftToLeft = dropdownPanel?.clientWidth - spaceRightOfElRef + 20;
					if (shiftToLeft > 0) {
						dropdownPanel.style.left = `-${shiftToLeft}px`;
					}
				}
			});
		}
	}

	private determineDropdownPosition(): void {
		let current = this.elRef.nativeElement;
		while (current.parentElement && !this.isLimitingContainer(current)) {
			current = current.parentElement;
		}
		const topSpace = this.elRef.nativeElement.getBoundingClientRect().top - current.getBoundingClientRect().top;
		const bottomSpace = current.clientHeight - topSpace;
		if (bottomSpace >= 285) {
			this.dropdownPositionToUse = 'bottom';
		} else {
			this.dropdownPositionToUse = 'top';
		}
	}

	private isLimitingContainer(element: Element): boolean {
		const style = getComputedStyle(element);
		if (style.overflowY === 'auto') {
			return true;
		}
		if (style.overflow === 'auto') {
			return true;
		}
		if (style.overflowY === 'scroll') {
			return true;
		}
		if (style.overflow === 'scroll') {
			return true;
		}
		return false;
	}

	public focus = (): void => {
		this.ngSelect.focus();
	}
	public close = (): void => {
		this.ngSelect.close();
	}

	public onClose(): void {
		// Give angular a second to render the closed situation before emitting the close event
		setTimeout(() => {
			this.onClosed.emit();
		});
	}

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.elRef.nativeElement?.querySelector('input')?.removeEventListener('keydown', this.keyListener);
	}
}
