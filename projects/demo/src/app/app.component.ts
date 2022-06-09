import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppSelectOptions} from '@klippa/ngx-enhancy-forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	testDate: Date;
	show = false;
	isChecked: boolean = undefined;

	public myForm = this.fb.group({
		emails: ['', [Validators.required]],
		yesno: false,
		yesno2: false,
		selector: [null, [Validators.required]],
		subbies: this.fb.array([]),
		groupie: this.fb.group({}),
		oli: ['bob'],
	});

	subForms = [];
	options: AppSelectOptions = [
		{id: 1, name: '111'},
		{id: 2, name: '222'},
		{id: 3, name: '333'},
		{id: 3, name: '444'},
		{id: 3, name: '555'},
		{id: 3, name: '666'},
		{id: 3, name: '777'},
		{id: 3, name: '888'},
		{id: 3, name: '999'},
		{id: 3, name: 'aaa'},
		{id: 3, name: 'bbb'},
		{id: 3, name: 'ccc'},
		{id: 3, name: 'ddd'},
		{id: 3, name: 'eee'},
		{id: 3, name: 'fff'},
		{id: 3, name: 'ggg'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
		{id: 3, name: 'hhh'},
	];

	constructor(private fb: FormBuilder) {
	}

	public get emails(): any[] {
		const emails = this.myForm.get('emails').value as string;
		if (emails.length === 0) {
			return [];
		}
		return emails.split(',');
	}

	public get subbies() {
		return this.myForm.get('subbies') as FormArray;
	}

	public get groupie() {
		return this.myForm.get('groupie') as FormGroup;
	}

	public submitForm = async (values: any) => {
		console.log(values);
	};

	public toggie() {
		this.show = !this.show;
	}

	search($event: string) {
		console.log($event);
	}

	loadMore() {
		console.log('load it');
		this.options = [...this.options, {id: 4, name: 'iii'}, {id: 4, name: 'jjj'}, {id: 4, name: 'kkk'}, {id: 4, name: 'lll'}, {id: 4, name: 'mmm'}, {id: 4, name: 'nnn'}];
	}
}
