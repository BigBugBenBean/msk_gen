import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MsksService} from '../../../shared/msks';
import {CHANNEL_ID_RR_CARDREADER, CHANNEL_ID_RR_ICCOLLECT} from '../../../shared/var-setting';
import {ConfirmComponent} from '../../../shared/sc2-confirm';
import {ProcessingComponent} from '../../../shared/processing-component';
import {LocalStorageService} from '../../../shared/services/common-service/Local-storage.service';
import {CommonService} from '../../../shared/services/common-service/common.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TimerComponent} from '../../../shared/sc2-timer';

@Component({
    templateUrl: './step-updatecard.component.html',
    styleUrls: ['./step-updatecard.component.scss']
})
export class StepUpdatecardComponent  implements OnInit {

    @ViewChild('modalRetry')
    public modalRetry: ConfirmComponent;

    @ViewChild('modalFail')
    public modalFail: ConfirmComponent;

    @ViewChild('modalTimeout')
    public modalTimeout: ConfirmComponent;

    @ViewChild('modalCollect')
    public modalCollect: ConfirmComponent;

    @ViewChild('modalNoROP')
    public modalNoROP: ConfirmComponent;

    @ViewChild('modalQuit')
    public modalQuit: ConfirmComponent;

    @ViewChild('modalPrintBill')
    public modalPrintBill: ConfirmComponent;

    @ViewChild('timer')
    public timer: TimerComponent;

    @ViewChild('processing')
    public processing: ProcessingComponent;
    messageRetry: String = 'SCN-GEN-STEPS.RE-SCANER-FINGER';
    messageFail= 'SCN-GEN-STEPS.RE-SCANER-MAX';
    messageAbort= 'SCN-GEN-STEPS.ABORT_CONFIRM';
    messagePrint = 'SCN-GEN-STEPS.BILL-PRINT-MESSAGE';
    messageTimeout = 'SCN-GEN-STEPS.MESSAGE-TIMEOUT';
    messageCollect = 'SCN-GEN-STEPS.COLLECT-CARD-SURE';
    title: string;
    api_path = ''
    deviceId = 'K1-SCK-03';
    img = '../../../../assets/images/photo1.jpg'; // set to '' if no image found or set to the Image path;
    isShowCollect = false;
    buttonNum: Number = 2;
    cardType = 1;
    readType = 1;
    retryVal = 0;
    los = '';
    cos = '';
    dob = null;
    showdata = false;
    isAbort = false;
    timeOutPause = false;
    carddata: any = {};
    carddataJson = '';
    icprfParam = '';
    icnoParam = '';
    losView = '';
    cosView = 'NA';
    isRestore = false;
    hkic_number_view = '';
    newReader_dor = null;
    newReader_icno = null;
    operateType = '1';

    UPDATE_LOL_COS_WEBSERVICE_PORT = '6090';
    UPDATE_LOS_COS_WEBSERVICE_IP = 'localhost';
    LOCATION_DEVICE_ID = 'K1-SCK-01';
    PAGE_UPDATE_ABORT_QUIT_ITEMOUT = 5000;
    PAGE_UPDATE_TIME_EXPIRE_ITEMOUT = 5000;
    PAGE_UPDATE_RETURN_CARD_ITEMOUT = 5000;
    PAGE_UPDATE_WEBSERVICE_ITEMOUT = 15000;

    APP_LANG = '';
    DEVICE_LIGHT_CODE_OCR_READER = '08';
    DEVICE_LIGHT_CODE_IC_READER = '07';
    DEVICE_LIGHT_CODE_PRINTER = '06';
    DEVICE_LIGHT_CODE_FINGERPRINT = '06';
    DEVICE_LIGHT_ALERT_BAR_BLUE_CODE = '11';
    DEVICE_LIGHT_ALERT_BAR_GREEN_CODE = '12';
    DEVICE_LIGHT_ALERT_BAR_RED_CODE = '13';

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

