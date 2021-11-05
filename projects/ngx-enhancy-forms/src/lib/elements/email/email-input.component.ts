import {Component, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'lib-enhancy-forms-form-email-input',
	templateUrl: './email-input.component.html',
	styleUrls: ['./email-input.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: EmailInputComponent, multi: true}],
})
export class EmailInputComponent extends ValueAccessorBase<string> {
	@Input() placeholder: string;
}
