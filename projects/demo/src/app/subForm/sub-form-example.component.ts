import {Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';

@Component({
	selector: 'app-sub-form-example',
	templateUrl: './sub-form-example.component.html',
})
export class SubFormExampleComponent {

	public myNestedForm = new UntypedFormGroup({
		name: new UntypedFormControl('abc'),
	});

}
