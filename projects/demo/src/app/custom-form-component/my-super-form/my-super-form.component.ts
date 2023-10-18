import { Component, Input } from "@angular/core";
import { FormComponent } from "@klippa/ngx-enhancy-forms";

@Component({
  selector: 'app-my-super-form',
  templateUrl: './my-super-form.component.html',
  styleUrls: ['./my-super-form.component.scss'],
	providers: [{provide: FormComponent, useExisting: MySuperFormComponent}]
})
export class MySuperFormComponent extends FormComponent {
	@Input()
	public submitCallback: (renderedAndEnabledValues: object, renderedButDisabledValues: object) => Promise<any>;
}
