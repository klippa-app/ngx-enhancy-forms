import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-sub-form-example',
    templateUrl: './sub-form-example.component.html',
    standalone: false
})
export class SubFormExampleComponent {

	constructor(private fb: FormBuilder) {
	}

	public formArray = this.fb.array([
		this.fb.group({
			name: ['a name', Validators.required],
			age: [12],
		}),
	]);

	public myNestedForm = this.fb.group({
		items: this.formArray
	});
	readOnly = false;


	public getFormItems(): FormArray<FormGroup> {
		return this.myNestedForm.get('items') as FormArray;
	}


	onInjected(data) {
		console.log('I AM INJECTED NOW!');
		console.log(data);
	}

	public add() {
		const newThing = this.fb.group({
			name: ['some name'],
			age: [22],
		});
		this.getFormItems().push(newThing);
		if (Math.random() > 0.5) {
			newThing.disable();
		}
	}

	gaan = (renderedAndEnabledValues: object, allRenderedValues: object) => {
		console.log('GAAN');
		console.log(renderedAndEnabledValues);
		console.log(allRenderedValues);
		return Promise.resolve();
	};
}
