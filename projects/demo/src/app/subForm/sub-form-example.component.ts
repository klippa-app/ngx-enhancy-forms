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

	}

	onInjected() {
		console.log('I AM INJECTED NOW!');
	}
}
