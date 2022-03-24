import {Component, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'klp-form-toggle',
	templateUrl: './toggle.component.html',
	styleUrls: ['./toggle.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: ToggleComponent, multi: true}],
})
export class ToggleComponent extends ValueAccessorBase<boolean> {
}
