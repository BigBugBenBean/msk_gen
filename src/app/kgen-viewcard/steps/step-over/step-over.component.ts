import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MsksService} from '../../../shared/msks';
import {CHANNEL_ID_RR_CARDREADER, CHANNEL_ID_RR_ICCOLLECT} from '../../../shared/var-setting';
import {CommonService} from '../../../shared/services/common-service/common.service';
import {ConfirmComponent} from '../../../shared/sc2-confirm';
import {LocalStorageService} from '../../../shared/services/common-service/Local-storage.service';
import { Observable } from 'rxjs/Observable';
@Component({
    templateUrl: './step-over.component.html',
    styleUrls: ['./step-over.component.scss']
})
export class StepOverComponent implements OnInit {

    @ViewChild('modalPrompt')
    public modalPrompt: ConfirmComponent;

    messagePrompt = '';
    messageFail= '';
    messageCollect = 'SCN-GEN-STEPS.COLLECT-CARD-SURE';
    messageAbort= 'SCN-GEN-STEPS.ABORT_CONFIRM';
    messageTimeout = 'SCN-GEN-STEPS.MESSAGE-TIMEOUT';
    PAGE_COLLECT_ABORT_QUIT_ITEMOUT = 2000;
    PAGE_COLLECT__RETURN_CARD_ITEMOUT = 2000;
    PAGE_COLLECT_TIME_EXPIRE_ITEMOUT = 5000;
    APP_LANG = '';
    DEVICE_LIGHT_CODE_OCR_READER = '08';
    DEVICE_LIGHT_CODE_IC_READER = '07';
    DEVICE_LIGHT_CODE_PRINTER = '06';
    DEVICE_LIGHT_CODE_FINGERPRINT = '06';
    DEVICE_LIGHT_ALERT_BAR_BLUE_CODE = '11';
    DEVICE_LIGHT_ALERT_BAR_GREEN_CODE = '12';
    DEVICE_LIGHT_ALERT_BAR_RED_CODE = '13';
    LOCATION_DEVICE_ID = 'K1-SCK-01';
    hkic_number_view = '';

    ACTION_TYPE_IC_OPENGATE = 'GA01';
    ACTION_TYPE_IC_OPENCARD = 'GA02';
    ACTION_TYPE_IC_READING_INFO = 'GA04';
    ACTION_TYPE_IC_CLOSECARD = 'GA12';
    ACTION_TYPE_IC_RETURN_CARD = 'GA11';
    ACTION_TYPE_OCR_INSERT = 'GA06';
    ACTION_TYPE_OCR_OPENCARD = 'GA07';
    ACTION_TYPE_OCR_READING_INFO = 'GA08';
    ACTION_TYPE_OCR_CLOSECARD = 'GA13';
    ACTION_TYPE_FINGER_NUMBER = 'GA0A';
    ACTION_TYPE_FINGER_SCAN = 'GA09';
    ACTION_TYPE_VERIFICATION = 'GA0A';
    ACTION_TYPE_QUERY_COS_LOS = 'GA0B';
    ACTION_TYPE_UPDATE_COS_LOS = 'GA0C';
    ACTION_TYPE_OCR_COLLECT_CARD = 'GA0D';
    ACTION_TYPE_IC_INSERT = 'GA0E';

    IGNORE_NOT_COLLECT = 'false';

    cardType = 1;
    readType = 1;
    isRestore = false;
    timeOutPause = false;
    step = '4';
    constructor(private router: Router,
                private commonService: CommonService,
                private route: ActivatedRoute,
                private service: MsksService,
                private localStorages: LocalStorageService,
                private translate: TranslateService) {
    }

    ngOnInit(): void {
        this.initConfigParam();
        this.initLanguage();
        this.startBusiness();
    }

    initConfigParam() {
        this.APP_LANG = this.localStorages.get('APP_LANG');
        this.LOCATION_DEVICE_ID = this.localStorages.get('LOCATION_DEVICE_ID');
        this.DEVICE_LIGHT_CODE_OCR_READER = this.localStorages.get('DEVICE_LIGHT_CODE_OCR_READER');
        this.DEVICE_LIGHT_CODE_IC_READER = this.localStorages.get('DEVICE_LIGHT_CODE_IC_READER');
        this.DEVICE_LIGHT_CODE_PRINTER = this.localStorages.get('DEVICE_LIGHT_CODE_PRINTER');
        this.DEVICE_LIGHT_CODE_FINGERPRINT = this.localStorages.get('DEVICE_LIGHT_CODE_FINGERPRINT');
        this.DEVICE_LIGHT_ALERT_BAR_BLUE_CODE = this.localStorages.get('DEVICE_LIGHT_ALERT_BAR_BLUE_CODE');
        this.DEVICE_LIGHT_ALERT_BAR_GREEN_CODE = this.localStorages.get('DEVICE_LIGHT_ALERT_BAR_GREEN_CODE');
        this.DEVICE_LIGHT_ALERT_BAR_RED_CODE = this.localStorages.get('DEVICE_LIGHT_ALERT_BAR_RED_CODE');

        this.ACTION_TYPE_IC_CLOSECARD = this.localStorages.get('ACTION_TYPE_IC_CLOSECARD');
        this.ACTION_TYPE_IC_RETURN_CARD = this.localStorages.get('ACTION_TYPE_IC_RETURN_CARD');
        this.ACTION_TYPE_OCR_CLOSECARD = this.localStorages.get('ACTION_TYPE_OCR_CLOSECARD');
        this.ACTION_TYPE_OCR_COLLECT_CARD = this.localStorages.get('ACTION_TYPE_OCR_COLLECT_CARD');

        this.PAGE_COLLECT_ABORT_QUIT_ITEMOUT = Number.parseInt(this.localStorages.get('PAGE_COLLECT_ABORT_QUIT_ITEMOUT'));
        this.PAGE_COLLECT__RETURN_CARD_ITEMOUT = Number.parseInt(this.localStorages.get('PAGE_COLLECT__RETURN_CARD_ITEMOUT'));
        this.PAGE_COLLECT_TIME_EXPIRE_ITEMOUT = Number.parseInt(this.localStorages.get('PAGE_COLLECT_TIME_EXPIRE_ITEMOUT'));

        this.cardType = Number.parseInt(this.localStorages.get('cardType'));
        this.readType = Number.parseInt(this.localStorages.get('readType'));
        this.hkic_number_view = this.localStorages.get('hkic_number_view');

        this.IGNORE_NOT_COLLECT = this.localStorages.get('IGNORE_NOT_COLLECT');
    }

