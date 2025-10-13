import {Component, Input} from "@angular/core";
import {FormGroup} from "@angular/forms";


@Component({
	selector: 'app-simple',
	templateUrl: './simple.component.html',
	styleUrls: ['./simple.component.scss'],
})
export default class SimpleComponent {
	@Input() text!:	string;
	protected myFormGroup = new FormGroup({});

	ngOnInit(): void {
		console.log('init');
	}


	ngOnDestroy() {
		console.log('destroy');
	}
}