    N2E = 'N2E';
    R2E = 'R2E';
    N2H = 'N2H';
    R2H = 'R2H';
    N2S = 'N2S';
    R2S= 'R2S';
    N2W = 'N2W';
    R2W = 'R2W';
    N2X = 'N2X';
    R2X = 'R2X';
    N2Y = 'N2Y';
    R2Y = 'R2Y';
    N2 = 'N2';
    R2 = 'R2';
    V3T = 'V3T';
    V3 = 'V3';
    CN_COS = '';
    EN_COS = '';
    isWebServiceTimeout = false;
    controlStatus = '0';
    oldCos = 'V3T ';
    oldLos = '20181125';
    newCos = '';
    newLos = ' ';
    newCosView = '';
    newLosView = '';

    constructor(private router: Router,
                private httpClient: HttpClient,
                private commonService: CommonService,
                private service: MsksService,
                private route: ActivatedRoute,
                private localStorages: LocalStorageService,
                private translate: TranslateService) {
    }

    ngOnInit(): void {
        console.log('init fun');
        this.initConfigParam();
        this.initLanguage();
        this.startBusiness();
    }

    test() {
       this.handleCosLosView();
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

        this.ACTION_TYPE_IC_OPENCARD = this.localStorages.get('ACTION_TYPE_IC_OPENCARD');
        this.ACTION_TYPE_OCR_OPENCARD = this.localStorages.get('ACTION_TYPE_OCR_OPENCARD');
        this.ACTION_TYPE_IC_RETURN_CARD = this.localStorages.get('ACTION_TYPE_IC_RETURN_CARD');

        this.ACTION_TYPE_QUERY_COS_LOS = this.localStorages.get('ACTION_TYPE_QUERY_COS_LOS');
        this.ACTION_TYPE_UPDATE_COS_LOS = this.localStorages.get('ACTION_TYPE_UPDATE_COS_LOS');

        this.UPDATE_LOL_COS_WEBSERVICE_PORT = this.localStorages.get('UPDATE_LOL_COS_WEBSERVICE_PORT');
        this.UPDATE_LOS_COS_WEBSERVICE_IP = this.localStorages.get('UPDATE_LOS_COS_WEBSERVICE_IP');

        this.PAGE_UPDATE_ABORT_QUIT_ITEMOUT = Number.parseInt(this.localStorages.get('PAGE_UPDATE_ABORT_QUIT_ITEMOUT'));
        this.PAGE_UPDATE_RETURN_CARD_ITEMOUT = Number.parseInt(this.localStorages.get('PAGE_UPDATE_RETURN_CARD_ITEMOUT'));
        this.PAGE_UPDATE_TIME_EXPIRE_ITEMOUT = Number.parseInt(this.localStorages.get('PAGE_UPDATE_TIME_EXPIRE_ITEMOUT'));
        this.PAGE_UPDATE_WEBSERVICE_ITEMOUT = Number.parseInt(this.localStorages.get('PAGE_UPDATE_WEBSERVICE_ITEMOUT'));

        this.cardType = Number.parseInt(this.localStorages.get('cardType'));
        this.readType = Number.parseInt(this.localStorages.get('readType'));
        this.carddataJson = this.localStorages.get('carddataJson');
        this.newReader_dor = this.localStorages.get('newReader_dor');
        this.newReader_icno = this.localStorages.get('newReader_icno');
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
        this.processing.show();
        // this.isShowCollect = true;
        if (this.carddataJson) {
            this.carddata = JSON.parse(this.carddataJson);
            this.initIcnoIcprfData();
            const residential_status = this.carddata.residential_status;
            if (residential_status.indexOf('C') === -1) { // 不適用
                // 非C卡不更新.
                this.processing.hide();
                this.cancelQuitEnabledAll();
                // this.showdata = true;
                this.losView = '';
                this.cosView = '';
                this.controlStatus = '3';
            } else {
                // webservice
                this.getCSLSCardFromWebService();
            }
        }
    }

