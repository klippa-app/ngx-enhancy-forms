import {Component, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';
import {FormSize, GetSizeClass} from "../../form/form.component";

@Component({
	selector: 'klp-form-password-field',
	templateUrl: './password-field.component.html',
	styleUrls: ['./password-field.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: PasswordFieldComponent, multi: true}],
	standalone: false
})
export class PasswordFieldComponent extends ValueAccessorBase<string> {
	@Input() placeholder = 'Password';
	protected readonly GetSizeClass = GetSizeClass;
	@Input() size: FormSize | null = null;

	constructor() {
		super();

		if (this.parent && !this.size) {
			this.size = this.parent.size;
		}
	}
}
