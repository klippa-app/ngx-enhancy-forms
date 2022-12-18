import {Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'app-sub-form-example',
	templateUrl: './sub-form-example.component.html',
})
export class SubFormExampleComponent {

	public myNestedForm = new UntypedFormGroup({
		name: new UntypedFormControl(null, Validators.required),
	});

}
