import { Component, Host, HostBinding, Input, Optional } from '@angular/core';
import {FormComponent, invalidFieldsSymbol} from '../form.component';
import {isNullOrUndefined} from '../../util/values';

@Component({
	selector: 'klp-form-submit-button',
	templateUrl: './form-submit-button.component.html',
	styleUrls: ['./form-submit-button.component.scss'],
})
export class FormSubmitButtonComponent {
	@Input() public isLoading = false;
	@Input() fullWidth = false;
	@Input() variant: 'greenFilled' | 'redFilled' | 'greenOutlined' = 'greenFilled';
	@Input() public submitCallback: (renderedAndEnabledValues: object, renderedButDisabledValues: object) => Promise<any>;

	@HostBinding('class._fullWidth') get _() {
		return this.fullWidth;
	}

	constructor(@Host() @Optional() private parentForm: FormComponent) {}

	submitForm(): void {
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
	}
}
