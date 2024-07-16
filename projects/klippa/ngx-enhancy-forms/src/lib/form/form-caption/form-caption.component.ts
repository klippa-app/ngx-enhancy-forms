import {Component, ElementRef, Host, OnInit, Optional, TemplateRef, ViewChild} from '@angular/core';
import {FormElementComponent} from "../form-element/form-element.component";
import {isNullOrUndefined} from "../../util/values";

@Component({
	selector: 'klp-form-caption',
	templateUrl: './form-caption.component.html',
	styleUrls: ['./form-caption.component.scss'],
})
export class FormCaptionComponent implements OnInit {
	@ViewChild('contentRef') public contentRef: TemplateRef<any>;

	constructor(@Host() @Optional() private parent: FormElementComponent) {}

	ngOnInit(): void {
		// this is being run next cycle, because we dont want to fail if the order of components is as follows:
		// <app-form-error />
		// <some-input />
		// That would fail, because the logic of the form error is run first, and at that moment, the `some-input` isnt registered yet
		setTimeout(() => {
			this.parent.registerCaption(this.contentRef);
		});
	}
}
