import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FingerprintService} from '../../../shared/services/fingerprint-service/fingerprint.service';
import {MsksService} from '../../../shared/msks';
import {ConfirmComponent} from '../../../shared/sc2-confirm';
import {LocalStorageService} from '../../../shared/services/common-service/Local-storage.service';
import {ProcessingComponent} from '../../../shared/processing-component';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../../shared/services/common-service/common.service';
import {TimerComponent} from '../../../shared/sc2-timer';
import {CHANNEL_ID_RR_CARDREADER, CHANNEL_ID_RR_ICCOLLECT} from '../../../shared/var-setting';
@Component({
    templateUrl: './step-fingerprint.component.html',
    styleUrls: ['./step-fingerprint.component.scss']
})

export class StepFingerprintComponent implements OnInit {

    @ViewChild('modalFail')
    public modalFail: ConfirmComponent;

    @ViewChild('modalQuit')
    public modalQuit: ConfirmComponent;

    @ViewChild('modalTimeout')
    public modalTimeout: ConfirmComponent;

    @ViewChild('processing')
    public processing: ProcessingComponent;

    @ViewChild('modalPrompt')
    public modalPrompt: ConfirmComponent;

    @ViewChild('timer')
    public timer: TimerComponent;
    messageRetry: String = 'SCN-GEN-STEPS.RE-SCANER-FINGER';
    messageFail= 'SCN-GEN-STEPS.RE-SCANER-MAX';
    messageAbort= 'SCN-GEN-STEPS.ABORT_CONFIRM';
    messageTimeout = 'SCN-GEN-STEPS.MESSAGE-TIMEOUT';
    messageCollect = 'SCN-GEN-STEPS.COLLECT-CARD-SURE';
    messagePrompt = '';
    hkic_number_view = '';
    maxFingerCount = 2;
    isRestore = false;
    isAbort = false;
    timeOutPause = false;
    isShow = false;
    isShowCollect = false;
    cardType = 1;
    readType = 1;
    retryVal = 0;
    operateType = '1';
    isLevePage = false;
    isScanfp = false;

    controlStatus = 1;

    carddataJson = '';

    fp_tmpl1_in_base64 = '';
    fp_tmpl2_in_base64 = '';
    fp_tmpl1_fingernum = '';
    fp_tmpl2_fingernum = '';

    PAGE_FINGERPRINT_ABORT_QUIT_ITEMOUT = 15000;
    PAGE_FINGERPRINT_RETURN_CARD_ITEMOUT = 13000;
    PAGE_FINGERPRINT_TIME_EXPIRE_ITEMOUT = 15000;
    PAGE_FINGERPRINT_MATCH_SCORE = 3500;
    PAGE_FINGERPRINT_SCAN_MAX = 3;
    PAGE_FINGERPRINT_IS_VALIDATION = 0;
    PAGE_FINGERPRINT_FP_TMPL_FORMAT = 'Morpho_PkCompV2';
    APP_LANG = '';
    DEVICE_LIGHT_CODE_OCR_READER = '08';
    DEVICE_LIGHT_CODE_IC_READER = '07';
    DEVICE_LIGHT_CODE_PRINTER = '06';
    DEVICE_LIGHT_CODE_FINGERPRINT = '06';
    DEVICE_LIGHT_ALERT_BAR_BLUE_CODE = '11';
    DEVICE_LIGHT_ALERT_BAR_GREEN_CODE = '12';
    DEVICE_LIGHT_ALERT_BAR_RED_CODE = '13';
    LOCATION_DEVICE_ID = 'K1-SCK-01';

    FP_TMPL_FORMAT_CARD_TYPE_1 = 'Cogent';
    FP_TMPL_FORMAT_CARD_TYPE_2 = 'Morpho_PkCompV2';
    FP_MATCH_SCORE_CARD_TYPE_1 = 0;
    FP_MATCH_SCORE_CARD_TYPE_2 = 3500;

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

    carddata: any = {};
    allFingerNum = [];

    constructor(private router: Router,
                private commonService: CommonService,
                private route: ActivatedRoute,
                private service: MsksService,
                private http: HttpClient,
                private localStorages: LocalStorageService,
                private fingers: FingerprintService,
                private translate: TranslateService) {
    }

