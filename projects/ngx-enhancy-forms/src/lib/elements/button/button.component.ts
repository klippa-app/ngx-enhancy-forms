import {Component, HostBinding, Input} from '@angular/core';

@Component({
	selector: 'lib-enhancy-forms-button',
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

	@HostBinding('class._fullWidth') get _(): boolean {
		return this.fullWidth;
	}

	onClick(event: Event): void {
		if (this.disabled) {
			event.stopPropagation();
		}
	}
}
