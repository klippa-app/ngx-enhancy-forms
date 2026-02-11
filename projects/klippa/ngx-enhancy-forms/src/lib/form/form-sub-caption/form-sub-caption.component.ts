import {
	AfterContentInit,
	AfterViewInit,
	Component,
	ElementRef,
	Host, inject,
	OnDestroy,
	OnInit,
	Optional,
	TemplateRef,
	ViewChild
} from '@angular/core';
import {FormElementComponent} from '../form-element/form-element.component';

@Component({
	selector: 'klp-form-sub-caption',
	templateUrl: './form-sub-caption.component.html',
	styleUrls: ['./form-sub-caption.component.scss'],
	standalone: false
})
export class FormSubCaptionComponent implements AfterViewInit, OnDestroy {
	@ViewChild('contentRef') public contentRef: TemplateRef<any>;
	private parent = inject(FormElementComponent, {optional: true});

	ngAfterViewInit(): void {
		setTimeout(() => {
			// Avoid changing state in the first CD cycle
			this.parent.registerSubCaption(this.contentRef);
		});
	}

	ngOnDestroy(): void {
		this.parent.registerSubCaption(null);
	}
}
