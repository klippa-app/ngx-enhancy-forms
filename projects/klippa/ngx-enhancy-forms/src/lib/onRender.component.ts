import {
	AfterViewInit,
	Component,
	ComponentRef,
	Directive, ElementRef,
	Host, Inject, inject, InjectionToken,
	Injector,
	Input,
	OnInit,
	Optional,
	Self,
	SkipSelf, ViewContainerRef
} from "@angular/core";
import {runNextRenderCycle} from "./util/angular";

@Directive({
	selector: '[onRenderFn]'
})
export class OnRenderDirective implements AfterViewInit {
	constructor(@Host() @Self() @Optional() private hostComponent: any) {
	}
	@Input() onRenderFn: (a: any) => any;

	ngAfterViewInit(): void {
		console.log(this.hostComponent);
		// const component1 = this.injector.get<any>();
		runNextRenderCycle(() => this.onRenderFn(1));
	}
}
