import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MsksService } from '../../../shared/msks';
import { TranslateService } from '@ngx-translate/core';


@Component({
    templateUrl: './appointment-booking.component.html',
    styleUrls: ['./appointment-booking.component.scss'],
})

export class AppointmentBookingComponent implements OnInit {

    isEN: boolean;

    constructor(private router: Router,
                private translate: TranslateService) { }

    public ngOnInit() {
        const browserLang = this.translate.currentLang;
        let url = 'https://ecndc1wvwb02.smartics2.immd.hksarg/smartics2-client/ropbooking/en-US/eservices/indexPage';
        if (browserLang === 'zh-HK') {
            this.isEN = false;
            url = 'https://ecndc1wvwb02.smartics2.immd.hksarg/smartics2-client/ropbooking/zh-HK/eservices/indexPage';
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
        this.router.navigate(['/scn-gen/gen002/LV1ICAPPBOOKING']);
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
