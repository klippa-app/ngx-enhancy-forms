import { InjectionToken } from '@angular/core';
import { isArrayOf } from '../../util/arrays';

export class FormValidationError extends Error {
	public readonly name = 'FormValidationError';
	public readonly path: string;

	constructor(path: string, message: string) {
		super(message);
		this.path = path;
	}
}

export type FormValidationErrors = Array<FormValidationError>;

export type FormErrorHandler = (error: any) => FormValidationErrors;

export const KLP_FORM_ERROR_HANDLER = new InjectionToken<FormErrorHandler>('KLP_FORM_ERROR_HANDLER');


export const DefaultErrorHandler: FormErrorHandler = (error: any) => {
	if (Array.isArray(error) && isArrayOf(error, FormValidationError)) {
		// If the error is an array of FormValidationErrors, then pass it along.
		return error;
	} else if (error instanceof FormValidationError) {
		// If the error is a FormValidationError, then wrap it and pass it on.
		return [error];
	}

	throw error;
};

