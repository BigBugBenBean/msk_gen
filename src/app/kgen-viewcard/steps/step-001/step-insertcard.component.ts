import {Component,  OnInit, ViewChild, OnDestroy} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsksService } from '../../../shared/msks';
import {CHANNEL_ID_RR_CARDREADER, CHANNEL_ID_RR_ICCOLLECT, INI_URL, CHANNEL_ID_RR_NOTICELIGHT} from '../../../shared/var-setting';
import { ConfirmComponent } from '../../../shared/sc2-confirm';
import { LocalStorageService } from '../../../shared/services/common-service/Local-storage.service';
import {CommonService} from '../../../shared/services/common-service/common.service';
import {ProcessingComponent} from '../../../shared/processing-component';
import {IndicateCardTypeComponent} from '../../../shared/indicate-cardtype';
import {TimerComponent} from '../../../shared/sc2-timer';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { map } from 'rxjs/operator/map';
import {log} from 'util';

@Component({
    templateUrl: './step-insertcard.component.html',
    styleUrls: ['./step-insertcard.component.scss']
})
export class StepInsertcardComponent implements OnInit, OnDestroy {

    @ViewChild('modalRetry')
    public modalRetry: ConfirmComponent;

    @ViewChild('modalFail')
    public modalFail: ConfirmComponent;

    @ViewChild('modalQuit')
    public modalQuit: ConfirmComponent;

    @ViewChild('modalTimeout')
    public modalTimeout: ConfirmComponent;

    @ViewChild('modalCollect')
    public modalCollect: ConfirmComponent;

    @ViewChild('modal1Comfirm')
    public modal1Comfirm: ConfirmComponent;

    @ViewChild('modalRetryOpenGate')
    public modalRetryOpenGate: ConfirmComponent;

    @ViewChild('modalRetryOpenCard')
    public modalRetryOpenCard: ConfirmComponent;

    @ViewChild('modalRetryOCR')
    public modalRetryOCR: ConfirmComponent;

    @ViewChild('processing')
    public processing: ProcessingComponent;

    @ViewChild('preparing')
    public preparing: ProcessingComponent;

    @ViewChild('timer')
    public timer: TimerComponent;

    @ViewChild('modalPrompt')
    public modalPrompt: ConfirmComponent;

    @ViewChild('indicateCardType')
    public indicateCardType: IndicateCardTypeComponent;

    messageRetry = 'SCN-GEN-STEPS.RE-SCANER-FINGER';
    messageTimeout = 'SCN-GEN-STEPS.MESSAGE-TIMEOUT';
    messageFail = 'SCN-GEN-STEPS.RE-SCANER-MAX';
    messageAbort = 'SCN-GEN-STEPS.ABORT_CONFIRM';
    messageCollect = 'SCN-GEN-STEPS.COLLECT-CARD-SURE';

    messageComfirm = 'SCN-GEN-STEPS.INSERT_CARD_SCREEN_S6';

    messagePrompt = '';

    processMessage = 'SCN-GEN-STEPS.PROCESSING';
    preparingMessage = 'SCN-GEN-STEPS.PREPARING';
    manualOCR = false;
    cardType = 1;
    readType = 1;
    newReader_dor = null;
    newReader_icno = null;
    flag = false;
    isAbort = false;
    timeOutPause = false;
    isRestore = false;
    retryReaderVal = 0;
    retryReader1Val = 0;
    retryReader2Val = 0;
    // showImage = false;
    // isShow = false;
    // isShowCollect = false;
    isProcessing = false;
    isExit = true;
    APP_LANG = 'zh-HK';
    DEFAULT_LANG = '';
    IS_DEFAULT_LANG = 0;
    controlStatus = 0;
    deviceType = 1;
    subscription = null;
    thereiscard = false;

    PAGE_READ_OPENGATE_TIMEOUT_PAYLOAD = 10;
    PAGE_READ_CLOSE_CARD_ITMEOUT_OCR = 2000;
    PAGE_READ_CLOSE_CARD_TIMEOUT_IC = 2000;
    PAGE_READ_RETRY_READER_1_MAX = 3;
    PAGE_READ_RETRY_READER_2_MAX = 3;
    PAGE_READ_RETURN_CARD_TIMEOUT_PAYLOAD_BY_RETRY = 5;
    PAGE_READ_RETURN_CARD_TIMEOUT_PAYLOAD_BY_OCR = 5;
    PAGE_READ_ABORT_QUIT_ITEMOUT = 8000;
    PAGE_READ_RETURN_CARD_ITEMOUT = 8000;
    PAGE_READ_TIME_EXPIRE_ITEMOUT = 8000;
    DEVICE_LIGHT_CODE_OCR_READER = '03';
    DEVICE_LIGHT_CODE_IC_READER = '02';
    DEVICE_LIGHT_CODE_PRINTER = '06';
    DEVICE_LIGHT_CODE_FINGERPRINT = '06';
    DEVICE_LIGHT_ALERT_BAR_BLUE_CODE = '11';
    DEVICE_LIGHT_ALERT_BAR_GREEN_CODE = '12';
    DEVICE_LIGHT_ALERT_BAR_RED_CODE = '13';
    LOCATION_DEVICE_ID = 'K1-SCK-01';

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

    constructor(private router: Router,
                private commonService: CommonService,
                private route: ActivatedRoute,
                private service: MsksService,
                private httpClient: HttpClient,
                private localStorages: LocalStorageService,
                private translate: TranslateService) { }

    ngOnInit(): void {
        this.initLanguage();
        this.preparing.show();
        // this.startBusiness();
         this.initGetParam();
        // this.controlStatus = 7;
        // this.indicateCardType.show();
    }

    ngOnDestroy(): void {
        if (this.subscription != null) {
            this.subscription.unsubscribe();
        }
    }

