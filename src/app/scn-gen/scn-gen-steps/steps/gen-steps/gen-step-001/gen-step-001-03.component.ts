import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MsksService} from '../../../../../shared/msks';

@Component({
    templateUrl: './gen-step-001-03.component.html',
    styleUrls: ['./gen-step-001-03.component.scss']
})
export class GenStep00103Component implements OnInit {
    messageAbort= 'SCN-GEN-STEPS.ABORT_CONFIRM';
    carddata: any = {};
    constructor(private router: Router,
                private service: MsksService,
                private translate: TranslateService) {}

    public ngOnInit() {
        console.log('call ngOnInit');
        // this.nextRoute();
        this.validateAuthority();
    }
    /**
     * nextPage.
     */
    nextRoute() {
        this.router.navigate(['/scn-gen/steps/step-001-04']);
        return;
    }

    /**
     * backPage.
     */
    backRoute() {
        this.router.navigate(['/scn-gen/gen002/LV1HKIC']);
    }

    timeExpire() {
        setTimeout(() => {
            this.router.navigate(['/scn-gen/gen002/LV1HKIC']);
        }, 500);
    }

    langButton() {
        const browserLang = this.translate.currentLang;
        console.log(browserLang);
        if (browserLang === 'zh-HK') {
            this.translate.use('en-US');
        } else {
            this.translate.use('zh-HK');
        }
    }

    /**
     *  readCard info b
     */
    readCardFromChip() {
        console.log('call : readCardFromChip fun.')
        this.service.sendRequest('RR_cardreader', 'readhkicv2citizen', {}).subscribe((resp) => {
            if (resp) {
                const card_type = resp.card_type;
                const date_of_birth = resp.date_of_birth;
                const hkic_number = resp.hkic_number;
                const name_english = resp.name_english;
                console.log('readCardFromChip operate success,:resp=' + resp);
                this.carddata = {...resp};
               // alert('card_type: ' + card_type + ';hkic_number:' + hkic_number + '; name_english:' + name_english);
                this.closeCard();
            }
        });
    }

    /**
     *  close card.
     */
    closeCard() {
        console.log('call closecard fun');
        this.service.sendRequest('RR_cardreader', 'closecard', {}).subscribe((resp) => {
            this.nextRoute();
        });
    }

    /**
     * validate Authority.
     */
    validateAuthority() {
        console.log('call validateAuthority');
        const param = {
            'date_of_registration': null,
            'hkic_no': null
        }
        this.service.sendRequest('RR_cardreader', 'opencard', {'contactless_password': param}).subscribe((resp) => {
            if (resp.result === true) {
                console.log('call validateAuthority operate success');
                this.readCardFromChip();

            } else {
                console.log('call validateAuthority fail');
            }
        });
    }
}
