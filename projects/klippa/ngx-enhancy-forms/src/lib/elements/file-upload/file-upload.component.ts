import {Component} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {MultipleValueAccessorBase} from '../value-accessor-base/multiple-value-accessor-base.component';

@Component({
	selector: 'klp-form-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: FileUploadComponent, multi: true}],
})
export class FileUploadComponent extends MultipleValueAccessorBase<File> {

	public onChange(files: FileList): void {
		const result = [];
		for (let i = 0; i < files.length; i++) {
			result.push(files.item(i));
		}
		console.log(result);
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
}
