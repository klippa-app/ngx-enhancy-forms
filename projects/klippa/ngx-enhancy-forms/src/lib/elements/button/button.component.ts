import { Component, HostBinding, Input } from '@angular/core';
import {isValueSet} from "../../util/values";

export type ButtonVariant = 'white'
		| 'greenFilled'
		| 'greenOutlined'
		| 'greenLink'
		| 'contextMenuItem'
		| 'redFilled'
		| 'redOutlined'
		| 'orangeFilled';

@Component({
	selector: 'klp-form-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
	@Input() variant: ButtonVariant = 'white';
	@Input() size: 'small' | 'medium' | 'large' = 'medium';
	@Input() fullWidth = false;
	@Input() hasBorder = true;
	@Input() disabled = false;
	@Input() isLoading = false;
	@Input() type: 'button' | 'submit' = 'button';
	@Input() clickCallback: (event: Event) => Promise<any>;

	@HostBinding('class._fullWidth') get _() {
		return this.fullWidth;
	}

	async onClick(event: Event) {
		if (this.disabled) {
			event.stopPropagation();
			return;
		}

		if (isValueSet(this.clickCallback)) {
			this.isLoading = true;
			await this.clickCallback(event).finally(() => {
				this.isLoading = false;
			});
		}
	}
}
