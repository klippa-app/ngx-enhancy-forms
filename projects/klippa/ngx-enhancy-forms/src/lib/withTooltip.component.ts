import {
	ApplicationRef,
	Directive,
	ElementRef,
	EmbeddedViewRef,
	Input, NgZone,
	TemplateRef
} from "@angular/core";
import {stringIsSetAndFilled} from "./util/values";

const triangleSize = '12px';
const zIndexStart = 99999999;

const colors = {
	orange: { noAlpha: 'rgb(255, 128, 0)', withAlpha: 'rgba(255, 128, 0, 0.1254901961)', background: 'rgb(255, 255, 255)'},
	black: { noAlpha: 'rgb(40, 40, 40)', withAlpha: 'rgba(40, 40, 40, 0.1254901961)', background: 'rgb(255, 255, 255)'},
	whiteOnBlack: { noAlpha: 'rgb(255, 255, 255)', withAlpha: 'rgba(255, 255, 255, 0.1254901961)', background: 'rgba(12, 17, 29)'},
};

@Directive({
	selector: '[klpWithTooltip]'
})
export class WithTooltipDirective {
	private div: HTMLElement;
	private triangle: HTMLElement;
	private triangleWhite: HTMLElement;
	@Input() klpWithTooltip: 'orange'| 'black' | 'whiteOnBlack' = 'orange';
	@Input() tooltipText: string;
	@Input() tooltipTemplate: TemplateRef<any>;
	@Input() tooltipMaxWidth = 200;
	@Input() position: 'top' | 'bottom' = 'top';
	private templateInstance: HTMLElement;
	private viewRefForTemplate: EmbeddedViewRef<any>;
	constructor(private el: ElementRef, private appRef: ApplicationRef, private ngZone: NgZone) {
		this.ngZone.runOutsideAngular(() => {
			el.nativeElement.addEventListener('mouseenter', () => {
				if (this.tooltipTemplate) {
					this.hookUpTemplate();
				}
				let textToDisplay: string;
				if (!this.templateInstance) {
					textToDisplay = this.tooltipText || el.nativeElement.innerText.trim();
				}
				if (!stringIsSetAndFilled(this.klpWithTooltip)) {
					return;
				}
				if (!stringIsSetAndFilled(textToDisplay) && !this.tooltipTemplate) {
					return;
				}
				if (stringIsSetAndFilled(this.tooltipText)) {
					if (this.tooltipText === el.nativeElement.innerText) {
						return;
					}
				} else if (this.tooltipTemplate) {
					// no need to check here, just render the template
				} else {
					if (el.nativeElement.offsetWidth >= el.nativeElement.scrollWidth) {
						return;
					}
				}
				if (getComputedStyle(el.nativeElement).position === 'static') {
					el.nativeElement.style.position = 'relative';
				}

				this.div = document.createElement('div');
				this.div.style.zIndex = `${zIndexStart + 2}`;
				this.div.style.color = `${colors[this.klpWithTooltip].noAlpha}`;
				this.div.style.backgroundColor = `${colors[this.klpWithTooltip].background}`;
				this.div.style.position = 'fixed';
				this.div.style.left = `${el.nativeElement.getBoundingClientRect().x}px`;
				if (this.position === 'top') {
					this.div.style.top = `${el.nativeElement.getBoundingClientRect().y}px`;
					this.div.style.transform = `translate(calc(-100% + ${el.nativeElement.getBoundingClientRect().width}px), calc(-100% - 0.3rem))`;
				} else if (this.position === 'bottom') {
					this.div.style.top = `${el.nativeElement.getBoundingClientRect().y + el.nativeElement.getBoundingClientRect().height}px`;
					this.div.style.transform = `translate(calc(-100% + ${el.nativeElement.getBoundingClientRect().width}px), calc(0% + 0.3rem))`;
				}
				this.div.style.maxWidth = `${this.tooltipMaxWidth}px`;
				this.div.style.whiteSpace = 'break-spaces';
				this.div.style.border = `1px solid ${colors[this.klpWithTooltip].withAlpha}`;
				this.div.style.boxShadow = `2px 3px 10px 0px ${colors[this.klpWithTooltip].withAlpha}`;
				this.div.style.padding = '0.3rem 0.5rem';
				this.div.style.boxSizing = 'border-box';
				this.div.style.borderRadius = '3px';
				this.div.style.wordBreak = 'break-all';
				if (stringIsSetAndFilled(textToDisplay)) {
					this.div.textContent = textToDisplay;
				} else if (this.templateInstance) {
					this.div.style.maxWidth = 'none';
					this.div.style.visibility = 'hidden';
					this.div.appendChild(this.templateInstance);
					setTimeout(() => {
						const color = getComputedStyle(this.templateInstance).backgroundColor || getComputedStyle(this.templateInstance).background;
						this.div.style.backgroundColor = color;
						this.div.style.visibility = 'visible';
					});
				}
				el.nativeElement.prepend(this.div);

				this.triangle = document.createElement('div');
				this.triangle.style.zIndex = `${zIndexStart + 1}`;
				this.triangle.style.position = 'fixed';
				this.triangle.style.left = `calc(${el.nativeElement.getBoundingClientRect().x + el.nativeElement.getBoundingClientRect().width}px - 0.8rem)`;
				if (this.position === 'top') {
					this.triangle.style.top = `${el.nativeElement.getBoundingClientRect().y}px`;
					this.triangle.style.transform = `translate(-50%, calc(-100% + 0.1rem))`;
				} else if (this.position === 'bottom') {
					this.triangle.style.top = `${el.nativeElement.getBoundingClientRect().y + el.nativeElement.getBoundingClientRect().height}px`;
					this.triangle.style.transform = `translate(-50%, 0rem) rotate(180deg)`;
				}
				this.triangle.style.width = '0';
				this.triangle.style.height = '0';
				this.triangle.style.borderLeft = `${triangleSize} solid transparent`;
				this.triangle.style.borderRight = `${triangleSize} solid transparent`;
				this.triangle.style.borderTop = `${triangleSize} solid ${colors[this.klpWithTooltip].withAlpha}`;
				el.nativeElement.prepend(this.triangle);

				this.triangleWhite = document.createElement('div');
				this.triangleWhite.style.zIndex = `${zIndexStart + 3}`;
				this.triangleWhite.style.position = 'fixed';
				this.triangleWhite.style.left = `calc(${el.nativeElement.getBoundingClientRect().x + el.nativeElement.getBoundingClientRect().width}px - 0.8rem)`;
				if (this.position === 'top') {
					this.triangleWhite.style.top = `${el.nativeElement.getBoundingClientRect().y}px`;
					this.triangleWhite.style.transform = `translate(-50%, calc(-100% + 0.1rem - 2px))`;
				} else if (this.position === 'bottom') {
					this.triangleWhite.style.top = `${el.nativeElement.getBoundingClientRect().y + el.nativeElement.getBoundingClientRect().height}px`;
					this.triangleWhite.style.transform = `translate(-50%, -2px) rotate(180deg)`;
				}
				this.triangleWhite.style.width = '0';
				this.triangleWhite.style.height = '0';
				this.triangleWhite.style.borderLeft = `${triangleSize} solid transparent`;
				this.triangleWhite.style.borderRight = `${triangleSize} solid transparent`;

				if (stringIsSetAndFilled(textToDisplay)) {
					this.triangleWhite.style.borderTop = `${triangleSize} solid ${colors[this.klpWithTooltip].background}`;
				} else if (this.templateInstance) {
					this.div.style.visibility = 'hidden';
					setTimeout(() => {
						const color = getComputedStyle(this.templateInstance).backgroundColor || getComputedStyle(this.templateInstance).background;
						this.triangleWhite.style.borderTop = `${triangleSize} solid ${color}`;
						this.div.style.visibility = 'visible';
					});
				}

				el.nativeElement.prepend(this.triangleWhite);
			});

			el.nativeElement.addEventListener('mouseleave', () => {
				if (this.tooltipTemplate) {
					this.cleanUpTemplate();
				}
				try {
					el.nativeElement.removeChild(this.div);
				} catch (ex) {}
				try {
					el.nativeElement.removeChild(this.triangle);
				} catch (ex) {}
				try {
					el.nativeElement.removeChild(this.triangleWhite);
				} catch (ex) {}
			});
		});
	}

	public hookUpTemplate(): void {
		this.viewRefForTemplate = this.tooltipTemplate.createEmbeddedView(null);
		this.appRef.attachView(this.viewRefForTemplate);
		this.templateInstance = this.viewRefForTemplate.rootNodes[0];
	}

	public cleanUpTemplate(): void {
		this.appRef.detachView(this.viewRefForTemplate);
		this.viewRefForTemplate.destroy();
	}
}
