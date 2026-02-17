import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';
import {stringIsSetAndFilled} from '../../util/values';

@Component({
	selector: 'klp-form-checkbox',
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: CheckboxComponent, multi: true}],
	standalone: false
})
export class CheckboxComponent extends ValueAccessorBase<boolean> implements OnInit, OnChanges {
	protected readonly stringIsSetAndFilled = stringIsSetAndFilled;

	@Input() caption: string;
	@Input() description: string;
	@Input() renderUndefinedAsIndeterminate = false;

	protected checkBoxSize!: number;
	protected captionSpacing!: number;

	override ngOnInit(): void {
		super.ngOnInit();
		const sizes = this.calculateCheckboxSize();
		this.checkBoxSize = sizes.size;
		this.captionSpacing = sizes.captionSpacing;
	}

	override ngOnChanges(changes: SimpleChanges): void {
		super.ngOnChanges(changes);
		if (changes.size) {
			const sizes = this.calculateCheckboxSize();
			this.checkBoxSize = sizes.size;
			this.captionSpacing = sizes.captionSpacing;
		}
	}

	private calculateCheckboxSize(): { size: number; captionSpacing: number } {
		switch (this.size) {
			case 'small':
				return { size: 16, captionSpacing: 8 };
			case 'medium':
				return { size: 20, captionSpacing: 10 };
			case 'large':
				return { size: 24, captionSpacing: 12 };
		}
	}
}
