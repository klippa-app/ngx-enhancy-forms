import { Component, ElementRef, Host, Input, OnInit, Optional, ViewChild } from '@angular/core';
import {FormElementComponent} from "../form-element/form-element.component";
import {isNullOrUndefined} from "../../util/values";
import {ErrorTypes} from "../../types";

@Component({
	selector: 'klp-form-error',
	templateUrl: './form-error.component.html',
	styleUrls: ['./form-error.component.scss'],
})
export class FormErrorComponent implements OnInit {
	@Input() error: ErrorTypes;
	public showError = false;
	@ViewChild('contentRef') public contentRef: ElementRef;
	constructor(@Host() @Optional() private parent: FormElementComponent) {}

	ngOnInit(): void {
		// this is being run next cycle, because we dont want to fail if the order of components is as follows:
		// <app-form-error />
		// <some-input />
		// That would fail, because the logic of the form error is run first, and at that moment, the `some-input` isnt registered yet
		setTimeout(() => {
			const attachedControl = this.parent.getAttachedControl();
			this.parent.registerErrorHandler(this.error, this.contentRef);
			if (isNullOrUndefined(attachedControl)) {
				throw new Error('You added a Form Error component without an attached Form Control');
			}
		});
	}

	public getErrorValueMessage(): string {
		return this.parent.getAttachedControl().errors[this.error];
	}
}
