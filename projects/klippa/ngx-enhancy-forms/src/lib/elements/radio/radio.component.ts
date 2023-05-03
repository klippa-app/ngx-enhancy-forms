import {Component, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '@klippa/ngx-enhancy-forms';

@Component({
	selector: 'klp-form-radio',
	templateUrl: './radio.component.html',
	styleUrls: ['./radio.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: RadioComponent, multi: false }],
})
export class RadioComponent extends ValueAccessorBase<boolean> {
	@Input() items: Array<string> = [];
	@Input() caption: string;
	@Input() renderUndefinedAsIndeterminate = false;
}

