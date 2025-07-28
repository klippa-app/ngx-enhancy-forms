import {Component, ElementRef, Host, OnDestroy, OnInit, Optional, TemplateRef, ViewChild} from '@angular/core';
import {FormElementComponent} from "../form-element/form-element.component";

@Component({
	selector: 'klp-form-caption-end',
	templateUrl: './form-caption-end.component.html',
	styleUrls: ['./form-caption-end.component.scss'],
})
export class FormCaptionEndComponent implements OnInit, OnDestroy {
	@ViewChild('contentRef') public contentRef: TemplateRef<any>;

	constructor(@Host() @Optional() private parent: FormElementComponent) {}

	ngOnInit(): void {
		// this is being run next cycle, because we dont want to fail if the order of components is as follows:
		// <app-form-error />
		// <some-input />
		// That would fail, because the logic of the form error is run first, and at that moment, the `some-input` isnt registered yet
		setTimeout(() => {
			this.parent.registerCaptionEnd(this.contentRef);
		});
	}

	ngOnDestroy(): void {
		this.parent.registerCaptionEnd(null);
	}
}
