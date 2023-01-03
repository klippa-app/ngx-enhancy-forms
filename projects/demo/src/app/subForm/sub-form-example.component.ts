import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'app-sub-form-example',
	templateUrl: './sub-form-example.component.html',
})
export class SubFormExampleComponent implements OnInit {

	public myNestedForm = new UntypedFormGroup({
		name: new UntypedFormControl(null),
	});
	readOnly = false;

	ngOnInit() {
		setTimeout(() => {
			this.readOnly = Math.random() > 0.5;
			if (Math.random() > 0.5) {
				this.myNestedForm.get('name').setValue(`>${Math.random()}`);
			}
		}, 1000);
	}

}
