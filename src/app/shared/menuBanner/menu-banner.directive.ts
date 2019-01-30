import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
    selector: '[banner-host]',
  })
export class MenuBannerDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}
