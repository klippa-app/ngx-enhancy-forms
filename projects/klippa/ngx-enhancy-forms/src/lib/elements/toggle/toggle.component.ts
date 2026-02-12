import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';
import {stringIsSetAndFilled} from '../../util/values';

@Component({
	selector: 'klp-form-toggle',
	templateUrl: './toggle.component.html',
	styleUrls: ['./toggle.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: ToggleComponent, multi: true}],
	standalone: false
})
export class ToggleComponent extends ValueAccessorBase<boolean> implements OnInit, OnChanges {
	protected readonly stringIsSetAndFilled = stringIsSetAndFilled;

	@Input() transparentBackground = true;
	@Input() caption: string;
	@Input() description: string;

	protected toggleWidth!: number;
	protected toggleHeight!: number;
	protected captionSpacing!: number;

	override ngOnInit(): void {
		super.ngOnInit();
		const sizes = this.calculateToggleSize();
		this.toggleWidth = sizes.width;
		this.toggleHeight = sizes.height;
		this.captionSpacing = sizes.captionSpacing;
	}

	override ngOnChanges(changes: SimpleChanges): void {
		super.ngOnChanges(changes);
		if (changes.size) {
			const sizes = this.calculateToggleSize();
			this.toggleWidth = sizes.width;
			this.toggleHeight = sizes.height;
			this.captionSpacing = sizes.captionSpacing;
		}
	}

	private calculateToggleSize(): { width: number; height: number; captionSpacing: number } {
		switch (this.size) {
			case 'small':
				return { width: 36, height: 20, captionSpacing: 8 };
			case 'medium':
				return { width: 44, height: 24, captionSpacing: 12 };
			case 'large':
				return { width: 54, height: 32, captionSpacing: 12 };
		}
	}
}
