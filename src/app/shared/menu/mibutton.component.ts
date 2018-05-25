import { Component, Input, AfterContentInit, ChangeDetectionStrategy } from '@angular/core';
import { MsksApp, AppType, MenuService } from '.';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from './mi.model';
import { Router } from '@angular/router';

import { MsksService } from '../msks';
import {ValidatorFingerprintService} from '../services/validator-services/validator.fingerprint.service';
import {SlipprintService} from '../services/print-service/slipprint.service';

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
    public iconpathen: string;

    @Input()
    public iconpathchi: string;

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
        private msks: MsksService,
        private fingers: ValidatorFingerprintService,
        private printslip: SlipprintService,
        private menusrv: MenuService) { }

    ngAfterContentInit() {
        this.type = this.iconpathen || this.iconpathchi ? 'image' : 'text';

        if (this.translate.currentLang === 'zh-HK') {
            this.label = this.chiname;
            if (this.type === 'image') {
                const image = this.getImage(this.iconpathchi);
                this.imgsrc = image ? image : require('../../../assets/images/button_6.png');
            }
        } else {
            this.label = this.engname;
            if (this.type === 'image') {
                const image = this.getImage(this.iconpathen);
                this.imgsrc = image ? image : require('../../../assets/images/button_6.png');
            }
        }
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
        console.log('start call startFingerprintScanner');
        // call fingerprint scan validator
        this.fingers.startFingerprintScanner();
        this.handlePrint();
        if (this.haschild === 'true') {
            if (this.service) {
                this.router.navigate(['/scn-gen/gen002', this.menukey, this.service]);
            } else {
                this.router.navigate(['/scn-gen/gen002', this.menukey]);
            }
            return;
        } else if (!this.app) {
            console.warn('Miss configuration missing msksapp', this.menukey);
        }
        if (this.menukey === 'LV2HKICCheck') {
            this.router.navigate(['scn-gen/gen002/hkic2/view']);
            return;
        }

        // console.log('app.type', this.app.type, this.app.path);
        switch (this.app.type) {
            case AppType.APPLICATION:

                this.msks.sendRequest('RR_LAUNCHER', 'launch', {
                    exemode: 'execfile',
                    cmdfile: this.app.path,
                    cwd: this.app.cwd
                }, 'PGC').subscribe();
                break;
            case AppType.WEB:
                this.router.navigate(['/scn-gen/iframe', this.app.path]);
                break;
        }
    }

    private getImage(imgpath: string) {
        const str = sessionStorage.getItem(imgpath);

        if (str) {
            const json = JSON.parse(str);
            return `data:${json['mime-type']};base64,${json['content']}`;
        } else {
            return '';
        }
    }

    /**
     * call print fun.
     */
    private handlePrint() {
        console.log('call handlePrint');
        // test data.
        const dataJson = [
            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '100',
                'attribute': 'normal'
            },
            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '200',
                'attribute': 'normal'
            },
            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'small'
            },
            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'bold'
            },
            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'double_height'
            },
            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'double_width'
            },
            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'underline'
            },
            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'double_width|bold'
            },
            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'double_width|double_height'
            },
            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'reverse'
            },
            {
                'type': 'vspace',
                'data': '100',
                'height': '',
                'leftMargin': '',
                'attribute': ''
            },
            {
                'type': 'barcode',
                'data': '1234567890',
                'height': '80',
                'leftMargin': '0',
                'attribute': 'CODE128|DOWN_SIDE'
            },
            {
                'type': 'barcode',
                'data': '1234567890',
                'height': '80',
                'leftMargin': '0',
                'attribute': 'CODE128|NO_TEXT'
            },
            {
                'type': 'barcode',
                'data': 'code93 88888',
                'height': '120',
                'leftMargin': '0',
                'attribute': 'CODE93|UP_SIDE|SMALL_FONT'
            },
            {
                'type': 'vspace',
                'data': '200',
                'height': '',
                'leftMargin': '',
                'attribute': ''
            },
            {
                'type': 'bmp',
                'data': 'Base64 bmp Data',
                'height': '',
                'leftMargin': '0',
                'attribute': ''
            },
            {
                'type': 'cutpaper',
                'data': '',
                'height': '',
                'leftMargin': '',
                'attribute': 'full'
            },
            {
                'type': 'cutpaper',
                'data': '',
                'height': '',
                'leftMargin': '',
                'attribute': 'black|full'
            },
            {
                'type': 'cutpaper',
                'data': '',
                'height': '',
                'leftMargin': '',
                'attribute': 'black|half'
            }
        ];
        this.printslip.printSlip(dataJson);
    }
}
