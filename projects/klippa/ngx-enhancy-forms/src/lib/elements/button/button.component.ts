import { Component, HostBinding, Input } from '@angular/core';
import {isValueSet} from "../../util/values";

@Component({
	selector: 'klp-form-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
	@Input() variant:
		| 'white'
		| 'greenFilled'
		| 'greenOutlined'
		| 'greenLink'
		| 'contextMenuItem'
		| 'redFilled'
		| 'redOutlined'
		| 'orangeFilled' = 'white';
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

	onClick(event: Event) {
		if (this.disabled) {
			event.stopPropagation();
			return
		}

		if (isValueSet(this.clickCallback)) {
			this.isLoading = true;
			this.clickCallback(event)
				.catch(() => null) // gobble up errors.
				.then(() => {
					this.isLoading = false;
				});
		}
	}
}
