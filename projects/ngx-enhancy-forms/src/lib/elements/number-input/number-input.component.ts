import {Component, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'lib-enhancy-forms-form-number-input',
	templateUrl: './number-input.component.html',
	styleUrls: ['./number-input.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: NumberInputComponent, multi: true}],
})
export class NumberInputComponent extends ValueAccessorBase<string> {
	@Input() placeholder: string;
}
