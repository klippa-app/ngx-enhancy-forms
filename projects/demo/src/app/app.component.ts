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
		lastName: [{value: null, disabled: true}, Validators.required],
	});

	public formSubmission: any;
	public show: boolean;

	constructor(private fb: FormBuilder) {
	}

	public submitForm = (values: any) => {
		this.formSubmission = values;
		return Promise.resolve();
	};

	subm() {
		console.log(this.myForm.value);
	}
}
