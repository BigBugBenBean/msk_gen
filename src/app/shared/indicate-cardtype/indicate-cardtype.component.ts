import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'sc2-indicate-cardtype',
    templateUrl: './indicate-cardtype.component.html',
    styleUrls: [ './indicate-cardtype.component.scss' ],
})

export class IndicateCardTypeComponent {
    // @Input() label: String = 'Processing...';

    public visible = false;
    public visibleAnimate = false;

    public show(): void {
        this.visible = true;
        setTimeout(() => this.visibleAnimate = true, 100);
    }

    public hide(): void {
        this.visibleAnimate = false;
        setTimeout(() => this.visible = false, 300);
    }
 }
