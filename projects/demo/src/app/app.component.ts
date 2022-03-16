import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {AppSelectOptions, SubForm} from '@klippa/ngx-enhancy-forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

	arr = [];

	public myForm = this.fb.group({
		subbies: this.fb.array([new SubForm()]),
	});

	public gregArray = [];

	public myForm2 = this.fb.group({
		subbies: this.fb.array([]),
	});

	show = false;

	constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
		console.log('app constructed');

		setTimeout(() => {
			this.gregArray = [1,2,3,4];
		}, 500);
	}

	ngAfterViewInit(): void {
	}

	public get formArray(): FormArray {
		return this.myForm.get('subbies') as FormArray;
	}

	public get formArray2(): FormArray {
		const a = this.myForm2.get('subbies') as FormArray;
		// console.log(a.controls);
		// this.arr.push(a);
		// console.log(this.arr);
		return a;
	}

	public submitForm = async (values: any) => {
		console.log(values);
		console.log(this.myForm);
	};
	trackert = (i, e) => {
		// console.log(e);
		this.arr.push(e);
		// console.log(this.arr);
		return e;
	};

	toggle() {
		this.show = !this.show;
	}
}
