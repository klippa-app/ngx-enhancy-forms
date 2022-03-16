import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
	selector: 'app-sub-form-example',
	templateUrl: './sub-form-example.component.html',
})
export class SubFormExampleComponent {

	public myNestedForm = new FormGroup({
		name: new FormControl('abc'),
	});

}
