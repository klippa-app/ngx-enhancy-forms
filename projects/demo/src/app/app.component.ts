import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AppSelectOptions} from "@klippa/ngx-enhancy-forms";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	public myForm = this.fb.group({
		firstName: ['Dirk'],
		lastName: [{value: 'Gently', disabled: true}, Validators.required],
	});

	public formSubmission: any;
	public show: boolean = true;

	public options: AppSelectOptions = [];

	constructor(private fb: FormBuilder) {
	}

	public submitForm = (values: any) => {
		this.formSubmission = values;
		return	new Promise((resolve) => setTimeout(() => {
			console.log(values);
			resolve()
		}, 1000));
	};

	toggleLastNameState() {
		const controls = this.myForm.get("lastName");
		if(controls.disabled) {
			controls.enable()
		} else {
			controls.disable()
		}
	}

	toggleLastNameVisibility() {
		this.show = !this.show;
	}

	addItem($event: string) {
		this.options = [...this.options, {id: this.options.length + 1, name: $event}];
		console.log(this.options);
	}
}
