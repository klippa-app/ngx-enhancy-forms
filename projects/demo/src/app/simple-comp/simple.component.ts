import {Component, Input} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";


@Component({
	selector: 'app-simple',
	templateUrl: './simple.component.html',
	styleUrls: ['./simple.component.scss'],
})
export default class SimpleComponent {
	@Input() text!:	string;
	protected myFormGroup = new FormGroup({
		wutu: new FormControl(),
	});

	ngOnInit(): void {
		console.log('init');
	}


	ngOnDestroy() {
		console.log('destroy');
	}
}
