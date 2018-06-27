import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {FingerprintService} from '../../../../../shared/services/fingerprint-service/fingerprint.service';
import {MsksService} from '../../../../../shared/msks';

@Component({
    templateUrl: './gen-step-002-01.component.html',
    styleUrls: ['./gen-step-002-01.component.scss']
})
export class GenStep00201Component implements OnInit {
    messageAbort= 'SCN-GEN-STEPS.ABORT_CONFIRM';
    fingerprintInfo = '1313213213';
    carddata: any = {};
    constructor(private router: Router,
                private service: MsksService,
                private fingers: FingerprintService,
                private translate: TranslateService) {}
    public ngOnInit() {
        console.log('call ngOnInit');
        this.startFingerprintScan();
    }

    /**
     * nextPage.
     */
    nextRoute() {
        this.router.navigate(['/scn-gen/steps/step-002-02']);
        return;
    }

    timeExpire() {
        setTimeout(() => {
            this.router.navigate(['/scn-gen/gen002/LV1HKIC']);
        }, 500);
    }
    /**
     * backPage.
     */
    backRoute() {
        this.router.navigate(['/scn-gen/gen002/LV1HKIC']);
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

    startFingerprintScan() {
        console.log('call startFingerprintScan');
        this.startFingerprintScanner();
    }

    /**
     *  start scanner fingerprint
     */
    startFingerprintScanner() {
        debugger;
        console.log('call : startFingerprintScanner fun.')
        // this.service.sendRequest('RR_FPSCANNERREG', 'takephoto', {'icno': 'A123456'}).subscribe((resp) => {
        this.service.sendRequest('RR_fptool', 'scanfp', {'arn': '', 'fp_img_format': 'bmp'}).subscribe((resp) => {
            if (resp.fp_img_in_base64) {
                console.log('fingerprint operate success');
                this.fingerprintInfo = resp.fp_img_in_base64;
                console.log('fpdata:' +  resp.fp_img_in_base64)
                this.extractimgtmpl(resp.fp_img_in_base64);
                // this.verifytempl(this.fingerprintInfo);
               // this.nextRoute();
            }
        });
    }

    /**
     *  data type change to Morpho_CFV
     * @param fpdata
     */
    extractimgtmpl (fpdata) {
        this.service.sendRequest('RR_fptool', 'extractimgtmpl ',
            {'finger_num': 0, 'fp_tmpl_format': 'Morpho_CFV', 'fp_img_in_base64': fpdata}).subscribe((resp) => {
            if (resp) {
                debugger;
                console.log(resp);
                this.verifytempl(resp.fp_tmpl_in_base64);
            }
        });
    }

    /**
     * fingerprint compare fun
     * @param fpdata
     */
    verifytempl(fpdata) {
        console.log('call verifytempl');
        this.service.sendRequest('RR_fptool', 'verifytmpl',
            {'fp_tmpl_format': 'Morpho_CFV', 'fp_tmpl1_in_base64': fpdata, 'fp_tmpl2_in_base64': fpdata}).subscribe((resp) => {
            if (resp.match_score) {
                console.log(resp);
                if (resp.match_score > 5000) {
                    console.log('compare scuess,pass');
                    this.nextRoute();
                } else {
                    console.log('compare ');
                }
            }
        });
    }

}
