import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'klp-form-checkbox',
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CheckboxComponent, multi: true }],
})
export class CheckboxComponent extends ValueAccessorBase<boolean> {
	@Input() caption: string;
	@Input() disabled: boolean;
}
