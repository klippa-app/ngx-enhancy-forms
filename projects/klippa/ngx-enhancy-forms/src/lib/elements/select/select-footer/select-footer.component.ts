import { Component, Input } from '@angular/core';

@Component({
	selector: 'klp-select-footer',
	templateUrl: './select-footer.component.html',
	styleUrls: ['./select-footer.component.scss'],
})
export class SelectFooterComponent {
	@Input() public prefix: string;
	@Input() public text: string;
}
