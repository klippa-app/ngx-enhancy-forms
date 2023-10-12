import {Directive, ElementRef, Input} from "@angular/core";

@Directive({
	selector: '[klpWithTooltip]'
})
export class WithTooltipDirective {
	private div: HTMLElement;
	private triangle: HTMLElement;
	@Input() klpWithTooltip = true;
	constructor(el: ElementRef) {
		el.nativeElement.addEventListener('mouseenter', () => {
			if (!this.klpWithTooltip) {
				return;
			}
			if (getComputedStyle(el.nativeElement).position === 'static') {
				el.nativeElement.style.position = 'relative';
			}

			this.div = document.createElement('div');
			this.div.style.zIndex = '2';
			this.div.style.color = '#515365';
			this.div.style.position = 'fixed';
			this.div.style.left = `${el.nativeElement.getBoundingClientRect().x}px`;
			this.div.style.top = `${el.nativeElement.getBoundingClientRect().y}px`;
			this.div.style.transform = `translate(calc(-100% + ${el.nativeElement.getBoundingClientRect().width}px), calc(-100% - 0.3rem))`;
			this.div.style.maxWidth = '200px';
			this.div.style.whiteSpace = 'break-spaces';
			this.div.style.backgroundColor = 'white';
			this.div.style.border = '1px solid rgba(255, 128, 0, 0.1254901961)';
			this.div.style.boxShadow = `2px 3px 10px 0px rgba(255, 128, 0, 0.1254901961)`;
			this.div.style.padding = '0.3rem 0.5rem';
			this.div.style.boxSizing = 'border-box';
			this.div.style.borderRadius = '3px';
			this.div.textContent = el.nativeElement.innerText;
			el.nativeElement.prepend(this.div);

			this.triangle = document.createElement('div');
			this.triangle.style.zIndex = '1';
			this.triangle.style.position = 'fixed';
			this.triangle.style.left = `calc(${el.nativeElement.getBoundingClientRect().x + el.nativeElement.getBoundingClientRect().width}px - 3rem)`;
			this.triangle.style.top = `${el.nativeElement.getBoundingClientRect().y}px`;
			this.triangle.style.transform = `translate(-50%, calc(-100% + 0.1rem))`;
			this.triangle.style.width = '0';
			this.triangle.style.height = '0';
			this.triangle.style.borderLeft = '0.8rem solid transparent';
			this.triangle.style.borderRight = '0.8rem solid transparent';
			this.triangle.style.borderTop = '0.8rem solid rgba(255, 128, 0, 0.1254901961)';
			el.nativeElement.prepend(this.triangle);
		});
		el.nativeElement.addEventListener('mouseout', () => {
			try {
				el.nativeElement.removeChild(this.div);
			} catch (ex) {}
			try {
				el.nativeElement.removeChild(this.triangle);
			} catch (ex) {}
		});
	}
}
