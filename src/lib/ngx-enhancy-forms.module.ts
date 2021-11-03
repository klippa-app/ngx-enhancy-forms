import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ValueAccessorBase} from "./elements/value-accessor-base/value-accessor-base.component";
import {CheckboxComponent} from "./elements/checkbox/checkbox.component";
import {FormsModule} from "@angular/forms";
import {EmailInputComponent} from "./elements/email/email-input.component";
import {NumberInputComponent} from "./elements/number-input/number-input.component";
import {PasswordFieldComponent} from "./elements/password-field/password-field.component";
import {SelectComponent} from "./elements/select/select.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {SortableItemsComponent} from "./elements/sortable-items/sortable-items.component";
import {SortablejsModule} from "ngx-sortablejs";
import {TextInputComponent} from "./elements/text-input/text-input.component";
import {ToggleComponent} from "./elements/toggle/toggle.component";
import {FormCaptionComponent} from "./form/form-caption/form-caption.component";
import {FormElementComponent} from "./form/form-element/form-element.component";
import {FormErrorComponent} from "./form/form-error/form-error.component";
import {FormSubmitButtonComponent} from "./form/form-submit-button/form-submit-button.component";
import {ButtonComponent} from "./elements/button/button.component";
import {LoadingIndicatorComponent} from "./elements/loading-indicator/loading-indicator.component";
import {FormComponent} from "./form/form.component";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgSelectModule,
		SortablejsModule,
	],
	declarations: [
		ValueAccessorBase,
		ButtonComponent,
		CheckboxComponent,
		EmailInputComponent,
		LoadingIndicatorComponent,
		NumberInputComponent,
		PasswordFieldComponent,
		SelectComponent,
		SortableItemsComponent,
		TextInputComponent,
		ToggleComponent,
		FormCaptionComponent,
		FormElementComponent,
		FormErrorComponent,
		FormSubmitButtonComponent,
		FormComponent,
	],
	exports: [
		ValueAccessorBase,
		CheckboxComponent,
		EmailInputComponent,
		NumberInputComponent,
		PasswordFieldComponent,
	]
})
export class NgxEnhancyFormsModule {
}
