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
	Input, NgZone,
	OnChanges,
	OnDestroy,
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
import {awaitableForNextCycle} from '../../util/angular';

export type AppSelectOptions = Array<AppSelectOption>;
export type AppSelectOption = {
	id: any;
	name: string;
	description?: string;
	active?: boolean;
	disabled?: boolean;
};

export const SELECT_TRANSLATIONS = new InjectionToken<any>('klp.form.select.translations');

@Directive({
	selector: '[klpSelectOptionTpl]',
	standalone: false
})
export class KlpSelectOptionTemplateDirective {
}

@Component({
	selector: 'klp-form-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: SelectComponent, multi: true}],
	standalone: false
})
export class SelectComponent extends ValueAccessorBase<string | string[]> implements OnChanges, AfterViewInit, OnDestroy {
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
	@Input() hasBorderLeft = true;
	@Input() hasBorderRight = true;
	@Input() public dropdownPosition: 'auto' | 'bottom' | 'top' | 'left' | 'right' = null;
	@Input() public dropdownAlignment: 'left' | 'right' = 'left';
	@Input() public customSearchFn: (term: string, item: { id: string; name: string; description: string }) => boolean;
	@Input() public footerElement: TemplateRef<any>;
	@Input() public size: 'small' | 'medium' | 'large' = 'medium';
	@Input() prefixTpl: TemplateRef<any> | null = null;
	@Input() suffixTpl: TemplateRef<any> | null = null;
	@Output() public onSearch = new EventEmitter<string>();
	@Output() public onEndReached = new EventEmitter<void>();
	@Output() public onOpened = new EventEmitter<void>();
	@Output() public onClosed = new EventEmitter<void>();
	@Output() public onBlur = new EventEmitter<void>();
	@Output() public onClear = new EventEmitter<void>();
	@Output() public onEnterKey = new EventEmitter<string>();
	@ViewChild('ngSelect') ngSelect;
	@ViewChild('tailRef') tailRef: ElementRef;
	@ViewChild('tailMockRef') tailMockRef: ElementRef;
	@ContentChild(KlpSelectOptionTemplateDirective, {read: TemplateRef}) customOptionTpl: TemplateRef<any>;

	private lastItemIndexReached = -1;
	public dropdownPositionToUse: 'auto' | 'bottom' | 'top' | 'left' | 'right' = 'bottom';
	private isOpen = false;
	private dropdownPanelOffsetX = 0;
	private dropdownPanelOffsetY = 0;
	private anchorAbsolute: HTMLDivElement;
	private anchorFixed: HTMLDivElement;
	private resizeObserver?: ResizeObserver;

	constructor(
		@Optional() @Host() protected parent: FormElementComponent,
		@Optional() @Host() protected controlContainer: ControlContainer,
		@Inject(SELECT_TRANSLATIONS) @Optional() private translations: any,
		private elRef: ElementRef,
		private ngZone: NgZone,
	) {
		super(parent, controlContainer);
	}

	ngAfterViewInit(): void {
		this.addPrefix();
		this.addTail();
		this.createSizeObservers();
		this.updateTailPosition();
		this.elRef.nativeElement.querySelector('input').addEventListener('keydown', this.keyListener);
	}

	private keyListener = (e) => {
		if (e.key === 'Enter') {
			this.onEnterKey.emit(e.target.value);

		}
	}

