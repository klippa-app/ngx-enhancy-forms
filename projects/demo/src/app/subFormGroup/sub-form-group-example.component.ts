import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';

@Component({
    selector: 'app-sub-form-group-example',
    templateUrl: './sub-form-group-example.component.html',
    standalone: false
})
export class SubFormGroupExampleComponent {

	constructor(private fb: FormBuilder) {
	}

	public formGroup = this.fb.group({
		name: ['groupname'],
		age: [123],
	});
}
