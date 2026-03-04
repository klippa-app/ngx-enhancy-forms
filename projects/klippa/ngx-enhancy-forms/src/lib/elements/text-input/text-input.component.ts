import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	ViewChild
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'klp-form-text-input',
	templateUrl: './text-input.component.html',
	styleUrls: ['./text-input.component.scss'],
	providers: [
		{provide: NG_VALUE_ACCESSOR, useExisting: TextInputComponent, multi: true},
		{provide: ValueAccessorBase, useExisting: TextInputComponent}
	],
	standalone: false
})
export class TextInputComponent extends ValueAccessorBase<string> {
	@Input() placeholder: string;
	@Input() type: 'text' | 'password' = 'text';
	@Input() clearable = false;
	@Input() hasBorderLeft = true;
	@Input() hasBorderRight = true;
	@Input() passwordPeekIcon: TemplateRef<any>;
	@Input() suffixTpl: TemplateRef<any> | null = null;
	@Input() prefixTpl: TemplateRef<any> | null = null;
	@Output() onBlur = new EventEmitter<void>();

	private isPeekingPassword = false;

	public togglePeakPassword(): void {
		this.isPeekingPassword = !this.isPeekingPassword;
	}

	public getType(): 'text' | 'password' {
		if (this.type === 'text') {
			return 'text';
		}
		return this.isPeekingPassword ? 'text' : 'password';
	}
}
