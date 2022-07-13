import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ValueAccessorBase} from './elements/value-accessor-base/value-accessor-base.component';
import {ButtonComponent} from './elements/button/button.component';
import {CheckboxComponent} from './elements/checkbox/checkbox.component';
import {EmailInputComponent} from './elements/email/email-input.component';
import {LoadingIndicatorComponent} from './elements/loading-indicator/loading-indicator.component';
import {NumberInputComponent} from './elements/number-input/number-input.component';
import {PasswordFieldComponent} from './elements/password-field/password-field.component';
import {SelectComponent} from './elements/select/select.component';
import {SelectFooterComponent} from './elements/select/select-footer/select-footer.component';
import {SortableItemsComponent} from './elements/sortable-items/sortable-items.component';
import {TextInputComponent} from './elements/text-input/text-input.component';
import {ToggleComponent} from './elements/toggle/toggle.component';
import {FormCaptionComponent} from './form/form-caption/form-caption.component';
import {FormElementComponent} from './form/form-element/form-element.component';
import {FormErrorComponent} from './form/form-error/form-error.component';
import {FormSubmitButtonComponent} from './form/form-submit-button/form-submit-button.component';
import {FormComponent, SubFormDirective} from './form/form.component';
import {SortablejsModule} from 'ngx-sortablejs';
import {NgSelectModule} from '@ng-select/ng-select';
import {DatePickerComponent} from './elements/date-picker/date-picker.component';
import {DateTimePickerComponent} from './elements/date-time-picker/date-time-picker.component';
import {MaterialModule} from './material.module';
import {MultipleValueAccessorBase} from './elements/value-accessor-base/multiple-value-accessor-base.component';
import {FileInputComponent} from './elements/file-input/file-input.component';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgSelectModule,
		SortablejsModule,
		MaterialModule,
	],
	declarations: [
		ValueAccessorBase,
		MultipleValueAccessorBase,
		ButtonComponent,
		CheckboxComponent,
		DatePickerComponent,
		DateTimePickerComponent,
		EmailInputComponent,
		LoadingIndicatorComponent,
		NumberInputComponent,
		PasswordFieldComponent,
		SelectComponent,
		SelectFooterComponent,
		SortableItemsComponent,
		TextInputComponent,
		ToggleComponent,
		FileInputComponent,
		FormCaptionComponent,
		FormElementComponent,
		FormErrorComponent,
		FormSubmitButtonComponent,
		FormComponent,
		SubFormDirective,
	],
	exports: [
		ValueAccessorBase,
		MultipleValueAccessorBase,
		ButtonComponent,
		DatePickerComponent,
		DateTimePickerComponent,
		CheckboxComponent,
		EmailInputComponent,
		LoadingIndicatorComponent,
		NumberInputComponent,
		PasswordFieldComponent,
		SelectComponent,
		SelectFooterComponent,
		SortableItemsComponent,
		TextInputComponent,
		ToggleComponent,
		FileInputComponent,
		FormCaptionComponent,
		FormElementComponent,
		FormErrorComponent,
		FormSubmitButtonComponent,
		FormComponent,
		SubFormDirective,
	]
})
export class NgxEnhancyFormsModule {
}
