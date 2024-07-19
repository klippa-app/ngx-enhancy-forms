import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'klp-form-text-input',
	templateUrl: './text-input.component.html',
	styleUrls: ['./text-input.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: TextInputComponent, multi: true}],
})
export class TextInputComponent extends ValueAccessorBase<string> {
	private isPeakingPassword = false;

	@Input() placeholder: string;
	@Input() type: 'text' | 'password' = 'text';
	@Input() clearable = false;
	@Input() icon: 'search';
	@Input() hasBorderLeft = true;
	@Input() hasBorderRight = true;
	@Input() passwordPeakIcon: TemplateRef<any>;
	@Output() onBlur = new EventEmitter<void>();

	public togglePeakPassword(): void {
		this.isPeakingPassword = !this.isPeakingPassword;
	}

	public getType(): 'text' | 'password' {
		if (this.type === 'text') {
			return 'text';
		}
		return this.isPeakingPassword ? 'text' : 'password';
	}
}
