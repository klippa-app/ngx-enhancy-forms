import {Component, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, UntypedFormArray, UntypedFormGroup, Validators} from '@angular/forms';
import {AppSelectOptions, SelectComponent} from '@klippa/ngx-enhancy-forms';

@Component({
	selector: 'app-demo',
	templateUrl: './demo.component.html',
	styleUrls: ['./demo.component.scss']
})
export class DemoComponent {
	public formWarnings = new Map<AbstractControl, string>();
	constructor(private fb: FormBuilder) {

		setTimeout(() => {
		this.formWarnings.set(this.myForm.get('name'), 'This is a warning about your name');
			// this.formWarnings.delete(this.myForm.get('name'));
		}, 1500);

		setTimeout(() => {
			// this.formWarnings = new Map<AbstractControl, string>([
			// 	[this.myForm.get('name'), 'This is a ewgewgewgewname'],
			// ]);
			// this.formWarnings.set(this.myForm.get('name'), 'another');
		}, 2500);

		// setTimeout(() => {
		// 	this.options = [...this.options, {id : this.options.length, name: 'BLAAAAAAAAAAAAAAAAAAAAAAAT'}];
		// }, 5000);
		// this.myForm.patchValue({
		// 	oli: {
		// 		name: 'zaag'
		// 	}
		// });
		// setTimeout(() => {
		// 	this.showSubForm = true;
		// }, 2000);
		//
		// setTimeout(() => {
		// 	this.myForm.patchValue({
		// 		oli: {
		// 			name: 'zaag222'
		// 		}
		// 	});
		// }, 4000);
		//
		// setTimeout(() => {
		// 	this.myForm.get('name').enable();
		// }, 1000);
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
	@ViewChild('selectThing') selectComponent: SelectComponent;

	testDate: Array<Date> = [
		'2022-07-06T00:00:00Z',
		'2022-07-12T22:00:00Z',
		'2022-07-15T23:00:00Z',
		'2022-07-21T00:00:00Z',
		'2022-07-27T15:00:00Z',
	].map(e => {
		return new Date(e);
	});
	show = false;
	isChecked: boolean = undefined;

	private nameConfig = ['', [Validators.required, Validators.minLength(4)],
		[(e) => {
			if (e.value?.length > 5) {
				return Promise.resolve();
			}
			if (e.value?.length > 4) {
				return Promise.resolve({async: 'baapaaa aaaaaaapaaaaaaapaaaaaaap'});
			}
			if (e.value?.length > 3) {
				return Promise.resolve({async: 'caapaaa aaaaaaap'});
			}
			if (e.value?.length > 2) {
				return Promise.resolve({async: 'daapaaa aaaaaaap aaaaap'});
			}
			return Promise.resolve({async: 'aapaaa '});
		}]
	];

	public myForm = this.fb.group({
		deepInput: ['', Validators.required],
		name: this.nameConfig,
		name2: this.nameConfig,
		name3: this.nameConfig,
		name4: this.nameConfig,
		name5: this.nameConfig,
		name6: this.nameConfig,
		name7: this.nameConfig,
		picker: [null, [Validators.required, Validators.max(-1)]],
		date: [null, Validators.required],
		hourMinute: [null, Validators.required],
		email: [null, Validators.required],
		emails: ['', Validators.required],
		file: [null, Validators.required],
		disabledButRendered: ['disabledButRendered'],
		unrendered: ['unrendered'],
		yesno: false,
		yesno2: false,
		selector: [null],
		subbies: this.fb.array([]),
		groupie: this.fb.group({}),
		oli: null,
		radioOption: null
	});

	subForms = [];
	options: AppSelectOptions = [
		{id: 1, name: 'dra'},
		// {id: 2, name: 'looooong gekwhjg kehjw gkjehw gjkehw gjkh ghegkw egwhj ej wgklej gklej glkj gklj gljkl gewgjkew gewgjkew gewgjkew gewgjkew'},
		{id: 3, name: 'jjj'},
		{id: 4, name: 'kkk'},
		{id: 5, name: 'lll'},
		// {id: 6, name: 'mmm'},
		// {id: 7, name: 'mmm'},
		// {id: 8, name: 'mmm'},
		// {id: 9, name: 'mmm'},
		// {id: 10, name: 'nnn'}
	];
	myfile: any;
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
	showSubForm = false;
	radioOptionsClassic: AppSelectOptions = [
		{
			id: '1',
			name: '1st option',
			description: 'look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!look at this super cute description!'
		},
		{
			id: '21',
			name: '2nd option',
		},
		{
			id: '241',
			name: '3rd option',
		}
	];
	radioOptionsButton: AppSelectOptions = [
		{
			id: '1',
			name: '1st option',
			description: '1nd option'
		},
		{
			id: '21',
			name: '2nd option',
		},
		{
			id: '241',
			name: '3rd option',
		}
	];
	myValue: any;

	public beforeSubmit = async () => {
		console.log('before');
		if (Math.random() > 0.5) {
			this.myForm.get('emails').setValidators(Validators.required);
		}
	}
	public afterSubmit = async () => {
		console.log('after');
		this.myForm.get('emails').removeValidators(Validators.required);
	}
	public submitForm = async (enabledAndRendered: any, all: any) => {
		console.log('enabledAndRendered', enabledAndRendered);
		console.log('all', all);
	}
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
	}

	public toggie() {
		this.show = !this.show;
	}

	public logSomething(): void {
		console.log('logSomething');
	}

	search($event: string) {
		console.log($event);
	}

	loadMore() {
		console.log('load it');
	}

	fileSelected($event: any) {
		console.log($event);
	}

	slowClick = async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		throw new Error('some error');
	}

	blurry() {
		console.log('blurr');
	}

	enterKeyPressed() {
		console.log('kek');
	}

	addOption($event: string) {
		console.log($event);
		this.options = [...this.options, {id: $event, name: $event}];
		this.myValue = [...(this.myValue ?? []), $event];
		this.selectComponent.close();
	}
}
