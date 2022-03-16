import {Component} from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {AppSelectOptions, SubForm} from '@klippa/ngx-enhancy-forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	public myForm = this.fb.group({
		subbies: this.fb.array([new SubForm()]),
	});

	constructor(private fb: FormBuilder) {
	}

	public get formArray(): FormArray {
		return this.myForm.get('subbies') as FormArray;
	}

	public submitForm = async (values: any) => {
		console.log(values);
	};
}
