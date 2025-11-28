import {Component, Input} from '@angular/core';

@Component({
    selector: 'klp-form-warning-icon',
    templateUrl: './warning-icon.component.html',
    styleUrls: ['./warning-icon.component.scss'],
    standalone: false
})
export class WarningIconComponent {
	@Input() variant: 'line' | 'fill' = 'line';
}
