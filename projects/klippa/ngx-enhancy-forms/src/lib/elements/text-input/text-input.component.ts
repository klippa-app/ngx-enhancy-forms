import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {ValueAccessorBase} from '../value-accessor-base/value-accessor-base.component';

@Component({
	selector: 'klp-form-text-input',
	templateUrl: './text-input.component.html',
	styleUrls: ['./text-input.component.scss'],
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: TextInputComponent, multi: true}],
})
export class TextInputComponent extends ValueAccessorBase<string> {
	@Input() placeholder: string;
	@Input() type: 'text' | 'password' = 'text';
	@Input() clearable: boolean = false;
	@Input() icon: 'search';
	@Input() hasBorderLeft: boolean = true;
	@Input() hasBorderRight: boolean = true;
	@Input() debounceMs: number = 0;
	@Output() onBlur: EventEmitter<void> = new EventEmitter<void>();
	private valueSubject: Subject<string> = new Subject<string>();

	public ngOnInit(): void {
		super.ngOnInit();
		this.valueSubject.pipe(debounceTime(this.debounceMs)).subscribe((val) => {
			this.setInnerValueAndNotify(val)
		});
	}

	public onValueChange(value: string): void {
		this.valueSubject.next(value);
	}
}
