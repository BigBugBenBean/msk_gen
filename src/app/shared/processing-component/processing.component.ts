import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'sc2-process-comp',
    templateUrl: './processing.component.html',
    styleUrls: [ './processing.component.scss' ],
})

export class ProcessingComponent {
    @Input() promptText = 'SCN-SCK-004-1.PROCESSING';

    constructor(private translate: TranslateService) {}
 }
