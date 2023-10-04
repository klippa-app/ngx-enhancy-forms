import { Component, HostBinding, inject, Input } from '@angular/core';
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
export class FormSubmitButtonComponent {
	private parentForm = inject(FormComponent, {host: true, optional: true});
	private handleError = inject(KLP_FORM_ERROR_HANDLER, {optional: true}) ?? DefaultErrorHandler;

	@Input() public isLoading = false;
	@Input() @HostBinding('class._fullWidth') public fullWidth = false;
	@Input() public variant: SubmitButtonVariant = 'greenFilled';
	@Input() public submitCallback: (renderedAndEnabledValues: object, renderedButDisabledValues: object) => Promise<any>;
	@Input() public before: () => Promise<any> = () => Promise.resolve();
	@Input() public after: () => Promise<any> = () => Promise.resolve();

	private renderError = (e: FormValidationError) => {
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
				return;
			}
			this.handleError(e).forEach(this.renderError);
			return;
		}

		await this.after();
	}
}