    initGetParam() {
        // this.quitDisabledAll();
        // this.isShowCollect = true;
        this.httpClient.get(INI_URL).subscribe(data => {
            // save to local storate param.
            this.saveLocalStorages(data);
            // init param.
            this.initConfigParam();
            this.cancelQuitEnabledAll();
            this.startBusiness();
        }, (err) => {
            this.preparing.hide();
            this.messageFail = 'SCN-GEN-STEPS.INIT_CONFIG_PARAM_ERROR';
            this.processing.hide();
            // this.isShow = false;
            if (this.isAbort || this.timeOutPause) {
                return;
            }
            this.processModalFailShow();
        });
    }
    saveLocalStorages(data) {
        this.localStorages.set('LOCATION_IP', data['LOCATION_IP']);
        this.localStorages.set('LOCATION_PORT', data['LOCATION_PORT']);
        this.localStorages.set('UPDATE_LOS_COS_WEBSERVICE_IP', data['UPDATE_LOS_COS_WEBSERVICE_IP']);
        this.localStorages.set('UPDATE_LOL_COS_WEBSERVICE_PORT', data['UPDATE_LOL_COS_WEBSERVICE_PORT']);
        this.localStorages.set('TERMINAL_ID', data['TERMINAL_ID']);
        this.localStorages.set('LOCATION_DEVICE_ID', data['LOCATION_DEVICE_ID']);
        this.localStorages.set('DEVICE_OCR_READER_NAME', data['DEVICE_OCR_READER_NAME']);
        this.localStorages.set('DEVICE_OCR_READER_CODE', data['DEVICE_OCR_READER_CODE']);
        this.localStorages.set('DEVICE_EXISTING_IC_READER_NAME', data['DEVICE_EXISTING_IC_READER_NAME']);
        this.localStorages.set('DEVICE_EXISTING_IC_READER_CODE', data['DEVICE_EXISTING_IC_READER_CODE']);
        this.localStorages.set('DEVICE_SLIP_PRINTER_NAME', data['DEVICE_SLIP_PRINTER_NAME']);
        this.localStorages.set('DEVICE_SLIP_PRINTER_CODE', data['DEVICE_SLIP_PRINTER_CODE']);
        this.localStorages.set('DEVICE_FINGERPRINT_SCANNER_NAME', data['DEVICE_FINGERPRINT_SCANNER_NAME']);
        this.localStorages.set('DEVICE_FINGERPRINT_SCANNER_CODE', data['DEVICE_FINGERPRINT_SCANNER_CODE']);
        this.localStorages.set('DEVICE_LIGHT_CODE_OCR_READER', data['DEVICE_LIGHT_CODE_OCR_READER']);
        this.localStorages.set('DEVICE_LIGHT_CODE_IC_READER', data['DEVICE_LIGHT_CODE_IC_READER']);
        this.localStorages.set('DEVICE_LIGHT_CODE_PRINTER', data['DEVICE_LIGHT_CODE_PRINTER']);
        this.localStorages.set('DEVICE_LIGHT_CODE_FINGERPRINT', data['DEVICE_LIGHT_CODE_FINGERPRINT']);
        this.localStorages.set('DEVICE_LIGHT_ALERT_BAR_BLUE_CODE', data['DEVICE_LIGHT_ALERT_BAR_BLUE_CODE']);
        this.localStorages.set('DEVICE_LIGHT_ALERT_BAR_GREEN_CODE', data['DEVICE_LIGHT_ALERT_BAR_GREEN_CODE']);
        this.localStorages.set('DEVICE_LIGHT_ALERT_BAR_RED_CODE', data['DEVICE_LIGHT_ALERT_BAR_RED_CODE']);

        this.localStorages.set('FP_TMPL_FORMAT_CARD_TYPE_1', data['FP_TMPL_FORMAT_CARD_TYPE_1']);
        this.localStorages.set('FP_TMPL_FORMAT_CARD_TYPE_2', data['FP_TMPL_FORMAT_CARD_TYPE_2']);
        this.localStorages.set('FP_MATCH_SCORE_CARD_TYPE_1', data['FP_MATCH_SCORE_CARD_TYPE_1']);
        this.localStorages.set('FP_MATCH_SCORE_CARD_TYPE_2', data['FP_MATCH_SCORE_CARD_TYPE_2']);

        this.localStorages.set('ACTION_TYPE_IC_OPENGATE', data['ACTION_TYPE_IC_OPENGATE']);
        this.localStorages.set('ACTION_TYPE_IC_INSERT', data['ACTION_TYPE_IC_INSERT']);
        this.localStorages.set('ACTION_TYPE_IC_OPENCARD', data['ACTION_TYPE_IC_OPENCARD']);
        this.localStorages.set('ACTION_TYPE_IC_READING_INFO', data['ACTION_TYPE_IC_READING_INFO']);
        this.localStorages.set('ACTION_TYPE_IC_CLOSECARD', data['ACTION_TYPE_IC_CLOSECARD']);
        this.localStorages.set('ACTION_TYPE_IC_RETURN_CARD', data['ACTION_TYPE_IC_RETURN_CARD']);
        this.localStorages.set('ACTION_TYPE_OCR_INSERT', data['ACTION_TYPE_OCR_INSERT']);
        this.localStorages.set('ACTION_TYPE_OCR_OPENCARD', data['ACTION_TYPE_OCR_OPENCARD']);
        this.localStorages.set('ACTION_TYPE_OCR_READING_INFO', data['ACTION_TYPE_OCR_READING_INFO']);
        this.localStorages.set('ACTION_TYPE_OCR_CLOSECARD', data['ACTION_TYPE_OCR_CLOSECARD']);
        this.localStorages.set('ACTION_TYPE_OCR_COLLECT_CARD', data['ACTION_TYPE_OCR_COLLECT_CARD']);
        this.localStorages.set('ACTION_TYPE_FINGER_NUMBER', data['ACTION_TYPE_FINGER_NUMBER']);
        this.localStorages.set('ACTION_TYPE_FINGER_SCAN', data['ACTION_TYPE_FINGER_SCAN']);
        this.localStorages.set('ACTION_TYPE_VERIFICATION', data['ACTION_TYPE_VERIFICATION']);
        this.localStorages.set('ACTION_TYPE_QUERY_COS_LOS', data['ACTION_TYPE_QUERY_COS_LOS']);
        this.localStorages.set('ACTION_TYPE_UPDATE_COS_LOS', data['ACTION_TYPE_UPDATE_COS_LOS']);

        this.localStorages.set('IS_DEFAULT_LANG', data['IS_DEFAULT_LANG']);
        this.localStorages.set('DEFAULT_LANG', data['APP_LANG']);

        this.localStorages.set('PAGE_PRIVACY_QUIT_ITEMOUT', data['PAGE_PRIVACY_QUIT_ITEMOUT']);
        this.localStorages.set('PAGE_READ_OPENGATE_TIMEOUT_PAYLOAD', data['PAGE_READ_OPENGATE_TIMEOUT_PAYLOAD']);
        this.localStorages.set('PAGE_READ_CLOSE_CARD_ITMEOUT_OCR', data['PAGE_READ_CLOSE_CARD_ITMEOUT_OCR']);
        this.localStorages.set('PAGE_READ_CLOSE_CARD_TIMEOUT_IC', data['PAGE_READ_CLOSE_CARD_TIMEOUT_IC']);
        this.localStorages.set('PAGE_READ_RETRY_READER_1_MAX', data['PAGE_READ_RETRY_READER_1_MAX']);
        this.localStorages.set('PAGE_READ_RETRY_READER_2_MAX', data['PAGE_READ_RETRY_READER_2_MAX']);
        this.localStorages.set('PAGE_READ_RETURN_CARD_TIMEOUT_PAYLOAD_BY_RETRY', data['PAGE_READ_RETURN_CARD_TIMEOUT_PAYLOAD_BY_RETRY']);
        this.localStorages.set('PAGE_READ_RETURN_CARD_TIMEOUT_PAYLOAD_BY_OCR', data['PAGE_READ_RETURN_CARD_TIMEOUT_PAYLOAD_BY_OCR']);
        this.localStorages.set('PAGE_READ_TIME_EXPIRE_ITEMOUT', data['PAGE_READ_TIME_EXPIRE_ITEMOUT']);
        this.localStorages.set('PAGE_READ_ABORT_QUIT_ITEMOUT', data['PAGE_READ_ABORT_QUIT_ITEMOUT']);
        this.localStorages.set('PAGE_READ_RETURN_CARD_ITEMOUT', data['PAGE_READ_RETURN_CARD_ITEMOUT']);

        this.localStorages.set('PAGE_PROCESSING_ABORT_QUIT_ITEMOUT', data['PAGE_PROCESSING_ABORT_QUIT_ITEMOUT']);
        this.localStorages.set('PAGE_PROCESSING_RETURN_CARD_ITEMOUT', data['PAGE_PROCESSING_RETURN_CARD_ITEMOUT']);
        this.localStorages.set('PAGE_PROCESSING_TIME_EXPIRE_ITEMOUT', data['PAGE_PROCESSING_TIME_EXPIRE_ITEMOUT']);

        this.localStorages.set('PAGE_FINGERPRINT_ABORT_QUIT_ITEMOUT', data['PAGE_FINGERPRINT_ABORT_QUIT_ITEMOUT']);
        this.localStorages.set('PAGE_FINGERPRINT_RETURN_CARD_ITEMOUT', data['PAGE_FINGERPRINT_RETURN_CARD_ITEMOUT']);
        this.localStorages.set('PAGE_FINGERPRINT_TIME_EXPIRE_ITEMOUT', data['PAGE_FINGERPRINT_TIME_EXPIRE_ITEMOUT']);
        this.localStorages.set('PAGE_FINGERPRINT_SCAN_ITEMOUT_PAYLOAD', data['PAGE_FINGERPRINT_SCAN_ITEMOUT_PAYLOAD']);
        this.localStorages.set('PAGE_FINGERPRINT_MATCH_SCORE', data['PAGE_FINGERPRINT_MATCH_SCORE']);
        this.localStorages.set('PAGE_FINGERPRINT_SCAN_MAX', data['PAGE_FINGERPRINT_SCAN_MAX']);
        this.localStorages.set('PAGE_FINGERPRINT_IS_VALIDATION', data['PAGE_FINGERPRINT_IS_VALIDATION']);
        this.localStorages.set('PAGE_FINGERPRINT_FP_TMPL_FORMAT', data['PAGE_FINGERPRINT_FP_TMPL_FORMAT']);

        this.localStorages.set('PAGE_UPDATE_ABORT_QUIT_ITEMOUT', data['PAGE_UPDATE_ABORT_QUIT_ITEMOUT']);
        this.localStorages.set('PAGE_UPDATE_RETURN_CARD_ITEMOUT', data['PAGE_UPDATE_RETURN_CARD_ITEMOUT']);
        this.localStorages.set('PAGE_UPDATE_TIME_EXPIRE_ITEMOUT', data['PAGE_UPDATE_TIME_EXPIRE_ITEMOUT']);
        this.localStorages.set('PAGE_UPDATE_WEBSERVICE_ITEMOUT', data['PAGE_UPDATE_WEBSERVICE_ITEMOUT']);

        this.localStorages.set('PAGE_VIEW_ABORT_QUIT_ITEMOUT', data['PAGE_VIEW_ABORT_QUIT_ITEMOUT']);
        this.localStorages.set('PAGE_VIEW_RETURN_CARD_ITEMOUT', data['PAGE_VIEW_RETURN_CARD_ITEMOUT']);
        this.localStorages.set('PAGE_VIEW_TIME_EXPIRE_ITEMOUT', data['PAGE_VIEW_TIME_EXPIRE_ITEMOUT']);

        this.localStorages.set('PAGE_COLLECT_ABORT_QUIT_ITEMOUT', data['PAGE_COLLECT_ABORT_QUIT_ITEMOUT']);
        this.localStorages.set('PAGE_COLLECT_RETURN_CARD_ITEMOUT', data['PAGE_COLLECT_RETURN_CARD_ITEMOUT']);
        this.localStorages.set('PAGE_COLLECT_TIME_EXPIRE_ITEMOUT', data['PAGE_COLLECT_TIME_EXPIRE_ITEMOUT']);
        this.localStorages.set('IGNORE_NOT_COLLECT', data['IGNORE_NOT_COLLECT']);
    }

