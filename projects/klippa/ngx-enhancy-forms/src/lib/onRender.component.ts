import {AfterViewInit, Directive, Input} from "@angular/core";
import {runNextRenderCycle} from "./util/angular";


@Directive({
    selector: '[onRenderFn]',
    standalone: false
})
export class OnRenderDirective implements AfterViewInit {
	@Input() onRenderFn: () => any;

	ngAfterViewInit(): void {
		runNextRenderCycle(() => this.onRenderFn());
	}
}
