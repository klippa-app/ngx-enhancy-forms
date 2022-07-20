import {Component, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {MultipleValueAccessorBase} from '../value-accessor-base/multiple-value-accessor-base.component';
import {isValueSet} from '../../util/values';
import { arrayIsSetAndFilled } from '../../util/arrays';

@Component({
	selector: 'klp-form-file-input',
	templateUrl: './file-input.component.html',
	styleUrls: ['./file-input.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: FileInputComponent, multi: true}],
})
export class FileInputComponent extends MultipleValueAccessorBase<File> {

	@Input() isLoading = false;
	@Input() clearable = false;

	public onChange(files: FileList): void {
		const result = [];
		for (let i = 0; i < files.length; i++) {
			result.push(files.item(i));
		}
		this.setInnerValueAndNotify(result);
	}

	public getFileNames(): string {
		if (Array.isArray(this.innerValue)) {
			return this.innerValue.map(e => e.name).join(', ');
		} else if (this.innerValue instanceof File) {
			return this.innerValue.name;
		}
		return null;
	}

	public shouldShowClearButton(): boolean {
		if (this.multiple) {
			if (arrayIsSetAndFilled(this.innerValue)) {
				return true;
			}
			return false;
		}
		if (isValueSet(this.innerValue)) {
			return true;
		}
		return false;
	}
}
