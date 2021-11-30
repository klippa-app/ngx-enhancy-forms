import {Component, Input} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {ValueAccessorBase} from "../value-accessor-base/value-accessor-base.component";

@Component({
	selector: 'klp-password-field',
	templateUrl: './password-field.component.html',
	styleUrls: ['./password-field.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: PasswordFieldComponent, multi: true }],
})
export class PasswordFieldComponent extends ValueAccessorBase<string> {
	@Input() placeholder = 'Password';
}
