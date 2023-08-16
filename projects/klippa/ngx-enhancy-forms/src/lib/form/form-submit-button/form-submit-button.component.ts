import { Component, Host, HostBinding, Input, Optional } from '@angular/core';
import {FormComponent, invalidFieldsSymbol} from '../form.component';
import {isNullOrUndefined} from '../../util/values';
import { ButtonVariant } from '../../elements/button/button.component';

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
	@Input() public isLoading = false;
	@Input() fullWidth = false;
	@Input() variant: SubmitButtonVariant = 'greenFilled';
	@Input() public before: () => Promise<any> = () => Promise.resolve();
	@Input() public after: () => Promise<any> = () => Promise.resolve();
	@Input() public submitCallback: (renderedAndEnabledValues: object, renderedButDisabledValues: object) => Promise<any>;

	@HostBinding('class._fullWidth') get _() {
		return this.fullWidth;
	}

	constructor(@Host() @Optional() private parentForm: FormComponent) {}

	async submitForm(): Promise<void> {
		try {
			await this.before();
		} catch (e) {
			return;
		}
		this.parentForm
			.trySubmit()
			.then(([renderedAndEnabledValues, renderedValues]) => {
				this.isLoading = true;
				const submitCallbackResult = this.submitCallback(renderedAndEnabledValues, renderedValues);
				if (isNullOrUndefined(submitCallbackResult)) {
					throw new Error('No promise is returned in your submit function.');
				}
				return submitCallbackResult.then(() => (this.isLoading = false)).catch((e) => {
					this.isLoading = false;
					throw e;
				});
			})
			.catch((e) => {
				if (e === invalidFieldsSymbol) {
					return; // swallow the error, the framework will scroll to the field that needs attention
				}
				throw e;
			});
		await this.after();
	}
}
