import {Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-on-submit-errors',
  templateUrl: './on-submit-errors.component.html',
  styleUrls: ['./on-submit-errors.component.scss']
})
export class OnSubmitErrorsComponent {
	private fb = inject(FormBuilder);

	protected form = this.fb.group({
		name: ['', Validators.required],
		nested: this.fb.group({}),
	});

	constructor() {
		setTimeout(() =>
			this.form.patchValue({
				name: 'foo',
				nested: {
					name: 'bar',
				}
			})
		);
	}

	protected onSubmit = async (value: any) => {
		const err: any = {};
		if (value.name !== 'bob') {
			err.name = 'must be bob';
		}

		if (value.nested.name === 'fred') {
			err['nested.name'] = 'cannot be fred';
		}

		if (value.nested.name !== 'greg') {
			err.nested = {
				name: 'cannot be fred'
			};
		}

		throw err;
	}
}
