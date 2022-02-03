import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	public myForm = this.fb.group({
		firstName: ['Dirk'],
		lastName: [{value: 'Dribbelspier', disabled: false}, Validators.required],
	});

	public formSubmission: any;

	constructor(private fb: FormBuilder) {
		setTimeout(() => {
			this.myForm.controls.lastName.disable();
		}, 1000);
	}

	public submitForm = (values: any) => {
		this.formSubmission = values;
		return Promise.resolve();
	};
}
