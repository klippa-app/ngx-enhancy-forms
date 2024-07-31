import {Component, HostBinding, inject, Input, OnInit} from '@angular/core';
import {FormComponent, invalidFieldsSymbol} from '../form.component';
import { ButtonVariant } from '../../elements/button/button.component';
import { DefaultErrorHandler, FormValidationError, KLP_FORM_ERROR_HANDLER } from '../form-validation-error/form-validation-error';

export type SubmitButtonVariant = Extract<ButtonVariant,
	| 'greenFilled'
	| 'redFilled'
	| 'greenOutlined'
	| 'white'
>;

@Component({
	selector: 'klp-form-submit-button',
	templateUrl: './form-submit-button.component.html',
	styleUrls: ['./form-submit-button.component.scss'],
})
export class FormSubmitButtonComponent implements OnInit{
	private parentForm = inject(FormComponent, {optional: true});
	private handleError = inject(KLP_FORM_ERROR_HANDLER, {optional: true}) ?? DefaultErrorHandler;
	public buttonType: 'submit' | 'button' = 'submit';

	@Input() public isLoading = false;
	@Input() @HostBinding('class._fullWidth') public fullWidth = false;
	@Input() public variant: SubmitButtonVariant = 'greenFilled';
	@Input() public submitCallback: (renderedAndEnabledValues: object, renderedButDisabledValues: object) => Promise<any>;
	@Input() public before: () => Promise<any> = () => Promise.resolve();
	@Input() public after: () => Promise<any> = () => Promise.resolve();
	@Input() public disabled: boolean = false;

	ngOnInit(): void {
		if (this.parentForm.allowSubmitOn === 'buttonOnly') {
			this.buttonType = 'button';
		} else {
			this.buttonType = 'submit';
		}
	}

	private setValidationError = (e: FormValidationError) => {
		this.parentForm.formGroup.get(e.path)?.setErrors({ message: { value: e.message }});
	}

	async submitForm(): Promise<void> {
		await this.before().catch(() => null);

		try {
			const [renderedAndEnabledValues, renderedValues] = await this.parentForm.trySubmit();
			this.isLoading = true;
			await this.submitCallback(renderedAndEnabledValues, renderedValues)
				.finally(() => this.isLoading = false);
		} catch (e) {
			if (e === invalidFieldsSymbol) {
				return; // swallow the error, the framework will scroll to the field that needs attention
			}
			this.handleError(e).forEach(this.setValidationError);
			return;
		}

		await this.after();
	}
}
