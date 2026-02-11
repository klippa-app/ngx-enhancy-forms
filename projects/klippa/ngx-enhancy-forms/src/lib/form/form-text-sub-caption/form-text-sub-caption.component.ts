import {Component, inject, Input} from '@angular/core';
import {FormElementComponent} from '../../form/form-element/form-element.component';
import {GetSizeClass} from '../../form/form.component';

@Component({
	selector: 'klp-form-text-sub-caption',
	templateUrl: './form-text-sub-caption.component.html',
	styleUrls: ['./form-text-sub-caption.component.scss'],
	standalone: false
})
export class FormTextSubCaptionComponent {
	@Input({required: true}) public text!: string;
	protected parent = inject(FormElementComponent, {optional: true});
	protected readonly GetSizeClass = GetSizeClass;
}
