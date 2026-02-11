import {
	Component,
	ElementRef,
	EventEmitter,
	Host,
	Input,
	Optional,
	Output,
	TemplateRef,
	ViewChild
} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';
import {FormElementComponent} from "../../form/form-element/form-element.component";
import {FormSize, GetSizeClass} from "../../form/form.component";

@Component({
	selector: 'klp-form-text-input',
	templateUrl: './text-input.component.html',
	styleUrls: ['./text-input.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: TextInputComponent, multi: true}],
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
	@Input() size: FormSize | null = null;
	@Output() onBlur = new EventEmitter<void>();

	constructor() {
		super();

		if (this.parent && !this.size) {
			this.size = this.parent.size;
		}
	}

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

	protected readonly GetSizeClass = GetSizeClass;
}
