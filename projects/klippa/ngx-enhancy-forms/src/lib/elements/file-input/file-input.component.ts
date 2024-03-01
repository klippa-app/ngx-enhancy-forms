import {Component, ElementRef, Input, ViewChild} from '@angular/core';
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
	@Input() onlyShowUploadButton = false;
	@Input() useFullParentSize = false;
	@Input() buttonText: string = 'Upload a file';
	@Input() disabled: boolean = false;
	@ViewChild('nativeInputRef') nativeInputRef: ElementRef<HTMLInputElement>;

	public onChange(files: FileList): void {
		const result = [];
		for (let i = 0; i < files.length; i++) {
			result.push(files.item(i));
		}
		this.setInnerValueAndNotify(result);
		// to make sure we can select the same file again
		this.nativeInputRef.nativeElement.value = null;
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
		if (this.onlyShowUploadButton) {
			return false;
		}
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

	public uploadFileClicked(): void {
		this.nativeInputRef.nativeElement.click();
	}
}
