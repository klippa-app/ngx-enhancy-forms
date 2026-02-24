import {Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {stringIsSetAndFilled} from '../../util/values';

@Component({
	selector: 'klp-form-grid-control-base',
	templateUrl: './grid-control-base.component.html',
	styleUrls: ['./grid-control-base.component.scss'],
	standalone: false
})
export class GridControlBaseComponent {
	protected readonly stringIsSetAndFilled = stringIsSetAndFilled;

	@Input() caption: string | TemplateRef<any>;
	@Input() description: string | TemplateRef<any>;
	@Input() disabled = false;
	@Input() sizeClass: string;
	@Input() captionSpacing: number;

	@ContentChild('controlContent', {static: false}) controlContent: TemplateRef<any>;

	isTemplateRef(value: any): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}

	isString(value: any): value is string {
		return typeof value === 'string';
	}
}