    initConfigParam() {
        this.APP_LANG = this.localStorages.get('APP_LANG');
        this.DEFAULT_LANG = this.localStorages.get('DEFAULT_LANG');
        this.IS_DEFAULT_LANG = Number.parseInt(this.localStorages.get('IS_DEFAULT_LANG'));

        this.LOCATION_DEVICE_ID = this.localStorages.get('LOCATION_DEVICE_ID');
        this.DEVICE_LIGHT_CODE_OCR_READER = this.localStorages.get('DEVICE_LIGHT_CODE_OCR_READER');
        this.DEVICE_LIGHT_CODE_IC_READER = this.localStorages.get('DEVICE_LIGHT_CODE_IC_READER');
        this.DEVICE_LIGHT_CODE_PRINTER = this.localStorages.get('DEVICE_LIGHT_CODE_PRINTER');
        this.DEVICE_LIGHT_ALERT_BAR_BLUE_CODE = this.localStorages.get('DEVICE_LIGHT_ALERT_BAR_BLUE_CODE');
        this.DEVICE_LIGHT_ALERT_BAR_GREEN_CODE = this.localStorages.get('DEVICE_LIGHT_ALERT_BAR_GREEN_CODE');
        this.DEVICE_LIGHT_ALERT_BAR_RED_CODE = this.localStorages.get('DEVICE_LIGHT_ALERT_BAR_RED_CODE');

        this.ACTION_TYPE_IC_OPENGATE = this.localStorages.get('ACTION_TYPE_IC_OPENGATE');
        this.ACTION_TYPE_IC_INSERT = this.localStorages.get('ACTION_TYPE_IC_INSERT');
        this.ACTION_TYPE_IC_OPENCARD = this.localStorages.get('ACTION_TYPE_IC_OPENCARD');
        this.ACTION_TYPE_IC_READING_INFO = this.localStorages.get('ACTION_TYPE_IC_READING_INFO');
        this.ACTION_TYPE_IC_CLOSECARD = this.localStorages.get('ACTION_TYPE_IC_CLOSECARD');
        this.ACTION_TYPE_IC_RETURN_CARD = this.localStorages.get('ACTION_TYPE_IC_RETURN_CARD');
        this.ACTION_TYPE_OCR_INSERT = this.localStorages.get('ACTION_TYPE_OCR_INSERT');
        this.ACTION_TYPE_OCR_OPENCARD = this.localStorages.get('ACTION_TYPE_OCR_OPENCARD');
        this.ACTION_TYPE_OCR_READING_INFO = this.localStorages.get('ACTION_TYPE_OCR_READING_INFO');
        this.ACTION_TYPE_OCR_CLOSECARD = this.localStorages.get('ACTION_TYPE_OCR_CLOSECARD');
        this.ACTION_TYPE_OCR_COLLECT_CARD = this.localStorages.get('ACTION_TYPE_OCR_COLLECT_CARD');

        this.PAGE_READ_OPENGATE_TIMEOUT_PAYLOAD = Number.parseInt(this.localStorages.get('PAGE_READ_OPENGATE_TIMEOUT_PAYLOAD'));
        this.PAGE_READ_CLOSE_CARD_ITMEOUT_OCR = Number.parseInt(this.localStorages.get('PAGE_READ_CLOSE_CARD_ITMEOUT_OCR'));
        this.PAGE_READ_CLOSE_CARD_TIMEOUT_IC = Number.parseInt(this.localStorages.get('PAGE_READ_CLOSE_CARD_TIMEOUT_IC'));
        this.PAGE_READ_RETRY_READER_1_MAX = Number.parseInt(this.localStorages.get('PAGE_READ_RETRY_READER_1_MAX'));
        this.PAGE_READ_RETRY_READER_2_MAX = Number.parseInt(this.localStorages.get('PAGE_READ_RETRY_READER_2_MAX'));

        this.PAGE_READ_RETURN_CARD_TIMEOUT_PAYLOAD_BY_RETRY = Number.parseInt(
            this.localStorages.get('PAGE_READ_RETURN_CARD_TIMEOUT_PAYLOAD_BY_RETRY'));
        this.PAGE_READ_RETURN_CARD_TIMEOUT_PAYLOAD_BY_OCR = Number.parseInt(
            this.localStorages.get('PAGE_READ_RETURN_CARD_TIMEOUT_PAYLOAD_BY_OCR'));
        this.PAGE_READ_ABORT_QUIT_ITEMOUT = Number.parseInt(this.localStorages.get('PAGE_READ_ABORT_QUIT_ITEMOUT'));
        this.PAGE_READ_RETURN_CARD_ITEMOUT = Number.parseInt(this.localStorages.get('PAGE_READ_RETURN_CARD_ITEMOUT'));
        this.PAGE_READ_TIME_EXPIRE_ITEMOUT = Number.parseInt(this.localStorages.get('PAGE_READ_TIME_EXPIRE_ITEMOUT'));
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
        // this.initConfigParam();
        // this.cancelQuitEnabledAll();
        // this.commonService.doCloseCard();
        // this.commonService.doReturnDoc();
        // this.openGateFun();
        // *****************a later call openGate function *************************************************
        // setTimeout(() => {
        //     console.log('*******start call openGate function *********');
        //     this.openGateFun();
        // }, 1000);
        this.commonService.doOff(this.DEVICE_LIGHT_CODE_IC_READER).merge(
           this.commonService.doOff(this.DEVICE_LIGHT_CODE_OCR_READER),
           this.commonService.doOff(this.DEVICE_LIGHT_ALERT_BAR_RED_CODE)
           ).subscribe(data => console.log(data));

        this.startDetectCardListener('20');
    }

