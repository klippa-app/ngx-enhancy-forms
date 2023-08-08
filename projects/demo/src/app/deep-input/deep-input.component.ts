import { Component, inject } from "@angular/core";
import { FormGroupDirective } from "@angular/forms";

@Component({
	selector: 'app-deep-input',
	templateUrl: './deep-input.component.html',
})
export default class DeepInputComponent {
	protected fg = inject(FormGroupDirective);
}
