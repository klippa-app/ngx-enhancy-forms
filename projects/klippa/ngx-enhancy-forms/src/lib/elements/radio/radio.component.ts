import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';

export enum Orientation {
	COLUMN = 'column',
	ROW = 'row'
}

export type RadioOptions = Array<RadioOption>;
export type RadioOption = {
	id: any;
	name: string;
	description?: string;
};


@Component({
	selector: 'klp-form-radio',
	templateUrl: './radio.component.html',
	styleUrls: ['./radio.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: RadioComponent, multi: true}],
	standalone: false
})
export class RadioComponent extends ValueAccessorBase<string> implements OnInit, OnChanges {
	@Input() options: RadioOptions;
	@Input() orientation: Orientation = Orientation.ROW;
	@Input() variant: 'classic' | 'button' | 'buttonGray' = 'classic';
	public Orientation = Orientation;

	protected radioSize!: number;
	protected captionSpacing!: number;

	override ngOnInit(): void {
		super.ngOnInit();
		const sizes = this.calculateRadioSize();
		this.radioSize = sizes.size;
		this.captionSpacing = sizes.captionSpacing;
	}

	override ngOnChanges(changes: SimpleChanges): void {
		super.ngOnChanges(changes);
		if (changes.size) {
			const sizes = this.calculateRadioSize();
			this.radioSize = sizes.size;
			this.captionSpacing = sizes.captionSpacing;
		}
	}

	private calculateRadioSize(): { size: number; captionSpacing: number } {
		switch (this.size) {
			case 'small':
				return { size: 16, captionSpacing: 8 };
			case 'medium':
				return { size: 20, captionSpacing: 10 };
			case 'large':
				return { size: 24, captionSpacing: 12 };
		}
	}

	public override setInnerValueAndNotify(value: string): void {
		super.setInnerValueAndNotify(value);
		console.log(this.innerValue)
		console.log(value)
	}
}