    /**
     * nextPage.
     */
    nextRoute() {
        if (this.timeOutPause || this.isAbort) {
            return;
        }
        this.storeConfigParam();
        this.router.navigate(['/scn-gen/processing']);
        return;
    }

    nextRouteUnsub(unsub) {
        unsub.unsubscribe();
        if (this.timeOutPause || this.isAbort) {
            return;
        }
        this.storeConfigParam();
        this.router.navigate(['/scn-gen/processing']);
        return;
    }

    storeConfigParam() {
        this.localStorages.set('APP_LANG', this.translate.currentLang);
        this.localStorages.set('cardType', this.cardType.toString());
        this.localStorages.set('readType', this.readType.toString());
    }

    /**
     * backPage.
     */
    backRoute() {
        if (this.processing.visible) {
            this.processing.hide();
            // this.showImage = false;
        }
        if (this.modalRetryOCR.visible) {
            this.modalRetryOCR.hide();
        }
        if (this.modalRetryOpenGate.visible) {
            this.modalRetryOpenGate.hide();
        }
        if (this.modalRetryOpenCard.visible) {
            this.modalRetryOpenCard.hide();
        }
        if (this.modalFail.visible) {
            this.modalFail.hide();
        }
        if (this.modal1Comfirm.visible) {
            this.modal1Comfirm.hide();
        }
        if (this.modalQuit.visible) {
            this.modalQuit.hide();
        }
        this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_OCR_READER);
        this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_IC_READER);
        this.commonService.doLightOff(this.DEVICE_LIGHT_ALERT_BAR_BLUE_CODE);
        this.commonService.doLightOff(this.DEVICE_LIGHT_ALERT_BAR_GREEN_CODE);
        this.commonService.doLightOff(this.DEVICE_LIGHT_ALERT_BAR_RED_CODE);
        this.timer.ngOnDestroy();
        this.commonService.doCloseWindow();
    }

    langButton() {
        const browserLang = this.translate.currentLang;
        console.log(browserLang);
        if (browserLang === 'zh-HK') {
            this.translate.use('en-US');
        } else {
            this.translate.use('zh-HK');
        }
        // this.printBill();
    }

    processAbortQuit() {
        this.isAbort = true;
        this.quitDisabledAll();
        this.modal1Comfirm.hide();
        if (this.processing.visible) {
            // this.showImage = false;
            this.processing.hide();
        }
        this.doCloseCard();
    }

    confirmYesOCR() {

    }

    confirmNotOCR() {
        this.modal1Comfirm.hide();
        this.commonService.doFlashLight(this.DEVICE_LIGHT_CODE_IC_READER);
    }

    timeExpire() {
        this.timer.showTimer = false;
        this.timeOutPause = true;
        // if (this.processing.visible) {
        //     this.showImage = false;
        //     this.processing.hide();
        // }
        // if (this.modalRetryOCR.visible) {
        //     this.modalRetryOCR.hide();
        // }
        // if (this.modalRetryOpenGate.visible) {
        //     this.modalRetryOpenGate.hide();
        // }
        // if (this.modalRetryOpenCard.visible) {
        //     this.modalRetryOpenCard.hide();
        // }
        // if (this.modalFail.visible) {
        //     this.modalFail.hide();
        // }
        // if (this.modal1Comfirm.visible) {
        //     this.modal1Comfirm.hide();
        // }
        // if (this.modalQuit.visible) {
        //     this.modalQuit.hide();
        // }
        // this.messageTimeout = 'SCN-GEN-STEPS.MESSAGE-TIMEOUT';
        // this.quitDisabledAll();
        // this.modalTimeout.show();
        // setTimeout(() => {
        //     this.controlStatus = 2;
        //     this.processTimeoutQuit();
        // }, 5000);

        this.exit('SCN-GEN-STEPS.MESSAGE-TIMEOUT');

    }

    processTimeoutQuit() {
        this.modalTimeout.hide();
        this.doCloseCard();
    }

    processModalFailShow() {
        this.commonService.doLightOn(this.DEVICE_LIGHT_ALERT_BAR_RED_CODE);
        this.commonService.doFlashLight(this.DEVICE_LIGHT_ALERT_BAR_RED_CODE);
        this.quitDisabledAll();
        this.isAbort = true;
        this.isExit = false;
        this.modalFail.show();
    }

    /**
     * process fail quit fun.
     */
    processFailQuit() {
        this.modalFail.hide();
        this.doCloseCard();
    }

    quitDisabledAll() {
        // $('#exitBtn').attr('disabled', 'false');
        // $('#langBtn').attr('disabled', 'false');

    }
    cancelQuitEnabledAll() {
        // $('#exitBtn').removeAttr('disabled');
        // $('#langBtn').removeAttr('disabled');
    }

    /**
     * show abort modal.
     */
    processModalQuitShow() {
        if (this.processing.visible) {
           return;
        }
        // this.isAbort = true;
        this.modalQuit.show();
        // this.quitDisabledAll();
        if (this.processing.visible) {
            // this.isRestore = true;
            // this.showImage = false;
            this.processing.hide();
        }
    }

    /**
     * click abort button.
     */
    processConfirmQuit() {
        if (this.thereiscard) {
            this.modalQuit.hide();
            if (this.processing.visible) {
                // this.showImage = false;
                this.processing.hide();
            }
            // this.doCloseCard();
            this.exit('');
        } else {
            this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_IC_READER);
            if (this.subscription != null) {
                this.subscription.unsubscribe();
            }
            this.timer.ngOnDestroy();
            this.commonService.doCloseWindow();
        }
    }

    /**
     * cancel abort operation
     */
    processCancelQuit() {
        this.modalQuit.hide();
        this.isAbort = false;
        if (this.isRestore) {
            this.processing.show();
            // this.showImage = true;
        } else {
            this.cancelQuitEnabledAll();
        }
    }

    modalCollectShow() {
        this.commonService.doFlashLight(this.DEVICE_LIGHT_CODE_OCR_READER);
        if (this.processing.visible) {
            this.isRestore = true;
            this.processing.hide();
            // this.showImage = false;
        }
        this.modalCollect.show();
    }
    processCollectQuit() {
        this.modalCollect.hide();
        if (this.isRestore) {
            this.processing.show();
            // this.showImage = true;
        }
        setTimeout(() => {
            this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_OCR_READER);
            this.backRoute();
        }, this.PAGE_READ_ABORT_QUIT_ITEMOUT);
    }

    /**
     * close card function.
     */
    doCloseCard() {
        // this.showImage = true;
        // this.isShowCollect = false;
        this.service.sendRequestWithLog(CHANNEL_ID_RR_CARDREADER, 'closecard').subscribe((resp) => {
            if (this.readType === 1) {
                this.doReturnDoc();
                setTimeout(() => {
                    this.backRoute();
                }, this.PAGE_READ_RETURN_CARD_ITEMOUT);
            } else {
                // this.modalCollectShow();
                this.commonService.doFlashLight(this.DEVICE_LIGHT_CODE_OCR_READER);
                setTimeout(() => {
                    this.backRoute();
                }, this.PAGE_READ_RETURN_CARD_ITEMOUT);
            }
        }, (error) => {
            console.log('closecard ERROR ' + error);
            setTimeout(() => {
                this.backRoute();
            }, this.PAGE_READ_ABORT_QUIT_ITEMOUT);
        });
    }

    /**
     * return card.
     */
    doReturnDoc() {
        this.commonService.doFlashLight(this.DEVICE_LIGHT_CODE_IC_READER);
        this.service.sendRequestWithLog(CHANNEL_ID_RR_ICCOLLECT, 'returndoc').subscribe((resp) => {
            this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_IC_READER);
        }, (error) => {
            console.log('opencard ERROR ' + error);
            this.commonService.loggerExcp(this.ACTION_TYPE_IC_RETURN_CARD, this.LOCATION_DEVICE_ID, 'GE0F', '', this.newReader_icno, 'call returndoc');
            this.messageFail = 'SCN-GEN-STEPS.READER-COLLECT-FAIL';
            if (this.timeOutPause || this.isAbort) {
                return;
            }
            this.processModalFailShow();
        });
    }

    processOCRReaderData(datas, resultObj) {
        let dor = null, icno = null;
        for (const i in datas) {
            if ('VizIssueDate' === datas[i].field_id) {
                const dor_temp = datas[i].field_value;
                const year = this.commonService.changeDor(dor_temp);
                dor = `${year}${dor_temp.substr(3, 2)}${dor_temp.substr(0, 2)}`;
            } else if ('VizDocumentNumber' === datas[i].field_id) {
                icno = datas[i].field_value;
            }
        }
        resultObj.ocr_data = { 'dor': dor, 'icno': icno };
        // resultObj.ocr_data.dor = dor;
        // resultObj.ocr_data.icno = icno;
    }

    checkOCRDataIsCurrent(datas) {
        let dor, icno = false;
        for (const i in datas) {
            if (!dor && 'VizIssueDate' === datas[i].field_id) {
                dor = true;
            } else if (!icno && 'VizDocumentNumber' === datas[i].field_id) {
                icno = true;
            }
        }
        return dor && icno;
    }

    processPromt(message_key) {
        this.messagePrompt = message_key;
        this.modalPrompt.show();
        setTimeout(() => {
            this.modalPrompt.hide();
        }, 6000);
    }

    processPromtExit(message_key) {
        this.messagePrompt = message_key;
        this.modalPrompt.show();
        setTimeout(() => {
            this.modalPrompt.hide();
            this.backRoute();
        }, 6000);
    }

    checkOCRSomething() {
        console.log('66666666666');
        let retryCount = 0;
        const payloadParam = { 'ocr_reader_name': 'ARH ComboSmart', 'light': 'Infra' };
        const ocr$ = this.service.sendRequestWithLog('RR_cardreader', 'readhkicv2ocrdata', payloadParam).mergeMap(resp => {
            console.log(`77777777777====${resp}`);
            // if ($.isEmptyObject(resp) || resp.error_info.error_code !== '0') {
            // if ('VizIssueDate' === datas[i].field_id) {
            if (resp.ocr_data != null) {
                const datas = resp.ocr_data;
                if (datas.length === 0) {
                    return [resp];
                } else if ('VizSecurityFibres' === resp.ocr_data[0].field_id && '0' === resp.ocr_data[0].field_value) {
                    this.modalPrompt.hide();
                    return [resp];
                }

                if (retryCount > 0) {
                    return this.service.sendRequestWithLog(CHANNEL_ID_RR_CARDREADER, 'listcardreaderswithhkic').map(val => {
                        if (val.error_info.error_code === '7' || val.card_infos == null || val.card_infos.length === 0) {
                            // return val;
                            throw new Error('HAS_CARD');
                        } else {
                            let isNewCard = false;
                            val.card_infos.forEach(element => {
                                if (element.card_version === 2 && element.is_contact === false) {
                                    isNewCard = true;
                                }
                            });
                            if (isNewCard) {
                                this.modalPrompt.hide();
                                return val;
                            }
                        }
                        throw new Error('HAS_CARD');
                    });
                } else {
                    throw new Error('HAS_CARD');
                }
            } else {
                // throw new Error('OCR_ERROR');
                return [resp];
            }
        }).retryWhen(s => {
            this.preparing.hide();
            this.messagePrompt = 'SCN-GEN-STEPS.HAS_CARD';
            this.modalPrompt.show();
            return s.map(e => {
                retryCount = retryCount + 1;
                return e;
            }).delay(700);
        });
        return ocr$;
    }

    startDetectCardListener(openGateTime) {
        this.service.sendTrackLog(`---------------------start------------------------------`);
        const hasocr$ = this.checkOCRSomething();
        // this.commonService.doFlashLight(this.DEVICE_LIGHT_CODE_IC_READER);
        const ATTEMPT_COUNT = 3;
        const DELAY = 700;
        const card_error = { ocrerrCount: 0, nocardCount: 0, readerrorCount: 0 };

        // aaa.zip(this.doOpenLight(whichLight, isLightOff), (x, y) => { isLightOff = false; return x; })
        const IC = this.service.sendRequestWithLog(CHANNEL_ID_RR_ICCOLLECT, 'opengate', { 'timeout': openGateTime }).mergeMap(resp => {
            this.thereiscard = true;

            if (!$.isEmptyObject(resp)) {
                this.service.sendTrackLog(`<开门的返回状态>>>>>>>${resp.errorcode}`);
            }
            this.deviceType = 1;
            this.readType = 1;
            const result = { type: 'ICCOLLECT', status: null };
            this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_OCR_READER);
            if ($.isEmptyObject(resp)) {
                result.status = 'CRASH';
            } else if (resp.errorcode === '0') {
                this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_IC_READER); // 识别到正确的卡后关灯
                // isLightOff = true;
                result.status = 'FIRSTSUCCESS';
                return [result];
            } else if (resp.errorcode === 'D0009') {
                // this.service.sendTrackLog(`<警告>>>>>>>>>WARN....There is a card in card reader.`);
                this.commonService.loggerExcp(this.ACTION_TYPE_IC_OPENGATE, this.LOCATION_DEVICE_ID, 'GE02', '', this.newReader_icno, 'opengate exception 009');
                return this.service.sendRequestWithLog(CHANNEL_ID_RR_ICCOLLECT, 'returndoc').map(() => {
                    // return { type: 'ICCOLLECT', status: 'EXIST' };
                    throw new Error('EXIST');
                });
                // result.status = 'EXIST';
            } else if (resp.errorcode === 'D0006') {
                result.status = 'TIMEOUT';
            } else {
                result.status = 'ERROR';
            }
            throw new Error(result.status);
        }).retryWhen(stream => stream.mergeMap((err) => { // crash timeout error
            if (err.message === 'TIMEOUT') {
                card_error.nocardCount = card_error.nocardCount + 1;
                this.commonService.loggerExcp(this.ACTION_TYPE_IC_OPENGATE, this.LOCATION_DEVICE_ID, 'GE08', '', '', 'open gate timeout');
                // this.service.sendTrackLog(`>>>>>超时了第${card_error.nocardCount}次. 是否超过次数: ${card_error.nocardCount >= ATTEMPT_COUNT} `);
                if (card_error.nocardCount >= ATTEMPT_COUNT) {
                    throw err;
                }else {
                    this.processPromt('SCN-GEN-STEPS.INSERT_CARD_SCREEN_S4'); // 请插入卡
                    return [err];
                }
            } else if (err.message === 'EXIST') {
                return [err];
            } else if (err.message === 'CRASH' || err.message === 'ERROR') { // 读卡失败次数检验
                this.commonService.loggerExcp(this.ACTION_TYPE_IC_OPENGATE, this.LOCATION_DEVICE_ID, 'GE01', '', this.newReader_icno, 'opengate exception error');
                card_error.readerrorCount = card_error.readerrorCount + 1;
                this.service.sendTrackLog(`>>>>IC卡出错了了第${card_error.readerrorCount}次`);
                if (card_error.readerrorCount === 1) { // 不能正确识别卡
                    this.processPromt('SCN-GEN-STEPS.OCR_READER_SCREEN_S16');
                } else if (card_error.readerrorCount <= ATTEMPT_COUNT - 1) {// 第二次要转到OCR,需要用户确认
                    // this.processPromt('SCN-GEN-STEPS.INSERT_CARD_SCREEN_S6');
                    if (this.modalPrompt.visible) {
                        this.modalPrompt.hide();
                    }
                    this.controlStatus = 3;
                    const oldc = document.getElementById('oldCard');
                    const newc = document.getElementById('newCard');
                    this.indicateCardType.show();

                    return Observable.of(err).zip(Observable.merge(
                        fromEvent(newc, 'click').mapTo('YES'),
                        fromEvent(oldc, 'click').mapTo('NO')
                    ).take(1).mergeMap((resp) => {
                        this.controlStatus = 1;
                        this.indicateCardType.hide();
                        if ('YES' === resp) {
                            this.manualOCR = true;
                            this.deviceType = 2;
                            this.readType = 2;
                            // return this.commonService.doFlash(this.DEVICE_LIGHT_CODE_OCR_READER);
                            return Observable.combineLatest(
                                this.commonService.doOff(this.DEVICE_LIGHT_CODE_IC_READER),
                                this.commonService.doFlash(this.DEVICE_LIGHT_CODE_OCR_READER),
                                (x, y) => {
                                    return x;
                                }
                            );
                        } else if ('NO' === resp) {
                        }
                        return [resp];
                    }), (x, y) => x);
                } else if (card_error.readerrorCount >= ATTEMPT_COUNT) { // IC超过次数限制
                    throw new Error('IC_OVER_COUNT');
                }
                return [err];
            }
        }).delay(DELAY));

        const DELAY_OCR = 3000;

        // bbb, 'light': 'Infra', 'field_ids': ['VizDocumentNumber', 'VizIssueDate']
        const payloadParam = { 'ocr_reader_name': 'ARH ComboSmart', 'light': 'Infra' };
        const OCR = this.service.sendRequestWithLog(CHANNEL_ID_RR_CARDREADER, 'readhkicv2ocrdata', payloadParam).map((resp) => {
            const result = { type: 'OCR', status: null, ocr_data: null };
            if ($.isEmptyObject(resp) || resp.error_info.error_code !== '0') {
                result.status = 'CRASH';
                this.deviceType = 2;
                this.readType = 2;
                // this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_IC_READER);
                this.commonService.doOff(this.DEVICE_LIGHT_CODE_OCR_READER).merge(
                    this.commonService.doOff(this.DEVICE_LIGHT_CODE_IC_READER)).subscribe();
            } else if ($.isEmptyObject(resp.ocr_data) || resp.ocr_data.length <= 1) {
                result.status = 'NOCARD';
            } else if (!this.checkOCRDataIsCurrent(resp.ocr_data)) {
            // } else if (resp.ocr_data.length <= 2) {
                result.status = 'ERROR';
                this.deviceType = 2;
                this.readType = 2;
                // this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_IC_READER);
                this.commonService.doOff(this.DEVICE_LIGHT_CODE_OCR_READER).merge(
                    this.commonService.doOff(this.DEVICE_LIGHT_CODE_IC_READER)).subscribe();
            } else {
                this.thereiscard = true;
                this.deviceType = 2;
                this.readType = 2;
                result.status = 'FIRSTSUCCESS';
                this.commonService.doOff(this.DEVICE_LIGHT_CODE_OCR_READER).merge(
                this.commonService.doOff(this.DEVICE_LIGHT_CODE_IC_READER)).subscribe();
                this.processOCRReaderData(resp.ocr_data, result);
                return result;
            }
            throw new Error(result.status);
        }).retryWhen(stream => stream.mergeMap(err => {
            this.service.sendTrackLog(`<OCR 重试>>>>>>>   ${err.message}`);
            if (err.message === 'NOCARD') {
                return [err];
            } else if (err.message === 'CRASH' || err.message === 'ERROR') {
                this.commonService.loggerExcp(this.ACTION_TYPE_OCR_INSERT, this.LOCATION_DEVICE_ID, 'GE02', '', this.newReader_icno, 'OCR exception');
                if (this.manualOCR) {
                    this.deviceType = 2;
                    this.readType = 2;
                } else {
                    this.deviceType = 1;
                    this.readType = 1;
                }
                card_error.ocrerrCount = card_error.ocrerrCount + 1;
                if (card_error.ocrerrCount < ATTEMPT_COUNT) {
                    if (this.manualOCR) {
                        this.processPromt('SCN-GEN-STEPS.OCR_READER_SCREEN_S17');
                        return this.commonService.doOff(this.DEVICE_LIGHT_CODE_IC_READER).merge(
                            this.commonService.doFlash(this.DEVICE_LIGHT_CODE_OCR_READER));
                    } else {
                        this.processPromt('SCN-GEN-STEPS.OCR_READER_SCREEN_S16');
                        return this.commonService.doOff(this.DEVICE_LIGHT_CODE_OCR_READER).merge(
                            this.commonService.doFlash(this.DEVICE_LIGHT_CODE_IC_READER));
                    }
                } else {
                    this.commonService.loggerExcp(this.ACTION_TYPE_OCR_INSERT, this.LOCATION_DEVICE_ID, 'GE05', '', this.newReader_icno, ' readhkicv2ocrdata');
                    throw new Error('OCR_OVER_COUNT');
                }
            }
        }).delay(DELAY_OCR));

        hasocr$.subscribe(data => {
            console.log('准备完成...........');
            this.preparing.hide();
            this.controlStatus = 1;
            this.commonService.doFlashLight(this.DEVICE_LIGHT_CODE_IC_READER);
            // ccc
        this.subscription = IC.merge(OCR).take(1).mergeMap((resp: any) => {
            if (this.modalPrompt.visible) {
                this.modalPrompt.hide();
            }
                console.log(`<检测到>>>>>>>>  ${resp.type}  ${resp.status}`);
            this.service.sendTrackLog(`<检测到>>>>>>>>  ${resp.type}  ${resp.status}`);
            const payload = {
                'card_reader_id': null,
                'contactless_password': {
                    'date_of_registration': resp.type === 'OCR' ? resp.ocr_data.dor : null,
                    'hkic_no': resp.type === 'OCR' ? resp.ocr_data.icno : null
                }
            }
            this.controlStatus = 4;
            this.processing.show();
            return this.service.sendRequestWithLog(CHANNEL_ID_RR_CARDREADER, 'opencard', payload).zip(
                Observable.timer(1000),
                (x, y) => {
                    return x;
                }
            );
        },
            (x, y, ix, iy) => {
                this.service.sendTrackLog(`<开卡情况>>>>>>> = ${x.type}  = ${y.result}`);
                if (y.result === false) {
                    this.commonService.loggerExcp(this.ACTION_TYPE_IC_OPENCARD, this.LOCATION_DEVICE_ID, 'GE03', '', this.newReader_icno, 'open card fail');
                    this.processing.hide();
                    this.controlStatus = 1;
                    if (x.type === 'OCR') {
                        throw new Error('OCR_OPENCARD_ERR');
                    } else if (x.type === 'ICCOLLECT') {
                        throw new Error('IC_OPENCARD_ERR');
                    }
                }
                if (x.type === 'OCR') {
                    this.deviceType = 2;
                    this.cardType = 2;
                } else if (x.type === 'ICCOLLECT') {
                    this.service.sendTrackLog(`<card_version>>>>>>>${y.card_version}`);
                    this.deviceType = y.card_version;
                    this.cardType = y.card_version;
                }
                return y;
            }).retryWhen(stream => stream.mergeMap(err => {
                if (err.message === 'TIMEOUT') {
                    this.deviceType = 1;
                    throw err;
                } else if (err.message === 'IC_OPENCARD_ERR') {
                    card_error.readerrorCount = card_error.readerrorCount + 1;
                    if (card_error.readerrorCount === 1) {
                        this.processPromt('SCN-GEN-STEPS.OCR_READER_SCREEN_S16');
                        return this.commonService.returnDoc().mergeMap(() => this.commonService.doFlash(this.DEVICE_LIGHT_CODE_IC_READER));
                    } else if (card_error.readerrorCount <= ATTEMPT_COUNT - 1) {
                        if (this.modalPrompt.visible) {
                            this.modalPrompt.hide();
                        }
                        // const yesButton = document.getElementById('ocrYesButton');
                        // const noButton = document.getElementById('ocrNoButton');
                        this.controlStatus = 3;
                        const oldc = document.getElementById('oldCard');
                        const newc = document.getElementById('newCard');
                        this.indicateCardType.show();
                        // this.modal1Comfirm.show();
                        return this.commonService.returnDoc().zip(Observable.merge(
                            fromEvent(newc, 'click').mapTo('YES'),
                            fromEvent(oldc, 'click').mapTo('NO')).take(1).mergeMap(resp => {
                                this.controlStatus = 1;
                                this.service.sendTrackLog(`errrrrr is  ${err}  and button click is   ${resp}`);
                                // this.modal1Comfirm.hide();
                                this.indicateCardType.hide();
                                if ('YES' === resp) {
                                    this.manualOCR = true;
                                    this.readType = 2;
                                    this.deviceType = 2;
                                    return Observable.combineLatest(
                                        this.commonService.doOff(this.DEVICE_LIGHT_CODE_IC_READER),
                                        this.commonService.doFlash(this.DEVICE_LIGHT_CODE_OCR_READER),
                                        (x, y) => {
                                            this.service.sendTrackLog(`选择YES后的灯光情况.x=${x.errorcode},y=${y.errorcode} `);
                                            return x;
                                        }
                                    );
                                } else if ('NO' === resp) {
                                    this.readType = 1;
                                    // return Observable.of(resp);
                                    return Observable.combineLatest(
                                        this.commonService.doFlash(this.DEVICE_LIGHT_CODE_IC_READER),
                                        this.commonService.doOff(this.DEVICE_LIGHT_CODE_OCR_READER),
                                        (x, y) => {
                                            return x;
                                        }
                                    );
                                }
                            })
                        );

                    } else if (card_error.readerrorCount >= ATTEMPT_COUNT) {
                        throw new Error('IC_OVER_COUNT');
                    }
                } else if (err.message === 'OCR_OPENCARD_ERR') {
                    this.thereiscard = true;
                    card_error.ocrerrCount = card_error.ocrerrCount + 1;
                    if (card_error.ocrerrCount < ATTEMPT_COUNT) {
                        if (this.manualOCR) {
                            this.deviceType = 2;
                            this.readType = 2;
                        } else {
                            this.deviceType = 1;
                            this.readType = 1;
                        }

                        if (this.manualOCR) {
                            this.processPromt('SCN-GEN-STEPS.OCR_READER_SCREEN_S17');
                            return this.commonService.doOff(this.DEVICE_LIGHT_CODE_IC_READER).merge(
                                this.commonService.doFlash(this.DEVICE_LIGHT_CODE_OCR_READER));
                        } else {
                            this.processPromt('SCN-GEN-STEPS.OCR_READER_SCREEN_S16');
                            return this.commonService.doOff(this.DEVICE_LIGHT_CODE_OCR_READER).merge(
                                this.commonService.doFlash(this.DEVICE_LIGHT_CODE_IC_READER));
                        }

                        // this.processPromt('SCN-GEN-STEPS.OCR_READER_SCREEN_S16');
                        // this.deviceType = 1;
                        // return Observable.of(err);
                        // return this.commonService.doOff(this.DEVICE_LIGHT_CODE_IC_READER).merge(
                        //     this.commonService.doFlash(this.DEVICE_LIGHT_CODE_OCR_READER));
                    } else {
                        throw new Error('OCR_OVER_COUNT');
                    }
                } else if (err.message === 'OCR_OVER_COUNT' || err.message === 'IC_OVER_COUNT') {
                    throw err;
                }
                }).delay(1000)).subscribe((resp) => {
                if (resp.result === true) {
                    this.subscription.unsubscribe();
                    this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_IC_READER);

                    if (this.timeOutPause || this.isAbort) {
                        return;
                    }
                    this.commonService.loggerTrans(this.ACTION_TYPE_IC_OPENCARD, this.LOCATION_DEVICE_ID, 'S', '', this.newReader_icno, 'call opencard');
                    this.nextRouteUnsub(this.subscription);
                }
            },
            (error) => {
                this.subscription.unsubscribe();
                // this.controlStatus = 2;
                this.service.sendTrackLog(`最后出错了,错误是${error.message}`);
                // this.storeConfigParam();
                let errMessage = null;
                if (error.message === 'TIMEOUT') {
                    this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_IC_READER);
                    // this.processPromtExit('SCN-GEN-STEPS.MESSAGE-TIMEOUT');
                    errMessage = 'SCN-GEN-STEPS.MESSAGE-TIMEOUT';
                } else if (error.message === 'IC_OVER_COUNT') {
                    this.readType = 1;
                    // this.commonService.doReturnDoc();
                    // this.processPromtExit('SCN-GEN-STEPS.PROCESS_SCREEN_S14');
                    errMessage = 'SCN-GEN-STEPS.PROCESS_SCREEN_S14';
                } else if (error.message === 'OCR_OVER_COUNT') {
                    this.readType = 2;
                    // this.processPromtExit('SCN-GEN-STEPS.PROCESS_SCREEN_S14');
                    errMessage = 'SCN-GEN-STEPS.PROCESS_SCREEN_S14';
                }
                this.exit(errMessage);
                // this.router.navigate(['kgen-viewcard/over'], { queryParams: {'err': errMessage}});
            },
            () => {
                // subscription.unsubscribe();
            });
        });
    }

    exit(promtMessage) {
        this.storeConfigParam();
        this.router.navigate(['/scn-gen/over'], { queryParams: {'err': promtMessage, 'step': 1}});
    }

    // 点击退出
    quit() {
        this.subscription.unsubscribe();
        // this.cardType = cardType;
        // this.showImage = true;
        // this.isShowCollect = false;
        const deviceCode = this.cardType === 1 ? this.DEVICE_LIGHT_CODE_IC_READER : this.DEVICE_LIGHT_CODE_OCR_READER;
        this.commonService.doCloseCard();
        this.commonService.doFlashLight(deviceCode);
        setTimeout(() => {
            if (this.cardType === 1) {
                this.commonService.doReturnDoc();
            }
            this.commonService.doLightOff(deviceCode);
            this.backRoute();
        }, 3000);
    }

   /**
     *  start print
     */
    // printBill() {
    //     if (this.timeOutPause || this.isAbort) {
    //         return;
    //     }
    //     // this.hkic_number_view = 'M004143(8)';
    //     const icnoStar = 'g';
    //     const date = new Date();
    //     const year = date.getFullYear();
    //     const month = date.getMonth() + 1;
    //     let monthStr = month + '';
    //     if (month < 10) {
    //         monthStr = '0' + month;
    //     }
    //     const day = date.getDate();
    //     let dayStr = day + '';
    //     if (day < 10) {
    //         dayStr = '0' + dayStr;
    //     }
    //     const hour = date.getHours();
    //     let hourStr = hour + '';
    //     if (hour < 10) {
    //         hourStr = '0' + hourStr;
    //     }
    //     const minute = date.getMinutes();
    //     let minuteStr  = minute + '';
    //     if (minute < 10) {
    //         minuteStr =  '0' + minuteStr;
    //     }
    //     const second = date.getSeconds();
    //     let secondStr = second + '';
    //     if (second < 10) {
    //         secondStr = '0' + secondStr;
    //     }
    //     const datestr = dayStr + '-' + monthStr + '-' + year + '  ' + hourStr + ':' + minuteStr + ':' + secondStr;
    //     const billNo = this.LOCATION_DEVICE_ID + '_' + year + monthStr + dayStr + hourStr + minuteStr + secondStr;
    //     const printcontent =
    //         ' ******************************************** \n' +
    //         '           香港入境事務處\n' +
    //         '        Hong Kong Immigration Department\n' +
    //         ' ++++++++++++++++++++++++++++++++++++++++++++ \n' +
    //         ' 身份證明文件號碼: ' + icnoStar + '\n' +
    //         ' Identity document number:\n' +
    //         ' --------------------------------------------- \n' +
    //         ' 交易類別:          查看芯片中的個人數據 \n' +
    //         ' Type of service:   View personal data in chip \n' +
    //         ' -------------------------------------------- \n' +
    //         '  交易狀態:                完成   \n' +
    //         '  Transaction state:       Completed     \n' +
    //         ' -------------------------------------------- \n' +
    //         '  日期及時間:     ' + datestr + '\n' +
    //         '  Date and time\n' +
    //         ' -------------------------------------------- \n' +
    //         '  交易參考編號:  ' + billNo + '\n' +
    //         '  Transaction reference number:\n' +
    //         ' --------------------------------------------- \n' +
    //         '  備註:                     不適用\n' +
    //         '  Remark:                 Unavailable\n' +
    //         ' ********************************************* \n' ;
    //     const dataJson = [
    //         {
    //             'type': 'txt',
    //             'data': printcontent,
    //             'height': '600',
    //             'leftMargin': '10',
    //             'attribute': 'normal'
    //         },
    //         {
    //             'type': 'vspace',
    //             'data': '100',
    //             'height': '',
    //             'leftMargin': '',
    //             'attribute': ''
    //         },
    //         {
    //             'type': 'cutpaper',
    //             'data': '',
    //             'height': '',
    //             'leftMargin': '',
    //             'attribute': 'black|full'
    //         },
    //     ];
    //     console.log('call : printslip fun.' + JSON.stringify(dataJson))
    //     this.printSlip(dataJson);
    // }
    // printSlip(dataJson) {
    //     if (this.timeOutPause || this.isAbort) {
    //         return;
    //     }
    //     console.log('call : printslip fun.' + JSON.stringify(dataJson))
    //     this.service.sendRequestWithLog('RR_SLIPPRINTER', 'printslip', {'data': dataJson}).subscribe((resp) => {
    //         if (!$.isEmptyObject(resp) && resp.errorcode === '0') {
    //             console.log('printslip operate success');
    //             if (this.timeOutPause || this.isAbort) {
    //                 return;
    //             }
    //             this.nextRoute();
    //         } else {
    //             console.log('call printslip fail!');
    //             if (this.timeOutPause || this.isAbort) {
    //                 return;
    //             }
    //             this.messageFail = 'SCN-GEN-STEPS.BILL_PRINT_EXCEPTION';
    //             this.processing.hide();
    //             this.processModalFailShow();
    //         }
    //     }, (error) => {
    //         console.log('printslip ERROR ' + error);
    //         this.messageFail = 'SCN-GEN-STEPS.BILL_PRINT_EXCEPTION';
    //         this.processing.hide();
    //         if (this.isAbort || this.timeOutPause) {
    //             return;
    //         }
    //         this.processModalFailShow();
    //     });
    // }
}
