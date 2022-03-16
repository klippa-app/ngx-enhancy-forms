import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	show = false;

	public myForm = this.fb.group({
		emails: [""],
		subbies: this.fb.array([]),
		groupie: this.fb.group({}),
		oli: ["bob"],
	});

	subForms = [];

	constructor(private fb: FormBuilder) {
	}

	public get emails(): any[] {
		const emails = this.myForm.get("emails").value as string
		if (emails.length == 0) {
			return [];
		}
		return emails.split(",");
	}

	public get subbies () {
		return this.myForm.get("subbies") as FormArray
	}

	public get groupie () {
		return this.myForm.get("groupie") as FormGroup
	}

	public submitForm = async (values: any) => {
		console.log(values);
	};

	public toggie () {
		this.show = !this.show;
	}
}
