import {Component, Host, Input, OnInit, Optional, TemplateRef, ViewChild} from '@angular/core';
import {FormElementComponent} from "../form-element/form-element.component";
import {ErrorTypes} from "../../types";

@Component({
	selector: 'klp-form-error',
	templateUrl: './form-error.component.html',
	styleUrls: ['./form-error.component.scss'],
})
export class FormErrorComponent implements OnInit {
	@Input() error: ErrorTypes;
	public showError = false;
	@ViewChild('contentRef') public contentRef: TemplateRef<any>;
	constructor(@Host() @Optional() private parent: FormElementComponent) {}

	ngOnInit(): void {
		// this is being run next cycle, because we dont want to fail if the order of components is as follows:
		// <app-form-error />
		// <some-input />
		// That would fail, because the logic of the form error is run first, and at that moment, the `some-input` isnt registered yet
		setTimeout(() => {
			this.parent.registerErrorHandler(this.error, this.contentRef);
		});
	}

	public getErrorValueMessage(): string {
		return this.parent.getAttachedControl().errors[this.error];
	}
}
