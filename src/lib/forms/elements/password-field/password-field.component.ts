import { Component } from '@angular/core';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-password-field',
	templateUrl: './password-field.component.html',
	styleUrls: ['./password-field.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: PasswordFieldComponent, multi: true }],
})
export class PasswordFieldComponent extends ValueAccessorBase<string> {}