    initIcnoIcprfData() {
        if (this.isAbort || this.timeOutPause) {
            return;
        }
        let icnoInner = this.carddata.hkic_number;
        if (this.cardType === 1) {
            icnoInner = this.carddata.icno;
        }
        this.hkic_number_view = icnoInner;
        let indexNo = 0;
        if (icnoInner.indexOf('(') === -1) {
            indexNo = icnoInner.length;
            if (this.cardType === 1) {
                indexNo--;
            }
        } else {
            indexNo = icnoInner.indexOf('(');
        }
        const icnoInnerNew = icnoInner.substring(0, indexNo);
        const icnoInnerLength = icnoInnerNew.length;
        if (icnoInnerLength > 7) {
            this.icnoParam = icnoInnerNew.substring(1, 8);
            this.icprfParam = icnoInnerNew.substring(0, 1);
        } else {
            this.icnoParam = icnoInnerNew;
            this.icprfParam = ' ';
        }
        console.log('icnoParam=' + this.icnoParam + ',icprfParam=' + this.icprfParam);

    }
    /**
     * nextPage.
     */
    nextRoute() {
        if (this.timeOutPause || this.isAbort) {
            return;
        }
        this.quitDisabledAll();
        this.storeConfigParam();
        this.exit('');
        return;
    }

    exit(promtMessage) {
        this.router.navigate(['/scn-gen/over'], { queryParams: {'err': promtMessage, 'step': 4}});
        return;
    }

    storeConfigParam() {
        this.localStorages.set('APP_LANG', this.translate.currentLang);
        this.localStorages.set('cardType', this.cardType.toString());
        this.localStorages.set('readType', this.readType.toString());
        this.localStorages.set('hkic_number_view', this.hkic_number_view);
    }

