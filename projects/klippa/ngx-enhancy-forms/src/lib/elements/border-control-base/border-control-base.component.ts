import {Component, ContentChild, Host, Input, Optional, TemplateRef} from '@angular/core';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'klp-form-border-control-base',
	templateUrl: './border-control-base.component.html',
	styleUrls: ['./border-control-base.component.scss'],
	standalone: false
})
export class BorderControlBaseComponent {
	@Input() prefixTpl: TemplateRef<any> | null = null;
	@Input() suffixTpl: TemplateRef<any> | null = null;
	@Input() disabled = false;
	@Input() sizeClass: string;
	@Input() isInErrorState = false;

	@ContentChild('inputContent', {static: false}) inputContent: TemplateRef<any>;

	constructor(
		@Host() @Optional() public valueAccessor: ValueAccessorBase<any>
	) {}

	getTailTpl(): TemplateRef<any> {
		return this.valueAccessor?.getTailTpl() ?? null;
	}
}
