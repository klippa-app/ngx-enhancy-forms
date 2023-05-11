import { AfterViewInit, Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '../value-accessor-base/value-accessor-base.component';
import { AppSelectOptions } from '@klippa/ngx-enhancy-forms';
import { isValueSet } from '../../util/values';

export enum ORIENTATION {
	column = 'column',
	row = 'row'
}

@Component({
	selector: 'klp-form-radio',
	templateUrl: './radio.component.html',
	styleUrls: ['./radio.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: RadioComponent, multi: true }],
})
export class RadioComponent extends ValueAccessorBase<string> implements AfterViewInit{
	@Input() options: AppSelectOptions;
	@Input() orientation: ORIENTATION = ORIENTATION.row;
	@Input() variant: 'classic' | 'button' = 'classic';

	ngAfterViewInit(): void {
		if (!isValueSet(this.innerValue) && isValueSet(this.options)) {
			this.setInnerValueAndNotify(this.options[0].id);
		}
	}
}

