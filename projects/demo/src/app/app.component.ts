import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

	public myForm = this.fb.group({
		firstName: ['Mark'],
		lastName: ['Rutte', Validators.required],
	});

	public formSubmission: any;

	constructor( private fb: FormBuilder ) {}

	public submitForm = (values: any) => {
		this.formSubmission = values;
		return Promise.resolve();
	}
}
