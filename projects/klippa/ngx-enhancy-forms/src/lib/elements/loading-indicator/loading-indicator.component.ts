import {Component, inject, Input} from '@angular/core';
import {FormSize, GetSizeClass} from "../../form/form.component";
import {FormElementComponent} from "../../form/form-element/form-element.component";

@Component({
    selector: 'klp-form-loading-indicator',
    templateUrl: './loading-indicator.component.html',
    styleUrls: ['./loading-indicator.component.scss'],
    standalone: false
})
export class LoadingIndicatorComponent {
	@Input() public variant: '3dots' | 'spinner' | 'textInput' | 'picker' = '3dots';
	@Input() public size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' = 'medium';
	@Input() public formSize: FormSize | null = null;

	protected parent = inject(FormElementComponent, { optional: true });

	constructor() {
		if (this.parent && !this.formSize) {
			this.formSize = this.parent.size;
		}
	}

	protected readonly GetSizeClass = GetSizeClass;
}
