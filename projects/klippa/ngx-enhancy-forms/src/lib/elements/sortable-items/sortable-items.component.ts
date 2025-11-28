import {
	AfterViewInit,
	Component,
	ContentChild,
	ElementRef,
	Host,
	Input,
	NgZone,
	OnInit,
	Optional,
	QueryList,
	TemplateRef,
	ViewChildren,
} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isValueSet} from '../../util/values';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';
import {FormElementComponent} from '../../form/form-element/form-element.component';

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
    standalone: false
})
export class SortableItemsComponent
	extends ValueAccessorBase<Array<any>>
	implements OnInit, AfterViewInit
{
	@ContentChild(TemplateRef) template: TemplateRef<any>;
	@Input() sortableItemSize: 'sm' | 'lg' = 'lg';

	@ViewChildren('dragItem') dragItems: QueryList<ElementRef>;
	public dragSourceIndex: number;
	private currentDragPosition: number;

	private scrollInterval = null;

	constructor(
		@Host() @Optional() protected parent: FormElementComponent,
		@Host() @Optional() protected controlContainer: ControlContainer,
		private ngZone: NgZone)
	{
		super(parent, controlContainer);
	}

	ngAfterViewInit(): void {
		this.setDragItemListeners();
		this.dragItems.changes.subscribe(() => {
			this.setDragItemListeners();
		});
	}

	private setDragItemListeners(): void {
		this.dragItems.forEach(e => {
			this.ngZone.runOutsideAngular(() => {
				e.nativeElement.removeEventListener('dragstart', this.onDragStart);
				e.nativeElement.removeEventListener('dragover', this.onDragOver);
				e.nativeElement.removeEventListener('dragenter', this.onDragEnter);
				e.nativeElement.removeEventListener('dragend', this.onDragEnd);

				e.nativeElement.addEventListener('dragstart', this.onDragStart);
				e.nativeElement.addEventListener('dragover', this.onDragOver);
				e.nativeElement.addEventListener('dragenter', this.onDragEnter);
				e.nativeElement.addEventListener('dragend', this.onDragEnd);

				e.nativeElement.querySelector('.visual').style.transform = `translateY(0%)`;
			});
		});
	}

	private onDragOver = (ev) => {
		ev.preventDefault();
	}

	private onDragEnter = (ev) => {
		if (ev.clientY < 80) {
			this.scrollPage(40);
		} else if (window.innerHeight - ev.clientY < 80) {
			this.scrollPage(-40);
		} else {
			this.stopScrolling();
		}
		ev.dataTransfer.dropEffect = 'move';
		const targetIndex = this.dragItems.map(e => e.nativeElement).findIndex(e => e === (ev.target as HTMLElement));
		if (targetIndex === -1) {
			return;
		}
		this.currentDragPosition = targetIndex;
		this.dragItems.forEach((dragItem, i) => {
			if (this.dragSourceIndex === i) {

				if (this.dragSourceIndex > this.currentDragPosition) {
					const heightsAbove = this.dragItems.filter((e, i) => {
						if (i >= this.dragSourceIndex) {
							return false;
						}
						return i > this.currentDragPosition - 1;
					}).reduce((acc, cur, i) => {
						return acc + cur.nativeElement.getBoundingClientRect().height;
					}, 0);
					dragItem.nativeElement.querySelector('.visual').style.transform = `translateY(${-heightsAbove}px)`;
				}

				else if (this.dragSourceIndex < this.currentDragPosition) {
					const heightsAbove = this.dragItems.filter((e, i) => {
						if (i <= this.dragSourceIndex) {
							return false;
						}
						return i <= this.currentDragPosition;
					}).reduce((acc, cur, i) => {
						return acc + cur.nativeElement.getBoundingClientRect().height;
					}, 0);
					dragItem.nativeElement.querySelector('.visual').style.transform = `translateY(${heightsAbove}px)`;
				}

				else {
					dragItem.nativeElement.querySelector('.visual').style.transform = `translateY(${0}px)`;
				}

				return;
			}

			const heightOfCurrentlyDraggedItem = (this.dragItems.get(this.dragSourceIndex).nativeElement.getBoundingClientRect().height);
			if (this.shouldShoveDown(i)) {
				dragItem.nativeElement.querySelector('.visual').style.transform = `translateY(${heightOfCurrentlyDraggedItem}px)`;
			}
			else if (this.shouldShoveUp(i)) {
				dragItem.nativeElement.querySelector('.visual').style.transform = `translateY(${-heightOfCurrentlyDraggedItem}px)`;
			}
			else {
				dragItem.nativeElement.querySelector('.visual').style.transform = `translateY(0%)`;
			}
		});

		this.currentDragPosition = targetIndex;
	}

	private onDragStart = (ev) => {
		ev.dataTransfer.effectAllowed = 'move';
		this.ngZone.run(() => {
			this.dragSourceIndex = this.dragItems.map(e => e.nativeElement).findIndex(e => e === ev.target);
			this.currentDragPosition = this.dragSourceIndex;
		});
	};

	private onDragEnd = (ev) => {
		this.stopScrolling();
		const movedElement = this.innerValue[this.dragSourceIndex];
		const isMovedToLastPlace = this.currentDragPosition === this.innerValue.length - 1;
		this.ngZone.run(() => {
			this.innerValue = this.innerValue
			.filter((e, i) => i !== this.dragSourceIndex)
			.reduce((acc, cur, i) => {
				if (i === this.currentDragPosition) {
					return [...acc, movedElement, cur];
				}
				return [...acc, cur];
			}, []);
			if (isMovedToLastPlace) {
				this.innerValue = [...this.innerValue, movedElement];
			}
			this.dragItems.forEach((dragItem, i) => {
				dragItem.nativeElement.querySelector('.visual').style.transform = `translateY(0%)`;
			});
			this.currentDragPosition = -1;
			this.dragSourceIndex = -1;
			this.setInnerValueAndNotify(this.innerValue);
		});
	}

	shouldShoveDown(index: number): boolean {
		return this.dragSourceIndex > index && this.currentDragPosition <= index;
	}

	shouldShoveUp(index: number): boolean {
		return this.dragSourceIndex < index && this.currentDragPosition >= index;
	}

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
