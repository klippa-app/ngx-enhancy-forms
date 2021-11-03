import { Component, Input } from '@angular/core';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-toggleable-setting',
	templateUrl: './toggleable-setting.component.html',
	styleUrls: ['./toggleable-setting.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: ToggleableSettingComponent, multi: true }],
})
export class ToggleableSettingComponent extends ValueAccessorBase<boolean> {
	@Input() caption: string;
	@Input() tooltip: string;

	toggle() {
		this.innerValue = !this.innerValue;
		this.setInnerValueAndNotify(this.innerValue);
	}
}