    offAll() {
        return Observable.merge(
            this.commonService.doOff(this.DEVICE_LIGHT_CODE_OCR_READER),
            this.commonService.doOff(this.DEVICE_LIGHT_CODE_IC_READER),
            // this.commonService.doOff(this.DEVICE_LIGHT_ALERT_BAR_BLUE_CODE),
            // this.commonService.doOff(this.DEVICE_LIGHT_ALERT_BAR_GREEN_CODE),
            this.commonService.doOff(this.DEVICE_LIGHT_ALERT_BAR_RED_CODE)
        );
    }

    initLanguage() {
        if ('en-US' === this.APP_LANG) {
            this.translate.use('en-US');
        } else {
            this.translate.use('zh-HK');
        }
        this.translate.currentLang = this.APP_LANG;
    }

    startBusiness() {
        this.route.queryParams.subscribe((params) => {
            const step = params.step;
            if (step !== null && step !== '') {
                this.step = step;
            }

            const errMessage = params.err;
            if (errMessage !== null && errMessage !== '' && errMessage !== undefined) {
                this.processPromt(errMessage);
            }
        });

        this.commonService.doOff(this.DEVICE_LIGHT_CODE_IC_READER).mergeMap(val =>
            this.commonService.doOff(this.DEVICE_LIGHT_CODE_OCR_READER)).subscribe(data => console.log(data));

        const all = this.commonService.doFlash(this.readType === 1 ? this.DEVICE_LIGHT_CODE_IC_READER : this.DEVICE_LIGHT_CODE_OCR_READER).mergeMap(data => {
            return this.service.sendRequest(CHANNEL_ID_RR_CARDREADER, 'closecard').mergeMap(data1 => {
                if (this.readType === 1) {
                    return this.service.sendRequestWithLog(CHANNEL_ID_RR_ICCOLLECT, 'returndoc').mergeMap(data2 => {
                        if (data2.errorcode === 'D0007') { // 未取卡
                            this.processPromtNotExist('SCN-GEN-STEPS.NOT-COLLECT-CARD');
                            this.commonService.doFlashLight(this.DEVICE_LIGHT_ALERT_BAR_RED_CODE);
                            throw new Error('NOT_COLLECT');
                        }else {
                            // return this.offAll();
                            return [data2];
                        }
                    });
                } else {
                    return Observable.timer(2000).mergeMap(val => this.service.sendRequestWithLog(CHANNEL_ID_RR_CARDREADER, 'listcardreaderswithhkic').map(data2 => {
                        if (data2.error_info.error_code === '7') { // no card
                            return data;
                        } else {
                            throw new Error('NOT_COLLECT');
                        }
                    }).retryWhen(e => e.scan((errorCount, err) => {
                        // this.service.sendTrackLog(`NOT Collect error:${err.message}`);
                        if (this.modalPrompt.visible === false && errorCount >= 3) {
                            this.processPromtNotExist('SCN-GEN-STEPS.NOT-COLLECT-CARD');
                            this.commonService.doFlashLight(this.DEVICE_LIGHT_ALERT_BAR_RED_CODE);
                            // throw err;
                        }
                        return errorCount + 1;
                    },	0).delay(2000)));

                }
            });
        });
        all.subscribe(data3 => {
            this.offAll().subscribe(data4 => {
                this.router.navigate(['/scn-gen/kioskHome']);
                // this.commonService.doCloseWindow();
            });
        }, error => {
            this.commonService.loggerExcp(this.ACTION_TYPE_IC_RETURN_CARD, this.LOCATION_DEVICE_ID, 'GEFF', '', '', `not collect:${this.readType}`);
            this.commonService.doAlarm('GEFF');
            if (this.IGNORE_NOT_COLLECT === 'true') {
                this.backToNormal();
            }
        });

    }

    backToNormal() {
        setTimeout(() => {
            this.modalPrompt.hide();
            this.offAll().subscribe();
            // this.commonService.doCloseWindow();
            this.router.navigate(['/scn-gen/kioskHome']);
        }, 5000);
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

    processPromtNotExist(message_key) {
        this.messagePrompt = message_key;
        this.modalPrompt.show();
        setTimeout(() => {
            this.modalPrompt.hide();
            this.backToNormal();
        }, 10000);
    }

    processPromt(message_key) {
        this.messagePrompt = message_key;
        this.modalPrompt.show();
        setTimeout(() => {
            this.modalPrompt.hide();
        }, 6000);
    }
}
