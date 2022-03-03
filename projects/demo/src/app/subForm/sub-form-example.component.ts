import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SubForm} from '@klippa/ngx-enhancy-forms';

@Component({
	selector: 'app-sub-form-example',
	templateUrl: './sub-form-example.component.html',
})
export class SubFormExampleComponent {

	public myNestedForm = new FormGroup({
		nestedValue: new FormControl('abc', [Validators.required]),
		nestedValue11: new FormControl('abc', [Validators.required]),
		level2: new SubForm(),
	});

	public myNestedForm2 = this.fb.group({
		nestedValue2: [{value: '222', disabled: false}, [Validators.required]],
		nestedValue3: [{value: '222', disabled: false}, [Validators.required]],
	});
	public show = true;

	constructor(private fb: FormBuilder) {
	}

	toggleDisabled(): void {
		const controls = this.myNestedForm2.get('nestedValue2');
		if (controls.disabled) {
			controls.enable();
		} else {
			controls.disable();
		}
	}

}
