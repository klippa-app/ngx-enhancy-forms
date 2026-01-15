import { InjectionToken } from '@angular/core';
import { isArrayOf } from '../../util/arrays';

export class FormValidationError extends Error {
	public readonly name = 'FormValidationError';
	public readonly path: string;
	public readonly originalError: Error | null;

	constructor(path: string, message: string, originalError?: Error) {
		super(message);
		this.path = path;
		this.originalError = originalError ?? null;
	}
}

export type FormValidationErrors = Array<FormValidationError>;

export type FormErrorHandler = (error: any) => FormValidationErrors;
export type FormErrorNoControlFound = (error: FormValidationError) => void;

export const KLP_FORM_ERROR_HANDLER = new InjectionToken<FormErrorHandler>('KLP_FORM_ERROR_HANDLER');
export const KLP_FORM_ERROR_NO_CONTROL_FOUND = new InjectionToken<FormErrorNoControlFound>('KLP_FORM_ERROR_NO_CONTROL_FOUND');

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