    ngOnInit(): void {
        console.log('init fun');
        this.initConfigParam();
        this.initFingerTempFormat();
        this.initLanguage();
        this.initHKICNumber();
        this.startBusiness();
    }
    initConfigParam() {
        this.operateType = this.localStorages.get('operateType');
        this.APP_LANG = this.localStorages.get('APP_LANG');
        this.LOCATION_DEVICE_ID = this.localStorages.get('LOCATION_DEVICE_ID');
        this.DEVICE_LIGHT_CODE_OCR_READER = this.localStorages.get('DEVICE_LIGHT_CODE_OCR_READER');
        this.DEVICE_LIGHT_CODE_IC_READER = this.localStorages.get('DEVICE_LIGHT_CODE_IC_READER');
        this.DEVICE_LIGHT_CODE_PRINTER = this.localStorages.get('DEVICE_LIGHT_CODE_PRINTER');
        this.DEVICE_LIGHT_CODE_FINGERPRINT = this.localStorages.get('DEVICE_LIGHT_CODE_FINGERPRINT');
        this.DEVICE_LIGHT_ALERT_BAR_BLUE_CODE = this.localStorages.get('DEVICE_LIGHT_ALERT_BAR_BLUE_CODE');
        this.DEVICE_LIGHT_ALERT_BAR_GREEN_CODE = this.localStorages.get('DEVICE_LIGHT_ALERT_BAR_GREEN_CODE');
        this.DEVICE_LIGHT_ALERT_BAR_RED_CODE = this.localStorages.get('DEVICE_LIGHT_ALERT_BAR_RED_CODE');

        this.FP_TMPL_FORMAT_CARD_TYPE_1 = this.localStorages.get('FP_TMPL_FORMAT_CARD_TYPE_1');
        this.FP_TMPL_FORMAT_CARD_TYPE_2 = this.localStorages.get('FP_TMPL_FORMAT_CARD_TYPE_2');
        this.FP_MATCH_SCORE_CARD_TYPE_1 = Number.parseInt(this.localStorages.get('FP_MATCH_SCORE_CARD_TYPE_1'));
        this.FP_MATCH_SCORE_CARD_TYPE_2 = Number.parseInt(this.localStorages.get('FP_MATCH_SCORE_CARD_TYPE_2'));

        this.ACTION_TYPE_IC_CLOSECARD = this.localStorages.get('ACTION_TYPE_IC_CLOSECARD');
        this.ACTION_TYPE_IC_RETURN_CARD = this.localStorages.get('ACTION_TYPE_IC_RETURN_CARD');
        this.ACTION_TYPE_OCR_CLOSECARD = this.localStorages.get('ACTION_TYPE_OCR_CLOSECARD');
        this.ACTION_TYPE_OCR_COLLECT_CARD = this.localStorages.get('ACTION_TYPE_OCR_COLLECT_CARD');
        this.ACTION_TYPE_FINGER_NUMBER = this.localStorages.get('ACTION_TYPE_FINGER_NUMBER');
        this.ACTION_TYPE_FINGER_SCAN = this.localStorages.get('ACTION_TYPE_FINGER_SCAN');
        this.ACTION_TYPE_VERIFICATION = this.localStorages.get('ACTION_TYPE_VERIFICATION');

        this.PAGE_FINGERPRINT_ABORT_QUIT_ITEMOUT = Number.parseInt(this.localStorages.get('PAGE_FINGERPRINT_ABORT_QUIT_ITEMOUT'));
        this.PAGE_FINGERPRINT_RETURN_CARD_ITEMOUT = Number.parseInt(this.localStorages.get('PAGE_FINGERPRINT_RETURN_CARD_ITEMOUT'));
        this.PAGE_FINGERPRINT_TIME_EXPIRE_ITEMOUT = Number.parseInt(this.localStorages.get('PAGE_FINGERPRINT_TIME_EXPIRE_ITEMOUT'));
        this.PAGE_FINGERPRINT_MATCH_SCORE = Number.parseInt(this.localStorages.get('PAGE_FINGERPRINT_MATCH_SCORE'));
        this.PAGE_FINGERPRINT_SCAN_MAX = Number.parseInt(this.localStorages.get('PAGE_FINGERPRINT_SCAN_MAX'));
        this.PAGE_FINGERPRINT_IS_VALIDATION = Number.parseInt(this.localStorages.get('PAGE_FINGERPRINT_IS_VALIDATION'));
        this.PAGE_FINGERPRINT_FP_TMPL_FORMAT = this.localStorages.get('PAGE_FINGERPRINT_FP_TMPL_FORMAT');

        this.cardType = Number.parseInt(this.localStorages.get('cardType'));
        this.readType = Number.parseInt(this.localStorages.get('readType'));
        this.fp_tmpl1_in_base64 = this.localStorages.get('fp_tmpl1_in_base64');
        this.fp_tmpl2_in_base64 = this.localStorages.get('fp_tmpl2_in_base64');
        this.fp_tmpl1_fingernum = this.localStorages.get('fp_tmpl1_fingernum');
        this.fp_tmpl2_fingernum = this.localStorages.get('fp_tmpl2_fingernum');
        this.carddataJson = this.localStorages.get('carddataJson');
        if (this.carddataJson) {
            this.carddata = JSON.parse(this.carddataJson);
        }
    }

