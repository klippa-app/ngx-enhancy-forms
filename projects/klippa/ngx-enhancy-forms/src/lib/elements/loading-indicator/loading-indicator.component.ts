import { Component, Input } from '@angular/core';

@Component({
	selector: 'klp-loading-indicator',
	templateUrl: './loading-indicator.component.html',
	styleUrls: ['./loading-indicator.component.scss'],
})
export class LoadingIndicatorComponent {
	@Input() public variant: '3dots' | 'spinner' | 'textInput' | 'picker' = '3dots';
	@Input() public size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' = 'medium';
}
