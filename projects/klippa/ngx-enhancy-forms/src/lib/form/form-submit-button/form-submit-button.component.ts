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

	@HostBinding('class._fullWidth') get _() {
		return this.fullWidth;
	}

	constructor(@Host() @Optional() private parentForm: FormComponent) {}
	@Input() public isLoading = false;
	@Input() fullWidth = false;
	@Input() variant: SubmitButtonVariant = 'greenFilled';
	@Input() public submitCallback: (renderedAndEnabledValues: object, renderedButDisabledValues: object) => Promise<any>;
	@Input() public before: () => Promise<any> = () => Promise.resolve();
	@Input() public after: () => Promise<any> = () => Promise.resolve();

	async submitForm(): Promise<void> {
		try {
			await this.before();
		} catch (e) {
			return;
		}

		try {
			const [renderedAndEnabledValues, renderedValues] = await this.parentForm.trySubmit();
			this.isLoading = true;
			await this.submitCallback(renderedAndEnabledValues, renderedValues)
				.finally(() => this.isLoading = false);
		} catch (e) {
			if (e === invalidFieldsSymbol) {
				return;
			}
			throw e;
		}

		await this.after();
	}
}