    initFingerTempFormat() {
        this.PAGE_FINGERPRINT_FP_TMPL_FORMAT = this.FP_TMPL_FORMAT_CARD_TYPE_2;
        this.PAGE_FINGERPRINT_MATCH_SCORE = this.FP_MATCH_SCORE_CARD_TYPE_2;
        if (this.cardType === 1) {
            this.PAGE_FINGERPRINT_FP_TMPL_FORMAT = this.FP_TMPL_FORMAT_CARD_TYPE_1;
            this.PAGE_FINGERPRINT_MATCH_SCORE = this.FP_MATCH_SCORE_CARD_TYPE_1;
        }
    }

    initLanguage() {
        if ('en-US' === this.APP_LANG) {
            this.translate.use('en-US');
        } else {
            this.translate.use('zh-HK');
        }
        this.translate.currentLang = this.APP_LANG;
    }

    initHKICNumber() {
        if (this.cardType === 1) {
            const icno = this.carddata.icno;
            const lengthNum = icno.length;
            const icon_format = icno.substring(0, lengthNum - 1);
            const last_str = icno.substring(lengthNum - 1, lengthNum);
            this.hkic_number_view = icon_format + '(' + last_str + ')';
        } else {
            this.hkic_number_view = this.carddata.hkic_number;
        }
    }

    startBusiness() {
        if (this.readType === 2) {
            this.commonService.doReturnDoc();
        }
        // this.processing.show();
        // this.isShow = true;
        // this.isShowCollect = true;
        // this.quitDisabledAll();
        this.startFingerPrint();
    }

    /**
     * init param Data.r
     */
    startFingerPrint() {
        // alert('fp_tmpl1_fingernum=' + this.fp_tmpl1_fingernum + 'fp_tmpl1_in_base64=' + this.fp_tmpl1_in_base64);
        // alert('fp_tmpl2_fingernum=' + this.fp_tmpl2_fingernum + 'fp_tmpl2_in_base64=' + this.fp_tmpl2_in_base64);
        if (this.commonService.checkFpNull(this.fp_tmpl1_in_base64) && !this.commonService.checkFpNull(this.fp_tmpl2_in_base64)) {
            this.fp_tmpl1_in_base64 = this.fp_tmpl2_in_base64;
            this.fp_tmpl1_fingernum = this.fp_tmpl2_fingernum;
            this.maxFingerCount = 1;
            this.allFingerNum.push('fp' + this.fp_tmpl2_fingernum);
        } else if (this.commonService.checkFpNull(this.fp_tmpl2_in_base64)) {
            this.maxFingerCount = 1;
            this.allFingerNum.push('fp' + this.fp_tmpl1_fingernum);
        } else {
            // alert(666);
            this.allFingerNum.push('fp' + this.fp_tmpl1_fingernum);
            this.allFingerNum.push('fp' + this.fp_tmpl2_fingernum);
        }
        // this.processing.hide();
        // this.isShow = false;
        // this.cancelQuitEnabledAll();
        this.doScanFingerPrint();
    }

