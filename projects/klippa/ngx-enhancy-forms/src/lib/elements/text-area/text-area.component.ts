import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'klp-form-text-area',
	templateUrl: './text-area.component.html',
	styleUrls: ['./text-area.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: TextAreaComponent, multi: true}],
})
export class TextAreaComponent extends ValueAccessorBase<string> {
	@Input() placeholder: string;
	@Output() onBlur = new EventEmitter<void>();
}