	private addTail(): void {
		if (this.tailMockRef) {
			const container = this.elRef.nativeElement.querySelector('.ng-select-container');
			const arrowWrapper = this.elRef.nativeElement.querySelector('.ng-arrow-wrapper');
			container.insertBefore(this.tailMockRef.nativeElement, arrowWrapper);
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

	private createSizeObservers(): void {
		const ngInput = this.elRef.nativeElement.querySelector('.ng-select');
		const arrowWrapper = this.elRef.nativeElement.querySelector('.ng-arrow-wrapper');
		const prefixElement = this.elRef.nativeElement.querySelector('.prefix-tpl');

		const elementsToObserve: HTMLElement[] = [];
		if (ngInput) {
			elementsToObserve.push(ngInput);
		}
		if (arrowWrapper) {
			elementsToObserve.push(arrowWrapper);
		}
		if (prefixElement) {
			elementsToObserve.push(prefixElement);
		}

		this.resizeObserver = new ResizeObserver(() => {
			this.updateTailPosition();
		});

		elementsToObserve.forEach(el => this.resizeObserver.observe(el));
	}

	private updateTailPosition(): void {
		if (this.tailRef) {
			let offset = 0;

			const ngInput = this.elRef.nativeElement.querySelector('.ng-select');
			const arrowWrapper = this.elRef.nativeElement.querySelector('.ng-arrow-wrapper');
			if (ngInput && arrowWrapper) {
				offset += ngInput.getBoundingClientRect().width;
				offset -= arrowWrapper.getBoundingClientRect().width;
				offset -= 16;
			}

			if (this.prefixTpl) {
				const prefixElement = this.elRef.nativeElement.querySelector('.prefix-tpl');
				offset += prefixElement.getBoundingClientRect().width;
			}

			this.tailRef.nativeElement.style.left = `${offset}px`;

			switch (this.size) {
				case 'small':
					this.tailRef.nativeElement.style.top = '8px';
					break;
				case 'medium':
					this.tailRef.nativeElement.style.top = '10px';
					break;
				case 'large':
					this.tailRef.nativeElement.style.top = '12px';
					break;
			}
		}
	}

	async ngOnChanges(changes: SimpleChanges): Promise<void> {
		if (this.isOpen && isValueSet(changes.options)) {
			this.lastItemIndexReached = -1;
			// waiting for the thing to render until we fire the event
			await awaitableForNextCycle();
			await this.setWidthBasedOnOptionsWidths();
		}
		if (changes.dropdownPosition) {
			this.dropdownPositionToUse = this.dropdownPosition;
		}
		if (changes.prefix) {
			const container = this.elRef?.nativeElement?.querySelector('.ng-select-container .prefix');
			if (isValueSet(container)) {
				container.innerText = changes.prefix.currentValue;
			}
			this.updateTailPosition();
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
		this.setWidthBasedOnOptionsWidths();
	}

	searchQueryChanged(searchQuery: string): void {
		this.onSearch.emit(searchQuery);
	}

	async onOpen(): Promise<void> {
		this.isOpen = true;

		if (this.orientation === 'horizontal' && !isValueSet(this.dropdownPosition)) {
			this.determineDropdownPosition();
		}

		if (!this.truncateOptions) {
			this.createAnchors();
		}
		// waiting for the thing to render until we fire the event
		await awaitableForNextCycle();
		this.onOpened.emit();

		await this.setWidthBasedOnOptionsWidths();
		if (!this.truncateOptions) {
			this.setFixedDropdownPanelPosition();
			this.ngZone.runOutsideAngular(() => {
				[...this.getAllLimitingContainers(), window].forEach(e => e.addEventListener('scroll', this.setFixedDropdownPanelPosition));
			});
		}
	}

	private createAnchors(): void {
		this.anchorAbsolute = document.createElement('div');
		if (this.dropdownPositionToUse === 'top') {
			this.elRef.nativeElement.prepend(this.anchorAbsolute);
		} else {
			this.elRef.nativeElement.appendChild(this.anchorAbsolute);
		}

		this.anchorFixed = document.createElement('div');
		this.anchorFixed.style.position = 'fixed';
		this.elRef.nativeElement.appendChild(this.anchorFixed);
	}

	private removeAnchors(): void {
		this.elRef.nativeElement.removeChild(this.anchorAbsolute);
		this.elRef.nativeElement.removeChild(this.anchorFixed);
	}

	private setFixedDropdownPanelPosition = () => {
		const dropdownPanel = this.elRef.nativeElement.querySelector('ng-dropdown-panel');
		dropdownPanel.style.visibility = 'initial';
		if (this.orientation === 'vertical') {
			return;
		}
		const difference = this.anchorAbsolute.getBoundingClientRect().top - this.anchorFixed.getBoundingClientRect().top;
		this.dropdownPanelOffsetY = difference;

		dropdownPanel.style.position = 'fixed';
		this.setPanelOffsets();
	}

	private setWidthBasedOnOptionsWidths = async (): Promise<void> => {
		if (this.truncateOptions === false) {
			await awaitableForNextCycle();
			if (!isValueSet(this.elRef.nativeElement.querySelector('.scrollable-content'))) {
				const panel = this.elRef.nativeElement.querySelector('ng-dropdown-panel');
				panel.style.width = `${this.elRef.nativeElement.clientWidth}px`;
				return;
			}
			this.elRef.nativeElement.querySelector('.scrollable-content').classList.add('calculatingWidths');
			const paddingForScrollbar = this.getScrollbarWidth();
			const maxWidth = this.elRef.nativeElement.querySelector('.scrollable-content').getBoundingClientRect().width + paddingForScrollbar;
			this.elRef.nativeElement.querySelector('.scrollable-content').classList.remove('calculatingWidths');
			const dropdownPanel = this.elRef.nativeElement.querySelector('ng-dropdown-panel');
			if (dropdownPanel) {
				dropdownPanel.style.minWidth = `${this.elRef.nativeElement.clientWidth}px`;
				dropdownPanel.style.width = `${Math.max(this.elRef.nativeElement.clientWidth, maxWidth, dropdownPanel.getBoundingClientRect().width)}px`;
				await awaitableForNextCycle();
				const pickerWidth = this.elRef.nativeElement.getBoundingClientRect().width;
				const dropdownPanelWidth = dropdownPanel.getBoundingClientRect().width;

				const spaceLeftOfElRef = this.elRef.nativeElement.getBoundingClientRect().left;
				const spaceRightOfElRef = window.innerWidth - (this.elRef.nativeElement.getBoundingClientRect().width + spaceLeftOfElRef);
				const extraNeededSpace = dropdownPanelWidth - pickerWidth;
				if (this.dropdownAlignment === 'right') {
					if (extraNeededSpace > spaceLeftOfElRef) {
						this.dropdownPanelOffsetX = -spaceLeftOfElRef + 10;
					} else {
						this.dropdownPanelOffsetX = -extraNeededSpace;
					}
				} else if (extraNeededSpace > spaceRightOfElRef) {
					this.dropdownPanelOffsetX = -extraNeededSpace + spaceRightOfElRef - 20;
				}
				this.setPanelOffsets();
			}
		}
	}

	private getAllLimitingContainers(): Array<HTMLElement> {
		const result = [];
		let current = this.elRef.nativeElement;
		while (current.parentElement) {
			if (this.isLimitingContainer(current.parentElement)) {
				result.push(current.parentElement);
			}
			current = current.parentElement;
		}
		return result;
	}

	private setPanelOffsets(): void {
		const dropdownPanel = this.elRef.nativeElement.querySelector('ng-dropdown-panel');
		if (!isValueSet(dropdownPanel)) {
			return;
		}
		const componentContainer = this.elRef.nativeElement.querySelector('.componentContainer');
		const ngSelect = this.elRef.nativeElement.querySelector('ng-select');
		const containerRect = componentContainer.getBoundingClientRect();
		const ngSelectRect = ngSelect.getBoundingClientRect();
		// Calculate horizontal offset to align panel with container
		const horizontalOffset = containerRect.left - ngSelectRect.left;
		const scrollPositionOffset = `translate(${this.dropdownPanelOffsetX + horizontalOffset}px, ${this.dropdownPanelOffsetY}px)`;
		const offsetToContainerBottom = containerRect.bottom - ngSelectRect.bottom;
		let dropdownPositionOffset = `translateY(${offsetToContainerBottom + 8}px)`;

		if (this.dropdownPositionToUse === 'top') {
			dropdownPositionOffset = `translateY(-100%) ${dropdownPositionOffset} translateY(-16px)`;
		}

		if (this.orientation === 'vertical') {
			dropdownPanel.style.transformOrigin = 'top left';
			dropdownPanel.style.transform = `rotate(90deg) translateY(-${this.elRef.nativeElement.getBoundingClientRect().width}px)`;
		} else {
			dropdownPanel.style.transform = [scrollPositionOffset, dropdownPositionOffset].join(' ');
		}
	}

	private determineDropdownPosition(): void {
		const bottomSpace = window.innerHeight - this.elRef.nativeElement.getBoundingClientRect().top;
		if (bottomSpace >= 330) {
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

	public open = (): void => {
		this.ngSelect.open();
	}

	public close = (): void => {
		this.ngSelect.close();
	}

	public onClose(): void {
		[...this.getAllLimitingContainers(), window].forEach(e => e.removeEventListener('scroll', this.setFixedDropdownPanelPosition));
		// Give angular a second to render the closed situation before emitting the close event
		setTimeout(() => {
			this.isOpen = false;
			if (!this.truncateOptions) {
				this.removeAnchors();
			}
			this.onClosed.emit();
		});
	}

	onFocus(): void {
		const singleValueInputElement = this.elRef.nativeElement.querySelector('.ng-select-single .ng-input');
		const prefixElement = this.elRef.nativeElement.querySelector('.ng-select-single .prefix');
		if (isValueSet(singleValueInputElement) && isValueSet(prefixElement)) {
			const prefixWidth = prefixElement.getBoundingClientRect().width;
			const spacing = '0.4rem';
			singleValueInputElement.style.left = `calc(${prefixWidth}px + ${spacing})`;
		} else if (isValueSet(singleValueInputElement)) {
			singleValueInputElement.style.left = `0px`;
		}
	}

	private getScrollbarWidth(): number {
		// Create a temporary div element
		const div = document.createElement('div');

		// Set the style to measure the scrollbar
		div.style.overflow = 'scroll'; // Enable scrollbar
		div.style.width = '100px';      // Set a fixed width
		div.style.height = '100px';     // Set a fixed height
		div.style.position = 'absolute'; // Prevent the element from taking space in the layout
		div.style.top = '-9999px';      // Position it out of the viewport

		// Append the element to the body
		document.body.appendChild(div);

		// Get the width of the scrollbar
		const scrollbarWidth = div.offsetWidth - div.clientWidth;

		// Remove the temporary element from the DOM
		document.body.removeChild(div);

		return scrollbarWidth;
	}

	ngOnDestroy(): void {
		super.ngOnDestroy();
		this.elRef.nativeElement?.querySelector('input')?.removeEventListener('keydown', this.keyListener);
		this.resizeObserver?.disconnect();
	}
}
