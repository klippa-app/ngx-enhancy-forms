import {Component, Input, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'klp-form-toggle',
	templateUrl: './toggle.component.html',
	styleUrls: ['./toggle.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: ToggleComponent, multi: true}],
	standalone: false
})
export class ToggleComponent extends ValueAccessorBase<boolean> implements OnInit {
	@Input() transparentBackground = true;

	protected toggleWidth!: number;
	protected toggleHeight!: number;

	override ngOnInit(): void {
		super.ngOnInit();
		const sizes = this.calculateToggleSize();
		this.toggleWidth = sizes.width;
		this.toggleHeight = sizes.height;
	}

	private calculateToggleSize(): { width: number; height: number } {
		switch (this.size) {
			case 'small':
				return { width: 36, height: 20 };
			case 'medium':
				return { width: 44, height: 24 };
			case 'large':
				return { width: 54, height: 32 };
		}
	}
}
