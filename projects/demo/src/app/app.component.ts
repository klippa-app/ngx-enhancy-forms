import {Component} from '@angular/core';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {AppSelectOptions} from '@klippa/ngx-enhancy-forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	testDate: Array<Date> = [
		'2022-07-06T00:00:00Z',
		'2022-07-12T22:00:00Z',
		'2022-07-15T23:00:00Z',
		'2022-07-21T00:00:00Z',
		'2022-07-27T15:00:00Z',
	].map(e => {
		console.log(e);
		return new Date(e);
	});
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
		{id: 1, name: 'a111'},
	];

	constructor(private fb: UntypedFormBuilder) {
		setTimeout(() => {
			this.groupedItems = [['a', 'b', 'c'], ['d', 'e']];
		}, 2000);
	}

	public get emails(): any[] {
		const emails = this.myForm.get('emails').value as string;
		if (emails.length === 0) {
			return [];
		}
		return emails.split(',');
	}

	public get subbies() {
		return this.myForm.get('subbies') as UntypedFormArray;
	}

	public get groupie() {
		return this.myForm.get('groupie') as UntypedFormGroup;
	}

	public submitForm = async (values: any) => {
		console.log(values);
	};
	myfile: any;
	public innerValueChangeInterceptor = (prev, cur): Promise<void> => {
		console.log(prev);
		console.log(cur);
		return new Promise((resolve, reject) => {
			if (Math.random() < 0.8) {
				setTimeout(resolve, 1000);
			} else {
				setTimeout(reject, 1000);
			}
		});
	};
	groupedItems = [['a', 'b']];
	minutes: number = null;
	fancyDate: any;
	staticOptions: AppSelectOptions = [
		{
			id: 1,
			name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
		},
		{
			id: 2,
			name: 'bb'
		}
	];
	kers: any;

	public toggie() {
		this.show = !this.show;
	}

	search($event: string) {
		console.log($event);
	}

	loadMore() {
		console.log('load it');
		setTimeout(() => {
			this.options = [...this.options, {id: 4, name: 'iii'}, {id: 4, name: 'jjj'}, {id: 4, name: 'kkk'}, {id: 4, name: 'lll'}, {
				id: 4,
				name: 'mmm'
			}, {id: 4, name: 'nnn'}];
		}, 1000);
	}

	fileSelected($event: any) {
		console.log($event);
	}

	slowClick = async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		throw "some error"
	}
}
