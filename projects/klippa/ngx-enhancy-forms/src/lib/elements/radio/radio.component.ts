import { Component, Input} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '../value-accessor-base/value-accessor-base.component';

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
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: RadioComponent, multi: true }],
})
export class RadioComponent extends ValueAccessorBase<string>{
	@Input() options: RadioOptions;
	@Input() orientation: Orientation = Orientation.ROW;
	@Input() variant: 'classic' | 'button' = 'classic';
	public Orientation = Orientation;
}

