import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'klp-form-radio',
	templateUrl: './radio.component.html',
	styleUrls: ['./radio.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: RadioComponent, multi: true }],
})
export class RadioComponent extends ValueAccessorBase<boolean> {
	@Input() items: Array<string> = [];
	@Input() caption: string;
	@Input() renderUndefinedAsIndeterminate = false;
}

