import {Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormErrorHandler, FormValidationError, FormValidationErrors, KLP_FORM_ERROR_HANDLER } from '@klippa/ngx-enhancy-forms';

// this is a little like an error from GQL.
type LocationErrors = {
	kind: 'LOCATION_ERRORS',
	errors: Array<{
		message: any,
		location: Array<string>;
	}>;
};

async function someApiCall(value: {name: string, nested: { name: string }}) {
		const locationErrors: LocationErrors = {
			kind: 'LOCATION_ERRORS',
			errors: [],
		};
		if (value.name !== 'bob')		{
			locationErrors.errors.push({location: ['name'], message: 'must be bob'});
		}

		if (value.nested.name === 'fred') {
			locationErrors.errors.push({location: ['nested', 'name'], message: 'cannot be fred'});
		}

		throw locationErrors;
}

const LocationErrorHandler: FormErrorHandler = (error: any): FormValidationErrors => {
	if (error?.kind === 'LOCATION_ERRORS') {
		return (error as LocationErrors).errors.map(e => new FormValidationError(
				e.location.join('.'),
				e.message,
			));
	}

 throw error;
 };

@Component({
  selector: 'app-on-submit-errors',
  templateUrl: './on-submit-errors.component.html',
  styleUrls: ['./on-submit-errors.component.scss'],
	providers: [
		{provide: KLP_FORM_ERROR_HANDLER, useValue: LocationErrorHandler },
	]
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

	protected beforeSubmit = async () => {
		throw new Error('bar');
	}

	protected onSubmit = async (value: any) => {
		await someApiCall(value);
	}
}
