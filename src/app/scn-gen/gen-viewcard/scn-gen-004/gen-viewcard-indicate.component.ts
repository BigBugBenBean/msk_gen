import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmModule, ConfirmComponent, TimerModule } from '../../../shared';
import { MsksService } from '../../../shared/msks';
import { READ_ROP140_RETRY, TIMEOUT_MILLIS, TIMEOUT_PAYLOAD, ABORT_I18N_KEY, ABORT_YES_I18N_KEY } from '../../../shared/var-setting';
import { TranslateService } from '@ngx-translate/core';

import { AppStatus } from '../../../shared/services/app-status';

@Component({
    selector: 'sc2-sck-003',
    templateUrl: './gen-viewcard-indicate.component.html',
    styleUrls: ['./gen-viewcard-indicate.component.scss'],
})

export class IndicateComponent implements OnInit {
    @ViewChild('modalRetry')
    public modalRetry: ConfirmComponent;

    @ViewChild('modalFail')
    public modalFail: ConfirmComponent;

    @ViewChild('modalNoROP')
    public modalNoROP: ConfirmComponent;

    @ViewChild('imgNext')
    public nextPage: ElementRef;

    messageRetry: String = 'Please re-insert your ROP 140/ROP 140A form.';
    messageFail: String = 'The insert form is not be recognized, please contact the officer for completing your registration.';
    messageNoROP: String = 'No ROP 140/ROP 140A form is inserted.';

    retryVal = 0;
    isEN: boolean;
    messageAbort: string;
    isAbort: boolean;

    constructor(private router: Router,
        private service: MsksService,
        private translate: TranslateService) { }

    public ngOnInit() {
        // this.ReadHKID();
        // re activate when hardware is ready
        this.messageAbort = ABORT_I18N_KEY;
        this.isAbort = false;
        const browserLang = this.translate.currentLang;
        if (browserLang === 'zh-HK') {
            this.isEN = false;
        } else {
            this.isEN = true;
        }
        // this.flashDevice();
    }

    MALocalChecking() {
        console.log('Processing MALocalChecking...');
        // this.nextRoute();
    }

    nextRoute() {
        // bypassing loading screen page
        this.router.navigate(['/main/sck004']);
        // this.router.navigate(['/main/sck005']);
    }

    backRoute() {
        this.messageAbort = ABORT_YES_I18N_KEY;
        this.isAbort = true;
        // Call the ROP.UpdateAppStatus(“SCK_ISS_SUP_<step>”)
        setTimeout(() => {
            this.router.navigate(['/sck001']);
        }, 3000);
    }

    timeExpire() {
        this.modalNoROP.show();
        setTimeout(() => {
            this.router.navigate(['/sck001']);
        }, TIMEOUT_MILLIS);
    }

    langButton() {
        const browserLang = this.translate.currentLang;
        if (browserLang === 'zh-HK') {
            this.translate.use('en-US');
            this.isEN = true;
        } else {
            this.translate.use('zh-HK');
            this.isEN = false;
        }
    }

    nextOne() {
        this.router.navigate(['/scn-gen/viewcard/insertcard']);
    }
    nextTwo() {
        this.router.navigate(['/scn-gen/viewcard/insertcard']);
    }
}
