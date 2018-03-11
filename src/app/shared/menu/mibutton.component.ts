import { Component, Input, AfterContentInit, ChangeDetectionStrategy } from '@angular/core';
import { MsksApp, AppType } from '.';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from './mi.model';
import { Router } from '@angular/router';

import { MsksService } from '../msks';

@Component({
    selector: 'sc2-menu-button',
    templateUrl: './mibutton.component.html',
    styleUrls: ['./mibutton.styl.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuButtonComponent implements AfterContentInit {

    @Input()
    public index: string;

    @Input()
    public chiname: string;

    @Input()
    public engname: string;

    @Input()
    public iconpath: string;

    @Input()
    public menukey: string;

    @Input()
    public app: MsksApp;

    @Input()
    public service?: string;

    @Input()
    public haschild: string;

    public cssclass: any;
    public label: string;
    public type: string;
    public imgsrc: string;

    constructor(private translate: TranslateService,
        private router: Router,
        private msks: MsksService) { }

    ngAfterContentInit() {
        if (this.translate.currentLang === 'zh-HK') {
            this.label = this.chiname;
        } else {
            this.label = this.engname;
        }

        this.type = this.iconpath ? 'image' : 'text';

        this.imgsrc = require('../../../assets/images/button_2.png');

        console.log('menukey', this.menukey);
        console.log('iconpath', this.iconpath);
        console.log('app', this.app);
        console.log('haschild', this.haschild);
    }

    getBtnClasses() {
        switch (this.index) {
            case '1':
                return {
                    'firstLeft': true,
                    'firstTop': true
                };
            case '2':
                return {
                    'secondLeft': true,
                    'firstTop': true
                };
            case '3':
                return {
                    'thirdLeft': true,
                    'firstTop': true
                };
            case '4':
                return {
                    'firstLeft': true,
                    'secondTop': true
                };
            case '5':
                return {
                    'secondLeft': true,
                    ' secondTop': true
                };
            case '6':
                return {
                    'thirdLeft': true,
                    'secondTop': true
                };
            case '7':
                return {
                    'firstLeft': true,
                    'thirdTop': true
                };
            case '8':
                return {
                    'secondLeft': true,
                    'thirdTop': true
                };
            case '9':
                return {
                    'thirdLeft': true,
                    'thirdTop': true
                };
        }
    }

    getLblClasses() {
        switch (this.index) {
            case '1':
                return {
                    'buttonDiv1': true,
                };
            case '2':
                return {
                    'buttonDiv2': true,
                };
            case '3':
                return {
                    'buttonDiv3': true,
                };
            case '4':
                return {
                    'buttonDiv4': true,
                };
            case '5':
                return {
                    'buttonDiv5': true,
                };
            case '6':
                return {
                    'buttonDiv6': true,
                };
            case '7':
                return {
                    'buttonDiv7': true,
                };
            case '8':
                return {
                    'buttonDiv8': true,
                };
            case '9':
                return {
                    'buttonDiv9': true,
                };
        }
    }

    public onClick($event) {
        if (this.haschild === 'true') {
            this.router.navigate(['/scn-gen/gen002', this.menukey]);
            return;
        } else if (!this.app) {
            console.warn('Miss configuration missing msksapp', this.menukey);
        }
        console.log(this.app.type === AppType.WEB);
        switch (this.app.type) {
            case AppType.APPLICATION:

            this.msks.sendRequest('RR_LAUNCHER', 'launch', {
                exemode: 'execfile',
                cmdfile: this.app.path,
                cwd: this.app.cwd
            }, 'PGC').subscribe();
            break;
        }
    }
}
