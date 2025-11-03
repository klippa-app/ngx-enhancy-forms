import {Component, inject, Input, Optional, ViewChild} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {FormComponent, SubFormDirective} from "@klippa/ngx-enhancy-forms";
import {isValueSet} from "../../../../klippa/ngx-enhancy-forms/src/lib/util/values";


@Component({
	selector: 'app-simple',
	templateUrl: './simple.component.html',
	styleUrls: ['./simple.component.scss'],
})
export default class SimpleComponent {
	@Input() text!:	string;
	protected myFormGroup = new FormGroup({
		wutu: new FormControl(),
	});

	@ViewChild('formComponent') formComponent: FormComponent;

	constructor(@Optional() private subFormDirective: SubFormDirective) {
	}

	hookUpAsSubForm = () => {
		if (isValueSet(this.subFormDirective)) {
			this.formComponent._ext_attachAsSubForm();
		}
	};


	ngOnDestroy() {
		console.log('destroy');
	}
}
