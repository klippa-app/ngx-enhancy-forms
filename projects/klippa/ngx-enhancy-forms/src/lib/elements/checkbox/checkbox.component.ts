import {Component, Input, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'klp-form-checkbox',
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: CheckboxComponent, multi: true}],
	standalone: false
})
export class CheckboxComponent extends ValueAccessorBase<boolean> implements OnInit{
	@Input() caption: string;
	@Input() description: string;
	@Input() renderUndefinedAsIndeterminate = false;

	protected checkBoxSize!: number;

	override ngOnInit(): void {
		super.ngOnInit();
		this.checkBoxSize = this.calculateCheckboxSize();
		console.log(this.checkBoxSize);
	}

	private calculateCheckboxSize(): number {
		switch (this.size) {
			case 'small':
				return 16;
			case 'medium':
				return 20;
			case 'large':
				return 24;
		}
	}
}
