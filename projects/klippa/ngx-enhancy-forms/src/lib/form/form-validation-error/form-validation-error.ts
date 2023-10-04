import { InjectionToken } from '@angular/core';

export class FormValidationError extends Error {
	_path: string;
	_message: string;

	constructor(path: string, message: string) {
		super(message);
		this.name = 'FORM_VALIDATION_ERROR';
		this._path = path;
		this._message = message;
	}

	get path() {
		return this._path;
	}
}

export type FormValidationErrors = Array<FormValidationError>;

export type FormErrorHandler = (error: any) => FormValidationErrors;

export const KLP_FORM_ERROR_HANDLER = new InjectionToken<FormErrorHandler>('KLP_FORM_ERROR_HANDLER');

export const DefaultErrorHandler: FormErrorHandler = (error: any) => {
	if (Array.isArray(error) && error.reduce((acc, err) => acc && err instanceof FormValidationError)) {
		// If the error is an array of FormValidationErrors, then pass it along.
		return error;
	} else if (error instanceof FormValidationError) {
		// If the error is a FormValidationError, then wrap it and pass it on.
		return [error];
	}

	throw error;
};

