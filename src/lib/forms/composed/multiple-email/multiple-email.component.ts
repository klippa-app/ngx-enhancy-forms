import { Component } from '@angular/core';
import { ValueAccessorBase } from '~/app/shared/ui/forms/elements/value-accessor-base/value-accessor-base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-form-multiple-email',
	templateUrl: './multiple-email.component.html',
	styleUrls: ['./multiple-email.component.scss'],
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: MultipleEmailComponent, multi: true }],
})
export class MultipleEmailComponent extends ValueAccessorBase<Array<string>> {
	valueChanged() {
		this.setInnerValueAndNotify([...this.innerValue]);
	}

	addAnother() {
		this.innerValue = [...this.innerValue, ''];
		this.valueChanged();
	}

	remove(i: number) {
		this.innerValue.splice(i, 1);
		this.valueChanged();
	}
}
