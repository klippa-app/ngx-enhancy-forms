import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {ValueAccessorBase} from "../value-accessor-base/value-accessor-base.component";

@Component({
	selector: 'klp-form-text-input',
	templateUrl: './text-input.component.html',
	styleUrls: ['./text-input.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: TextInputComponent, multi: true }],
})
export class TextInputComponent extends ValueAccessorBase<string> {
	@Input() placeholder: string;
	@Input() type: 'text' | 'password' = 'text';
}
