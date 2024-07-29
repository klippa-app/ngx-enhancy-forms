import { Component} from "@angular/core";

@Component({
	selector: 'app-simple',
	templateUrl: './simple.component.html',
	styleUrls: ['./simple.component.scss'],
})
export default class SimpleComponent {
	public text = 'world';

	ngOnInit(): void {
		setTimeout(() => {
			console.log('update plz');
			this.text = 'hello again!';
		}, 1000);
	}
}
