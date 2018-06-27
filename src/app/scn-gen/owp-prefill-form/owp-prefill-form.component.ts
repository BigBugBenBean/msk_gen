import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MsksService } from '../../../shared/msks';

import { TranslateService } from '@ngx-translate/core';


@Component({
    templateUrl: './owp-prefill-form.component.html',
    styleUrls: ['./owp-prefill-form.component.scss'],
})

export class OwpPrefillFormComponent implements OnInit {

    isEN: boolean;

    constructor(private router: Router,
                private translate: TranslateService) { }

    public ngOnInit() {
        const browserLang = this.translate.currentLang;
        let url = 'https://ecndc1wvwb02.smartics2.immd.hksarg/smartics2-client/ropbooking/en-US/eservices/owpPrefillForm/term';
        if (browserLang === 'zh-HK') {
            this.isEN = false;
            url = 'https://ecndc1wvwb02.smartics2.immd.hksarg/smartics2-client/ropbooking/zh-HK/eservices/owpPrefillForm/term';
        } else {
            this.isEN = true;
        }
        this.initUrl(url);
    }

    /**
     * init url by lang.
     */
    initUrl(url) {
        console.log('call iniUrl');
        $('#mainIframe').attr('src', url)
    }

    nextRoute() {

    }

    backRoute() {
        this.router.navigate(['/scn-gen/gen002/LV1ROP']);
        return;
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
}