    nextRoute() {
        if (this.timeOutPause || this.isAbort) {
            return;
        }
        this.storeConfigParam();
        this.isLevePage = true;
        // this.closeFpFn();
        // 根据所选操作类型 operateType = 1, viewcard, operateType = 2 updatecoslos.
        let forwordPage = '/scn-gen/viewcard';
        if (this.operateType === '2') {
            forwordPage = '/scn-gen/updatecard';
        }
        this.router.navigate([forwordPage]);
        // this.exit('SCN-GEN-STEPS.MESSAGE-TIMEOUT');
        return;
    }

    storeConfigParam() {
        this.localStorages.set('APP_LANG', this.translate.currentLang);
        this.localStorages.set('cardType', this.cardType.toString());
        this.localStorages.set('readType', this.readType.toString());
    }

    closeFpFn() {
        this.service.sendRequestWithLog('RR_fptool', 'cancelscan', {}).subscribe((resp) => {});
    }

    /**
     * backPage.
     */
    backRoute() {
        this.timeOutPause = true;
        if (this.processing.visible) {
            this.processing.hide();
            this.isShow = false;
        }
        if (this.modalQuit.visible) {
            this.modalQuit.hide();
        }
        this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_OCR_READER);
        this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_IC_READER);
        this.commonService.doLightOff(this.DEVICE_LIGHT_ALERT_BAR_BLUE_CODE);
        this.commonService.doLightOff(this.DEVICE_LIGHT_ALERT_BAR_GREEN_CODE);
        // this.commonService.doLightOff(this.DEVICE_LIGHT_ALERT_BAR_RED_CODE);
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
    }

    /**
     *  start scanner fingerprint
     */
    doScanFingerPrint() {
        console.log('call : getphoto fun.')
        this.isScanfp = false;
        if (this.isAbort || this.timeOutPause || this.isLevePage) {
            return;
        }
        // this.service.sendRequestWithLog('RR_FPSCANNERREG', 'takephoto', {
        this.service.sendRequestWithLog('RR_fptool', 'scanfp', {
                'finger_num': this.fp_tmpl1_fingernum,
                'fp_img_format': 'wsq'
        }).subscribe((resp) => {
            this.isScanfp = true;
            if (this.isAbort || this.timeOutPause || this.isLevePage) {
                return;
            }
            this.processing.show();
            this.controlStatus = 4;
            // this.quitDisabledAll();
            if (!$.isEmptyObject(resp)) {
                if (resp.error_info.error_code === '0') {
                    // log
                    this.commonService.loggerTrans(this.ACTION_TYPE_FINGER_SCAN, this.LOCATION_DEVICE_ID, 'S', '', this.hkic_number_view, 'call takephoto');
                    // this.processExtractImgtmpl(resp.fpdata);
                    this.processExtractImgtmpl(resp.fp_img_in_base64);
                } else {
                    this.controlStatus = 1;
                    this.doFailedScan();
                }
            } else {
                this.messageFail = 'SCN-GEN-STEPS.FINGERPRINT-DEVICE-EXCEPTION';
                this.processing.hide();
                // this.isShow = false;
                if (this.isAbort || this.timeOutPause) {
                    return;
                }
                // this.controlStatus = 2;
                // this.processModalFailShow();
                // this.commonService.doAlarm('FP Scanfp Failure');
                this.exit('SCN-GEN-STEPS.FINGERPRINT-DEVICE-EXCEPTION');
            }
        }, (error) => {
            console.log('takephoto ERROR ' + error);
            this.commonService.loggerExcp(this.ACTION_TYPE_FINGER_SCAN, this.LOCATION_DEVICE_ID, 'GE08', '', this.hkic_number_view, 'takephoto exception');
            this.messageFail = 'SCN-GEN-STEPS.FINGERPRINT-DEVICE-EXCEPTION';
            this.commonService.doAlarm('FP Scanner Error');
            this.processing.hide();
            this.isShow = false;
            if (this.isAbort || this.timeOutPause) {
                return;
            }
            this.processModalFailShow();
        });
    }

    /**
     * faild try again.
     */
    doFailedScan() {
        if (this.isAbort || this.timeOutPause || this.isLevePage) {
            return;
        }
        this.retryVal += 1;
        if (this.retryVal < this.PAGE_FINGERPRINT_SCAN_MAX) {
            console.log(this.retryVal);
            this.processing.hide();
            // this.isShow = false;
            // this.quitDisabledAll();
            this.processPromt(this.messageRetry);

        } else {
            this.processing.hide();
            this.controlStatus = 2;
            this.commonService.loggerExcp(this.ACTION_TYPE_VERIFICATION, this.LOCATION_DEVICE_ID, 'GE08', '', this.hkic_number_view, 'fingerprintexception');
            this.messageFail = 'SCN-GEN-STEPS.RE-SCANER-MAX';
            // this.isAbort = true;
            // this.isShow = false;
            // this.processModalFailShow();
            // this.processPromtWithExit(this.messageFail);
            // this.commonService.doAlarm('FP Verify Failure');
            this.exit('SCN-GEN-STEPS.RE-SCANER-MAX');
        }
    }

    /**
     *  data type change to Morpho_CFV
     * @param fpdata
     */
    processExtractImgtmpl (fpdata: String) {
        if (this.isAbort || this.timeOutPause || this.isLevePage) {
            return;
        }
        this.service.sendRequestWithLog('RR_fptool', 'extractimgtmpl',
            {'finger_num': this.fp_tmpl1_fingernum,
                'fp_tmpl_format': this.PAGE_FINGERPRINT_FP_TMPL_FORMAT,
                'fp_img_in_base64': fpdata}).subscribe((resp) => {
            if (this.isAbort || this.timeOutPause || this.isLevePage) {
                return;
            }
            if (resp.error_info.error_code === '0') {
                this.commonService.loggerTrans(this.ACTION_TYPE_FINGER_SCAN, this.LOCATION_DEVICE_ID, 'S', '', this.hkic_number_view, 'extractimgtmpl exception');
                this.compareFingerPrint( resp.fp_tmpl_in_base64);
            } else {
                if (this.maxFingerCount > 1) {
                    this.controlStatus = 1;
                    this.processExtractImgtmplTwo(fpdata);
                } else {
                    this.doFailedScan();
                }
            }
        }, (error) => {
            console.log('extractimgtmpl ERROR ' + error);
            this.commonService.loggerExcp(this.ACTION_TYPE_FINGER_SCAN, this.LOCATION_DEVICE_ID, 'GE08', '', this.hkic_number_view, 'extractimgtmpl exception');
            this.doCloseCard();
        });
    }

    processExtractImgtmplTwo (fpdata: String) {
        if (this.isAbort || this.timeOutPause || this.isLevePage) {
            return;
        }
        this.service.sendRequestWithLog('RR_fptool', 'extractimgtmpl',
            {'finger_num': this.fp_tmpl2_fingernum,
                'fp_tmpl_format': this.PAGE_FINGERPRINT_FP_TMPL_FORMAT,
                'fp_img_in_base64': fpdata}).subscribe((resp) => {
            if (this.isAbort || this.timeOutPause || this.isLevePage) {
                return;
            }
            if (resp.error_info.error_code === '0') {
                this.commonService.loggerTrans(this.ACTION_TYPE_FINGER_SCAN, this.LOCATION_DEVICE_ID, 'S', '', this.hkic_number_view, 'extractimgtmpl exception');
                this.compareFingerPrint( resp.fp_tmpl_in_base64);
            } else {
                this.doFailedScan();
            }
        }, (error) => {
            console.log('extractimgtmpl ERROR ' + error);
            this.commonService.loggerExcp(this.ACTION_TYPE_FINGER_SCAN, this.LOCATION_DEVICE_ID, 'GE08', '', this.hkic_number_view, 'extractimgtmpl exception');
            this.doCloseCard();
        });
    }

    /**
     *
     * @param fpdataTemp
     */
    compareFingerPrint(fpdataTemp: String) {
        if (this.isAbort || this.timeOutPause || this.isLevePage) {
            return;
        }

        this.service.sendRequest('RR_fptool', 'verifytmpl', {
            'fp_tmpl_format': this.PAGE_FINGERPRINT_FP_TMPL_FORMAT,
            'fp_tmpl1_in_base64': fpdataTemp,
            'fp_tmpl2_in_base64': this.fp_tmpl1_in_base64
        }).subscribe((resp) => {
            if (this.isAbort || this.timeOutPause || this.isLevePage) {
                return;
            }
            // is validate
            if (this.PAGE_FINGERPRINT_IS_VALIDATION === 0) {
                this.commonService.loggerTrans(this.ACTION_TYPE_VERIFICATION, this.LOCATION_DEVICE_ID, 'S', 'KSK_AUD', this.hkic_number_view, 'call verifytmpl');
                this.nextRoute();
                return;
            }
            if (!$.isEmptyObject(resp)) {
                // resp.match_score = 3500,card_type_1 = 0,card_type_2 = 3500
                if (resp.match_score > this.PAGE_FINGERPRINT_MATCH_SCORE) {
                    this.nextRoute();
                } else {
                    this.controlStatus = 1;
                    if (this.maxFingerCount > 1) {
                        this.processing.hide();
                        this.compareFingerPrintTwo(fpdataTemp);
                    } else {
                        this.processing.hide();
                        this.doFailedScan();
                    }
                }
            } else {
                console.log('There\'s an error on comparing fingerprints!');
                this.isAbort = true;
                this.doCloseCard();
            }
        }, (error) => {
            console.log('verifytmpl ERROR ' + error);
            this.commonService.loggerExcp(this.ACTION_TYPE_VERIFICATION, this.LOCATION_DEVICE_ID, 'GE09', 'KSK_AUD', this.hkic_number_view, 'verifytmpl exception');
            this.isAbort = true;
            this.doCloseCard();
        });
    }

    compareFingerPrintTwo(fpdataTemp: String) {
        if (this.isAbort || this.timeOutPause || this.isLevePage) {
            return;
        }
        this.service.sendRequest('RR_fptool', 'verifytmpl', {
            'fp_tmpl_format': this.PAGE_FINGERPRINT_FP_TMPL_FORMAT,
            'fp_tmpl1_in_base64': fpdataTemp,
            'fp_tmpl2_in_base64': this.fp_tmpl2_in_base64
        }).subscribe((resp) => {
            if (this.isAbort || this.timeOutPause || this.isLevePage) {
                return;
            }
            // is validate
            if (this.PAGE_FINGERPRINT_IS_VALIDATION === 0) {
                this.commonService.loggerTrans(this.ACTION_TYPE_VERIFICATION, this.LOCATION_DEVICE_ID, 'S', 'KSK_AUD', this.hkic_number_view, 'call verifytmpl');
                this.nextRoute();
            }
            if (!$.isEmptyObject(resp)) {
                // resp.match_score = 3500,card_type_1 = 0,card_type_2 = 3500
                if (resp.match_score > this.PAGE_FINGERPRINT_MATCH_SCORE) {
                    this.nextRoute();
                } else {
                    this.doFailedScan()
                }
            } else {
                console.log('There\'s an error on comparing fingerprints!');
                this.isAbort = true;
                this.doCloseCard();
            }
        }, (error) => {
            console.log('verifytmpl ERROR ' + error);
            this.commonService.loggerExcp(this.ACTION_TYPE_VERIFICATION, this.LOCATION_DEVICE_ID, 'GE09', 'KSK_AUD', this.hkic_number_view, 'verifytmpl exception');

            this.isAbort = true;
            this.doCloseCard();
        });
    }

    // *************************************************************************************************************************************

    /**
     *  timeout
     */
    timeExpire() {
        this.timer.showTimer = false;
        this.timeOutPause = true;
        if (this.processing.visible) {
            this.processing.hide();
            this.isShow = false;
        }
        if (this.modalQuit.visible) {
            this.modalQuit.hide();
        }
        this.messageTimeout = 'SCN-GEN-STEPS.MESSAGE-TIMEOUT';
        this.modalTimeout.show();
        this.quitDisabledAll();
        setTimeout(() => {
            this.processTimeoutQuit();
        }, this.PAGE_FINGERPRINT_TIME_EXPIRE_ITEMOUT);
    }

    processTimeoutQuit() {
        this.modalTimeout.hide();
        this.doCloseCard();
    }
    processModalFailShow() {
        this.isAbort = true;
        this.modalFail.show();
    }

    processFailQuit() {
        this.modalFail.hide();
        this.doCloseCard();
    }

    quitDisabledAll() {
        $('#exitBtn').attr('disabled', 'false');
        $('#langBtn').attr('disabled', 'false');

    }
    cancelQuitEnabledAll() {
        $('#exitBtn').removeAttr('disabled');
        $('#langBtn').removeAttr('disabled');
    }

    processModalQuitShow() {
        this.modalQuit.show()
        this.isAbort = true;
        this.closeFpFn();
        if (this.processing.visible) {
            this.isRestore = true;
            this.processing.hide();
            this.isShow = false;
        }
    }

    processConfirmQuit() {
        this.modalQuit.hide();
        if (this.processing.visible) {
            this.processing.hide();
            this.isShow = false;
        }
        this.isAbort = true;
        this.isLevePage = true;
        // this.doCloseCard();
        this.exit('');
    }

    processCancelQuit() {
        this.modalQuit.hide();
        this.isAbort = false;
        this.isLevePage = false;
        this.doScanFingerPrint();
        // if (this.isScanfp) {
        // }
        if (this.isRestore) {
            // this.processing.show();
            this.isShow = true;
        } else {
            this.cancelQuitEnabledAll();
        }
    }

    doCloseCard() {
        // this.processing.show();
        this.isShow = true;
        this.isShowCollect = false;
        this.service.sendRequestWithLog(CHANNEL_ID_RR_CARDREADER, 'closecard').subscribe((resp) => {
            if (this.readType === 1) {
                setTimeout(() => {
                    this.doReturnDoc();
                }, this.PAGE_FINGERPRINT_RETURN_CARD_ITEMOUT);
                setTimeout(() => {
                    this.backRoute();
                }, this.PAGE_FINGERPRINT_ABORT_QUIT_ITEMOUT);
            } else {
                this.commonService.doFlashLight(this.DEVICE_LIGHT_CODE_OCR_READER);
                setTimeout(() => {
                    this.backRoute();
                }, this.PAGE_FINGERPRINT_ABORT_QUIT_ITEMOUT);
            }
        }, (error) => {
            console.log('closecard ERROR ' + error);
            setTimeout(() => {
                this.backRoute();
            }, this.PAGE_FINGERPRINT_ABORT_QUIT_ITEMOUT);
        });
    }

    doReturnDoc() {
        this.commonService.doFlashLight(this.DEVICE_LIGHT_CODE_IC_READER);
        this.service.sendRequestWithLog(CHANNEL_ID_RR_ICCOLLECT, 'returndoc').subscribe(() => {
            this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_IC_READER);
        }, (error) => {
            console.log('opencard ERROR ' + error);
            this.commonService.loggerExcp(this.ACTION_TYPE_IC_RETURN_CARD, this.LOCATION_DEVICE_ID, 'GE0F', '', this.hkic_number_view, 'call returndoc');
            this.messageFail = 'SCN-GEN-STEPS.READER-COLLECT-FAIL';
            this.commonService.doAlarm('Eject Card Error');
            if (this.timeOutPause || this.isAbort) {
                return;
            }
            this.processModalFailShow();
        });
    }

    processPromt(message_key) {
        if (this.isAbort || this.timeOutPause || this.isLevePage) {
            return;
        }
        this.messagePrompt = message_key;
        this.modalPrompt.show();
        this.doScanFingerPrint();
        setTimeout(() => {
            this.modalPrompt.hide();
        }, 3000);
    }

    exit(promtMessage) {
        // this.closeFpFn();
        // this.storeConfigParam();
        this.router.navigate(['/scn-gen/over'], { queryParams: {'err': promtMessage, 'step': 2}});
        return;
    }
}