    /**
     * backPage.
     */
    backRoute() {
        if (this.processing.visible) {
            this.processing.hide();
        }
        if (this.modalRetry.visible) {
            this.modalRetry.hide();
        }
        if (this.modalFail.visible) {
            this.modalFail.hide();
        }
        if (this.modalQuit.visible) {
            this.modalQuit.hide();
        }
        if (this.modalPrintBill.visible) {
            this.modalPrintBill.hide();
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
    }

    failTryAgain() {
        this.modalRetry.hide();
        if (this.cardType === 1) {
            this.updatehkicv1();
        } else {
            this.updatehkicv2();
        }
    }

// ====================================================== New Reader Start =================================================================
    /**
     * get cos,los information.
     */
    getCSLSCardFromWebService() {
        this.processGetCslsData();
    }

    formatLosView(strDate) {
        console.log('原始时间格式：' + strDate);
        const yearStr = strDate.substring(0, 4);
        const monthStr = strDate.substring(4, 6);
        const dayStr = strDate.substring(6, 8);
        const str = dayStr + '-' + monthStr + '-' + yearStr;
        console.log('转换时间格式：' + str);
        return str;
    }

    formatYearMonthDay(strDate) {
        const yearStr = strDate.substring(0, 4);
        const monthStr = strDate.substring(4, 6);
        const dayStr = strDate.substring(6, 8);
        const str = yearStr + '-' + monthStr + '-' + dayStr;
        console.log('转换时间格式：' + str);
        return str;
    }

    dealLosData(losParam) {
        const yearStr = losParam.substring(0, 4);
        const monthStr = losParam.substring(4, 6);
        const dayStr = losParam.substring(6, 8)
        const str = dayStr + '-' + monthStr + '-' + yearStr;
        this.cosView = this.carddata.cos == null ? '' : this.carddata.cos.trim();
        this.losView = str;
    }

    handleCosLosView() {
        // 原卡中信息显示
        this.losView = this.formatLosView(this.oldLos);
        this.cosView = this.oldCos == null ? '' : this.oldCos.trim();
        // 更新后的数据.
        this.newLosView = this.formatLosView(this.newLos);
        this.newCosView = this.newCos == null ? '' : this.newCos.trim();
    }

    /**
     * get webservice data.
     */
    processGetCslsData() {
        if (this.isAbort || this.timeOutPause) {
            return;
        }
        console.log('call : processGetCslsData fun.');
        const data = {
            'icno':  this.icnoParam, // 'A032658',
            'icprf': this.icprfParam // 'X'
        };
        console.log('icno=' + this.icnoParam + ',icprf=' + this.icprfParam);
        const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
        const options = {
            headers: headers,
            responseType: 'text' as 'json'
        };
        // this.processWebServiceOutMessage();
        this.httpClient.post('http://' + this.UPDATE_LOS_COS_WEBSERVICE_IP + ':' + this.UPDATE_LOL_COS_WEBSERVICE_PORT + '/smartics/sck/getCSLSData', data, options)
            .subscribe((resp: any) => {

                this.commonService.loggerTrans(this.ACTION_TYPE_QUERY_COS_LOS, this.LOCATION_DEVICE_ID, 'S', '', this.hkic_number_view, 'call webservice');
                this.isWebServiceTimeout = true;
                console.log('getCSLSDate WS RESP...', resp);
                if (this.isAbort || this.timeOutPause) {
                    return;
                }
                const resultJson =  $.parseJSON(resp );
                this.service.sendTrackLog(`<resultJson.cos>>>>${resultJson.cos}   resultJson.los=${resultJson.los}`);
                if (resultJson.cos == null && resultJson.los === null) {
                    // this.messageFail = 'SCN-GEN-STEPS.WEB-SERVICE-GET-COS-LOS-EMPTY';
                    this.processing.hide();
                    this.cancelQuitEnabledAll();
                    this.showdata = true;
                    this.losView = '';
                    this.cosView = '';
                    this.controlStatus = '3';
                } else {
                    this.processing.hide();
                    console.log('los=' + resultJson.los);
                    this.showdata = true;
                    // 卡片中的信息cos,los
                    this.oldCos = this.carddata.cos
                    this.oldLos = this.carddata.los;
                    // 获取webservice上的数据cos,los
                    this.newCos = resultJson.cos;
                    this.newLos = resultJson.los;

                    const resultLos = this.formatYearMonthDay(resultJson.los);
                    const d1 = new Date(resultLos);
                    let d2 = null;
                    if (!this.commonService.checkFpNull(this.carddata.los)) {
                        const oldCarLos = this.formatYearMonthDay(this.carddata.los);
                        d2 = new Date(oldCarLos);
                    }
                    if (d2 === null || d1 > d2 ) { // 判斷時間，已更新

                        // this.cos = resultJson.cos;
                        // this.los = resultJson.los;
                        // this.losView = this.formatLosView(resultJson.los);
                        this.service.sendTrackLog(`<card type>>>>>${this.cardType}`);
                        if (this.cardType === 1) {
                            this.updatehkicv1();
                        } else {
                            this.updatehkicv2();
                        }
                    } else {  // 你當前卡裏的信息：
                        this.cosView = this.oldCos == null ? '' : this.oldCos.trim();
                        this.losView = this.formatLosView(this.oldLos);
                        this.controlStatus = '2';
                    }

                }
            }, (err) => {
                this.commonService.loggerExcp(this.ACTION_TYPE_QUERY_COS_LOS, this.LOCATION_DEVICE_ID, 'GE0B', '', this.hkic_number_view, 'webservice exception');
                this.isWebServiceTimeout = true;
                console.log('getCSLSDate WS ERROR...', $.parseJSON(err));
                this.messageFail = 'SCN-GEN-STEPS.CALL-WEB-SERVICE-EXCEPTION';
                this.processing.hide();
                if (this.isAbort || this.timeOutPause) {
                    return;
                }
                this.processModalFailShow();
            });
    }

    doCloseCardByUpdate() {
        if (this.isAbort || this.timeOutPause) {
            return;
        }
        this.service.sendRequestWithLog(CHANNEL_ID_RR_CARDREADER, 'closecard').subscribe((resp) => {
            setTimeout(() => {
                this.openCardFun();
            }, 1000);
        }, (error) => {
            console.log('closecard ERROR ' + error);
            setTimeout(() => {
                this.backRoute();
            }, this.PAGE_UPDATE_ABORT_QUIT_ITEMOUT);
        });
    }

    processWebServiceOutMessage() {
        setTimeout(() => {
            console.log('*******start call webservice function *********');
          if (!this.isWebServiceTimeout) {
              this.isAbort = true;
              this.messageFail = 'SCN-GEN-STEPS.CALL-WEB-SERVICE-EXCEPTION';
              this.processing.hide();
              this.processModalFailShow();
          }
        }, this.PAGE_UPDATE_WEBSERVICE_ITEMOUT);
    }

    updatehkicv2() {
        if (this.isAbort || this.timeOutPause) {
            return;
        }
        this.processing.show();
        const payload = {
            'cos': this.newCos,
            'los': this.newLos
        };
        this.service.sendTrackLog(`<<<cos and los>>>>>${this.cos}  ${this.los}`);
        this.service.sendRequestWithLog(CHANNEL_ID_RR_CARDREADER, 'updatehkicv2coslos', payload).subscribe((resp) => {
            this.service.sendTrackLog(`<updatehkicv2coslos 结果>>>>>${resp.result}`);
            if (!$.isEmptyObject(resp) && resp.result === true) {
                this.commonService.loggerTrans(this.ACTION_TYPE_UPDATE_COS_LOS, this.LOCATION_DEVICE_ID, 'S', '', this.hkic_number_view, 'call updatehkicv2coslos');
                console.log('update sucess!');
                this.processing.hide();
                if (this.newLos) {
                    this.handleCosLosView();
                } else {
                    this.losView = '';
                    this.cosView = '';
                }
                this.cancelQuitEnabledAll();
                this.showdata = true;
                this.controlStatus = '1';
            } else {
                this.commonService.loggerExcp(this.ACTION_TYPE_UPDATE_COS_LOS, this.LOCATION_DEVICE_ID, 'GE0D', '', this.hkic_number_view, 'updatehkicv2coslos exception');
                this.messageFail = 'SCN-GEN-STEPS.UPDATE-COS-LOS-FAILED-EXCEPTION';
                this.processing.hide();
                if (this.isAbort || this.timeOutPause) {
                    return;
                }
                this.processModalFailShow();
            }
        }, (error) => {
            console.log('readhkicv2 ERROR ' + error);
            this.commonService.loggerExcp(this.ACTION_TYPE_UPDATE_COS_LOS, this.LOCATION_DEVICE_ID, 'GE0D', '', this.hkic_number_view, 'updatehkicv2coslos exception');
            this.messageFail = 'SCN-GEN-STEPS.UPDATE-COS-LOS-FAILED-EXCEPTION';
            if (this.isAbort || this.timeOutPause) {
                return;
            }
            this.processModalFailShow();
        });
    }

// ====================================================== New Reader End===================================================================
// ====================================================== Old Reader Start=================================================================
    /**
     *  open card fun.
     */
    openCardFun() {
        if (this.timeOutPause || this.isAbort) {
            return;
        }
        console.log('call openCardFun fun.');
        const payload = {
            'is_update_hkicv1': true,
            'card_reader_id': null,
            'contactless_password': {
                'date_of_registration': null,
                'hkic_no': null
            }
        };
        this.service.sendRequestWithLog(CHANNEL_ID_RR_CARDREADER, 'opencard', payload).subscribe((resp) => {
            if (!$.isEmptyObject(resp)) {
                if (resp.result === true) {
                    if (this.timeOutPause || this.isAbort) {
                        return;
                    }
                    this.commonService.loggerTrans(this.ACTION_TYPE_IC_OPENCARD, this.LOCATION_DEVICE_ID, 'S', '', this.hkic_number_view, 'call opencard');
                    this.updatehkicv1coslos();
                } else {
                    this.messageFail = 'SCN-GEN-STEPS.OCR_READER_SCREEN_S13';
                    if (this.timeOutPause || this.isAbort) {
                        return;
                    }
                    this.processModalFailShow();
                }
            } else {
                this.messageFail = 'SCN-GEN-STEPS.OCR_READER_SCREEN_S13';
                this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_IC_READER);
                if (this.timeOutPause || this.isAbort) {
                    return;
                }
                this.processModalFailShow();
            }
        }, (error) => {
            this.commonService.loggerExcp(this.ACTION_TYPE_IC_OPENCARD, this.LOCATION_DEVICE_ID, 'GE03', '', this.hkic_number_view, 'opengate exception');
            this.messageFail = 'SCN-GEN-STEPS.OCR_READER_SCREEN_S13';
            this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_IC_READER);
            if (this.timeOutPause || this.isAbort) {
                return;
            }
            this.processModalFailShow();
        });
    }

    updatehkicv1() {
        this.processing.show();
        this.doCloseCardByUpdate();
    }

    updatehkicv1coslos() {
        if (this.isAbort || this.timeOutPause) {
            return;
        }

        // this.carddata.cos = this.cos;
        // this.carddata.los = this.los;
        const payload = {
            'cos': this.newCos,
            'los': this.newLos
        };
        this.service.sendRequestWithLog(CHANNEL_ID_RR_CARDREADER, 'updatehkicv1coslos', payload).subscribe((resp) => {
            if (!$.isEmptyObject(resp) && resp.result === true) {
                this.commonService.loggerTrans(this.ACTION_TYPE_UPDATE_COS_LOS, this.LOCATION_DEVICE_ID, 'S', '', this.hkic_number_view, 'call updatehkicv1coslos');
                console.log('update sucess!');
                if (this.newLos) {
                    this.handleCosLosView();
                } else {
                    this.losView = '';
                    this.cosView = '';
                }
                this.showdata = true;
                this.cancelQuitEnabledAll();
                this.processing.hide();
                this.controlStatus = '1';
            } else {
                this.commonService.loggerExcp(this.ACTION_TYPE_UPDATE_COS_LOS, this.LOCATION_DEVICE_ID, 'GE0C', '', this.hkic_number_view, 'updatehkicv1coslos exception');
                this.messageFail = 'SCN-GEN-STEPS.UPDATE-COS-LOS-FAILED-EXCEPTION';
                this.processing.hide();
                if (this.isAbort || this.timeOutPause) {
                    return;
                }
                this.processModalFailShow();
            }
        }, (error) => {
            console.log('updatehkicv1coslos ERROR ' + error);
            this.commonService.loggerExcp(this.ACTION_TYPE_UPDATE_COS_LOS, this.LOCATION_DEVICE_ID, 'GE0C', '', this.hkic_number_view, 'updatehkicv1coslos exception');
            this.messageFail = 'SCN-GEN-STEPS.UPDATE-COS-LOS-FAILED-EXCEPTION';
            if (this.isAbort || this.timeOutPause) {
                return;
            }
            this.processModalFailShow();
        });
    }
    timeExpire() {
        this.timeOutPause = true;
        if (this.processing.visible) {
            this.processing.hide();
        }
        if (this.modalRetry.visible) {
            this.modalRetry.hide();
        }
        if (this.modalFail.visible) {
            this.modalFail.hide();
        }
        if (this.modalQuit.visible) {
            this.modalQuit.hide();
        }
        if (this.modalPrintBill.visible) {
            this.modalPrintBill.hide();
        }

        this.messageTimeout = 'SCN-GEN-STEPS.MESSAGE-TIMEOUT';
        this.modalTimeout.show();
        this.quitDisabledAll();
        setTimeout(() => {
            this.processTimeoutQuit();
        }, this.PAGE_UPDATE_TIME_EXPIRE_ITEMOUT);
    }

    processTimeoutQuit() {
        this.modalTimeout.hide();
        this.doCloseCard();
    }

    processModalFailShow() {
        if (this.isAbort || this.timeOutPause) {
            return;
        }
        this.commonService.doLightOn(this.DEVICE_LIGHT_ALERT_BAR_RED_CODE);
        this.commonService.doFlashLight(this.DEVICE_LIGHT_ALERT_BAR_RED_CODE);
        this.quitDisabledAll();
        this.isAbort = true;
        this.modalFail.show();
    }

    processFailQuit() {
        this.modalFail.hide();
        this.doCloseCard();
    }

    quitDisabledAll() {
        $('#exitBtn').attr('disabled', 'false');
        // $('#langBtn').attr('disabled', 'false');
        $('#confirmBtn').attr('disabled', 'false');

    }
    cancelQuitEnabledAll() {
        $('#exitBtn').removeAttr('disabled');
        // $('#langBtn').removeAttr('disabled');
        $('#confirmBtn').removeAttr('disabled');
    }

    processModalQuitShow() {
        this.modalQuit.show()
        this.isAbort = true;
        this.quitDisabledAll();
        if (this.processing.visible) {
            this.isRestore = true;
            this.processing.hide();
        }
    }

    processConfirmQuit() {
        this.modalQuit.hide();
        if (this.processing.visible) {
            this.processing.hide();
        }
        this.isAbort = true;
        this.doCloseCard();
    }
    processCancelQuit() {
        this.modalQuit.hide();
        this.isAbort = false;
        this.cancelQuitEnabledAll();
        if (this.isRestore) {
            this.processing.show();
        }
    }

    modalCollectShow() {
        this.commonService.doFlashLight(this.DEVICE_LIGHT_CODE_OCR_READER);
        if (this.processing.visible) {
            this.isRestore = true;
            this.processing.hide();
        }
        this.modalCollect.show();
    }
    processCollectQuit() {
        this.modalCollect.hide();
        if (this.isRestore) {
            this.processing.show();
        }
        setTimeout(() => {
            this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_OCR_READER);
            this.backRoute();
        }, this.PAGE_UPDATE_ABORT_QUIT_ITEMOUT);
    }

    doCloseCard() {
        // this.processing.show();
        // this.isShowCollect = false;
        this.service.sendRequestWithLog(CHANNEL_ID_RR_CARDREADER, 'closecard').subscribe((resp) => {
            if (this.readType === 1) {
                this.doReturnDoc();
                setTimeout(() => {
                    this.backRoute();
                }, this.PAGE_UPDATE_RETURN_CARD_ITEMOUT);
            } else {
                this.commonService.doFlashLight(this.DEVICE_LIGHT_CODE_OCR_READER);
                setTimeout(() => {
                    this.backRoute();
                }, this.PAGE_UPDATE_RETURN_CARD_ITEMOUT);
            }
        }, (error) => {
            console.log('closecard ERROR ' + error);
            setTimeout(() => {
                this.backRoute();
            }, this.PAGE_UPDATE_ABORT_QUIT_ITEMOUT);
        });
    }

    doReturnDoc() {
        this.commonService.doFlashLight(this.DEVICE_LIGHT_CODE_IC_READER);
        this.service.sendRequestWithLog(CHANNEL_ID_RR_ICCOLLECT, 'returndoc').subscribe((resp) => {
            this.commonService.doLightOff(this.DEVICE_LIGHT_CODE_IC_READER);
        }, (error) => {
            console.log('opencard ERROR ' + error);
            this.commonService.loggerExcp(this.ACTION_TYPE_IC_RETURN_CARD, this.LOCATION_DEVICE_ID, 'GE0F', '', this.hkic_number_view, 'call returndoc');
            this.messageFail = 'SCN-GEN-STEPS.READER-COLLECT-FAIL';
            if (this.timeOutPause || this.isAbort) {
                return;
            }
            this.processModalFailShow();
        });
    }
    processNextPrint() {
        if (this.processing.visible) {
            this.isRestore = true;
            this.processing.hide();
        }
        this.modalPrintBill.show();
    }

    handlePrint() {
        this.modalPrintBill.hide();
        this.printBill();
    }
    printCancel() {
        this.modalPrintBill.hide();
        this.nextRoute();
    }

    /**
     *  start print
     */
    printBill() {
        if (this.isAbort || this.timeOutPause) {
            return;
        }
        if (this.cardType === 1) {
            const icno = this.hkic_number_view;
            const lengthNum = icno.length;
            const icon_format = icno.substring(0, lengthNum - 1);
            const last_str = icno.substring(lengthNum - 1, lengthNum);
            this.hkic_number_view = icon_format + '(' + last_str + ')';
        }
        const icnoStar = this.hkic_number_view.replace(/(\w)/g, function(a, b, c, d){return (c > 1 && c < 5) ? '*' : a});
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        let monthStr = month + '';
        if (month < 10) {
            monthStr = '0' + month;
        }
        const day = date.getDate();
        let dayStr = day + '';
        if (day < 10) {
            dayStr = '0' + dayStr;
        }
        const hour = date.getHours();
        let hourStr = hour + '';
        if (hour < 10) {
            hourStr = '0' + hourStr;
        }
        const minute = date.getMinutes();
        let minuteStr  = minute + '';
        if (minute < 10) {
            minuteStr =  '0' + minuteStr;
        }
        const second = date.getSeconds();
        let secondStr = second + '';
        if (second < 10) {
            secondStr = '0' + secondStr;
        }
        const datestr = dayStr + '-' + monthStr + '-' + year + '  ' + hourStr + ':' + minuteStr + ':' + secondStr;
        const billNo = this.LOCATION_DEVICE_ID + '_' + year + monthStr + dayStr + hourStr + minuteStr + secondStr;
        const printcontent =
            ' ******************************************** \n' +
            '           香港入境事務處\n' +
            '        Hong Kong Immigration Department\n' +
            ' ++++++++++++++++++++++++++++++++++++++++++++ \n' +
            ' 身份證明文件號碼: ' + icnoStar + '\n' +
            ' Identity document number:\n' +
            ' --------------------------------------------- \n' +
            ' 交易類別:          更新逗留條件和逗留期限 \n' +
            ' Type of service:   Update Condition of Stay   \n' +
            '                    and Limited of Stay \n' +
            ' -------------------------------------------- \n' +
            '  交易狀態:                完成   \n' +
            '  Transaction state:       Completed     \n' +
            ' -------------------------------------------- \n' +
            '  日期及時間:     ' + datestr + '\n' +
            '  Date and time\n' +
            ' -------------------------------------------- \n' +
            '  交易參考編號:  ' + billNo + '\n' +
            '  Transaction reference number:\n' +
            ' --------------------------------------------- \n' +
            '  備註:                     不適用\n' +
            '  Remark:                 Unavailable\n' +
            ' ********************************************* \n' ;
        const dataJson = [
            {
                'type': 'txt',
                'data': printcontent,
                'height': '600',
                'leftMargin': '10',
                'attribute': 'normal'
            },
            {
                'type': 'vspace',
                'data': '100',
                'height': '',
                'leftMargin': '',
                'attribute': ''
            },
            {
                'type': 'cutpaper',
                'data': '',
                'height': '',
                'leftMargin': '',
                'attribute': 'full'
            },
        ];
        console.log('call : printslip fun.' + JSON.stringify(dataJson))
        this.printSlip(dataJson);
    }
    printSlip(dataJson) {
        if (this.isAbort || this.timeOutPause) {
            return;
        }
        console.log('call : printslip fun.' + JSON.stringify(dataJson))
        this.service.sendRequestWithLog('RR_SLIPPRINTER', 'printslip', {'data': dataJson}).subscribe((resp) => {
            if (!$.isEmptyObject(resp) && resp.errorcode === '0') {
                console.log('printslip operate success');
                if (this.isAbort || this.timeOutPause) {
                    return;
                }
                this.nextRoute();
            } else {
                this.messageFail = 'SCN-GEN-STEPS.BILL_PRINT_EXCEPTION';
                this.processing.hide();
                if (this.isAbort || this.timeOutPause) {
                    return;
                }
                this.processModalFailShow();
            }
        }, (error) => {
            console.log('printslip ERROR ' + error);
            this.messageFail = 'SCN-GEN-STEPS.BILL_PRINT_EXCEPTION';
            this.processing.hide();
            if (this.isAbort || this.timeOutPause) {
                return;
            }
            this.processModalFailShow();
        });
    }

}
