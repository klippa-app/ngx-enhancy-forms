import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AppSelectOptions} from "@klippa/ngx-enhancy-forms";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	public form: FormGroup = this.fb.group({
		checkbox: false,
		date: null,
		dateTime: null,
		email: null,
		file: null,
		number: null,
		password: null,
		select: null,
		multiSelect: null,
		text: null,
		toggle: false,
	})

	public options: AppSelectOptions = [
		{id: 0, name: "option 0"},
		{id: 1, name: "option 1"},
		{id: 2, name: "option 2"},
		{id: 3, name: "option 3"},
		{id: 4, name: "option 4"},
		{id: 5, name: "option 5"},
	];

	public submitted = {};

	public multi = false;

	constructor(
		private fb: FormBuilder,
	) {}

	submitForm = async (value) => {
		this.submitted = value;
	}
}
