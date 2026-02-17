import {Component, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormElementComponent} from '../../form/form-element/form-element.component';
import {
	DefaultSize, FormSize,
	getSizeClass,
	KLP_FORM_DEFAULT_SIZE,
	SizeClass
} from '../../form/form-size-provider/form-size-provider';

@Component({
    selector: 'klp-form-loading-indicator',
    templateUrl: './loading-indicator.component.html',
    styleUrls: ['./loading-indicator.component.scss'],
    standalone: false
})
export class LoadingIndicatorComponent implements OnInit, OnChanges {
	@Input() public variant: '3dots' | 'spinner' | 'textInput' | 'picker' = '3dots';
	@Input() public size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' = 'medium';
	@Input() public formSize: FormSize | null = null;

	private injectedSize = inject(KLP_FORM_DEFAULT_SIZE, {optional: true});
	protected parent = inject(FormElementComponent, { optional: true });
	protected sizeClass: SizeClass;

	ngOnInit(): void {
		if (!this.size) {
			this.size = this.parent?.size ?? this.injectedSize ?? DefaultSize;
		}

		this.sizeClass = getSizeClass(this.formSize);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.formSize) {
			this.sizeClass = getSizeClass(this.formSize);
		}
	}
}
