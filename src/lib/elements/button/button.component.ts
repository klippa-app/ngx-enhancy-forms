import { Component, HostBinding, Input } from '@angular/core';

@Component({
	selector: 'klp-button',
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

	@HostBinding('class._fullWidth') get _() {
		return this.fullWidth;
	}

	onClick(event: Event) {
		if (this.disabled) {
			event.stopPropagation();
		}
	}
}
