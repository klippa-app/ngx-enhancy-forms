import { Component, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.scss'],
})
export class CustomFormComponent {
	protected form = inject(FormBuilder).group({
		name: [null, Validators.required],
		age: [25, Validators.min(16)],
	})

	public readonly onSubmit = async ({name, age}: any) => {
		window.alert(`Hello ${name} of ${age} years!`);
	}
}
