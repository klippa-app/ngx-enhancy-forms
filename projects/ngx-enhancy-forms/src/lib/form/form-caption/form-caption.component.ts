import {Component, ElementRef, Host, OnInit, Optional, ViewChild} from '@angular/core';
import {FormElementComponent} from '../form-element/form-element.component';
import {isNullOrUndefined} from '../../util/values';

@Component({
	selector: 'lib-enhancy-forms-form-caption',
	templateUrl: './form-caption.component.html',
	styleUrls: ['./form-caption.component.scss'],
})
export class FormCaptionComponent implements OnInit {
	@ViewChild('contentRef') public contentRef: ElementRef;

	constructor(@Host() @Optional() private parent: FormElementComponent) {
	}

	ngOnInit(): void {
		// this is being run next cycle, because we dont want to fail if the order of components is as follows:
		// <app-form-error />
		// <some-input />
		// That would fail, because the logic of the form error is run first, and at that moment, the `some-input` isnt registered yet
		setTimeout(() => {
			const attachedControl = this.parent.getAttachedControl();
			this.parent.registerCaption(this.contentRef);
			if (isNullOrUndefined(attachedControl)) {
				throw new Error('You added a Form Caption component without an attached Form Control');
			}
		});
	}
}
