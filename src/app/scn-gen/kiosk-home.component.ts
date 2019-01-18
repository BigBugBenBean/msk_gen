import {Component, AfterContentInit, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {AppType, MenuService} from '../../shared/menu';
import { TranslateService } from '@ngx-translate/core';
import { MsksService } from '../shared/msks';

import {LocalStorageService} from '../shared/services/common-service/Local-storage.service';
import {CHANNEL_ID_RR_CARDREADER} from '../shared/var-setting';
import {HttpClient} from '@angular/common/http';
// import { Http, Response } from '@angular/http';
import {CommonService} from '../shared/services/common-service/common.service';
import {TrackLogService} from '../shared/sc2-tracklog';
import {isNull} from 'util';

import {ConfirmComponent} from '../shared/sc2-confirm';
// import {Sc2ProgramFlow} from '../shared/sc2-execution-flow/sc2-program-flow';
// import {Sc2ExecutionFlow} from '../shared/sc2-execution-flow/sc2-execution-flow';
import { Observable } from 'rxjs/Observable';
@Component({
    templateUrl: './kiosk-home.component.html',
    styleUrls: ['./kiosk-home.component.scss']
})

export class KioskHomeComponent implements OnInit {

    @ViewChild('modalCheckHealth')
    public modalCheckHealth: ConfirmComponent;

    pathOtherApp: string;
    cwdOtherApp?: string;

    operateType = '1';
    isFirst = '0';

    messageFail = '';
    DEVICE_LIGHT_CODE_OCR_READER = '03';
    DEVICE_LIGHT_CODE_IC_READER = '02';
    DEVICE_LIGHT_CODE_PRINTER = '06';
    DEVICE_LIGHT_CODE_FINGERPRINT = '06';
    DEVICE_LIGHT_ALERT_BAR_BLUE_CODE = '11';
    DEVICE_LIGHT_ALERT_BAR_GREEN_CODE = '12';
    DEVICE_LIGHT_ALERT_BAR_RED_CODE = '13';

    greenNoticeLight = this.DEVICE_LIGHT_ALERT_BAR_GREEN_CODE;
    redNoticeLight = this.DEVICE_LIGHT_ALERT_BAR_RED_CODE;
    flash = 'flash';
    on = 'lighton';
    off = 'lightoff';
    isAllResponded: boolean;
    isAllDeviceFine: boolean;
    lightDevices = ['01', '02', '10', '11', '12', '13', '14'];
    greenLight = this.DEVICE_LIGHT_ALERT_BAR_GREEN_CODE;
    allDeviceHealthFlag = true;
    checkHealthTimer: any;
    isStart;
    isCheckedHealth;
    infoMessage: string;
    checkHealthMaxRetry: number;
    checkHealthCounter = 0;
    APP_LANG = 'zh-HK';
    maxRetryCount = 36;

    checkHealthStatus = {
        // Light device check.
        noticelight: {channelId: 'RR_NOTICELIGHT', functionId: 'healthcheck', isSuccess: false, isResponded: false, seq: 0},
        // fingerprint device check.
        fpscannergen: {channelId: 'RR_fptool', functionId: 'healthcheck', isSuccess: false, isResponded: false, seq: 1},
        // collect check.
        iccollect: {channelId: 'RR_ICCOLLECT', functionId: 'healthcheck', isSuccess: false, isResponded: false, seq: 2}
        // cardreader: {channelId: 'RR_cardreader', functionId: 'healthcheck', isSuccess: false, isResponded: false}
        // alarmbox: {channelId: 'RR_ALARMBOX', functionId: 'healthcheck', isSuccess: false, isResponded: false},
    };
    // private programFlow: Sc2ProgramFlow;
    // private mainFlowName = 'kiosk-main-flow';
    constructor(private router: Router,
                private commonService: CommonService,
                private translate: TranslateService,
                private route: ActivatedRoute,
                private httpClient: HttpClient,
                // private http:Http,
                private localStorages: LocalStorageService,
                private logger: TrackLogService,
                private msksService: MsksService
                // private sc2PropertyService: Sc2PropertyService,
                // private sc2ObjectCache: Sc2ObjectCache,
                // private sc2IniPropertyService: Sc2IniPropertyService
    ) {
        this.infoMessage = 'SCN-GEN-STEPS.CHECK-HEALTH';
    }
    ngOnInit() {
        this.initLanguage();
        console.log(`init`);
        // const url = "file:///home/virtualboy/work/books.json";
        // const dd = this.httpClient.get(url).map(val => {
        //     console.log(`===============${val}`);
        // });
        // dd.subscribe(data => console.log(data)
        // );

        // this.checkHealthMaxRetry = 999;
        // this.logger.log('STEP 1 START');
        // if (isNull(sessionStorage.getItem('isCheckedHealth'))) {
        const health = this.localStorages.get('BillhealthCheck');
        if (health !== 'ok') {
            this.modalCheckHealth.show();
            const health$ = Observable.forkJoin(this.getOCRHealthCheckObservable(), this.getFingerprintHealthCheckObservable()).delay(1000 * 180);
            health$.subscribe(val => {
                this.localStorages.set('BillhealthCheck', 'ok');
                this.modalCheckHealth.hide();
            },
            e => {
                if (e.message === 'ocrnotready') {
                    this.infoMessage = 'SCN-GEN-STEPS.CHECK-HEALTH-FAIL-OCR';
                }else {
                    this.infoMessage = 'SCN-GEN-STEPS.CHECK-HEALTH-FAIL-FP';
                }
            });
        }
        const that = this;
        $('#viewPerson').click(
            function(){
                that.msksService.sendRequest(CHANNEL_ID_RR_CARDREADER, 'closecard').subscribe();
                that.viewPersonData();
            });
        $('#updateCoslos').click(
            function(){
                that.msksService.sendRequest(CHANNEL_ID_RR_CARDREADER, 'closecard').subscribe();
                that.updateCosLos();
            });

        $('#otherFun').click(
            function(){
                that.msksService.sendRequest(CHANNEL_ID_RR_CARDREADER, 'closecard').subscribe();
                that.otherApp();
            });
            // this.gc();
    }

    getOCRHealthCheckObservable() {
        return this.msksService.sendRequestWithLog(CHANNEL_ID_RR_CARDREADER, 'readhkicv2ocrdata', { 'ocr_reader_name': 'ARH ComboSmart' }).map(resp => {
            if ($.isEmptyObject(resp)  || resp.error_info.error_code !== '0') {
                console.log(`ock check ....`);
                throw new Error('ocrnotready');
            }else {
                return 'ready';
            }
        }).retryWhen(s => s.scan((count, e) => {
            if (count > this.maxRetryCount) {
                throw e;
            }
            return count + 1;
        }, 0).delay(5000));
    }

    getFingerprintHealthCheckObservable() {
        return this.msksService.sendRequestWithLog('RR_fptool', 'healthcheck', {}).map(resp => {
            if ($.isEmptyObject(resp) || resp.indicator !== 'healthy') {
                console.log(`fp check....`);
                throw new Error('fpnotready');
            }else {
                return 'ready';
            }
        }).retryWhen(s => s.scan((count, e) => {
            if (count > this.maxRetryCount) {
                throw e;
            }
            return count + 1;
        }, 0).delay(5000));
    }

    initLanguage() {
        if ('en-US' === this.APP_LANG) {
            this.translate.use('en-US');
        } else {
            this.translate.use('zh-HK');
        }
        this.translate.currentLang = this.APP_LANG;
    }
    viewPersonData() {
        // this.programFlow.abort();
        this.operateType = '1';
        this.storeConfigParam();
        this.router.navigate(['/scn-gen/insertcard']);
        return;
    }

    updateCosLos() {
        // this.programFlow.abort();
        this.operateType = '2';
        this.storeConfigParam();
        this.router.navigate(['/scn-gen/insertcard']);
        return;
    }
    otherApp() {
        // this.pathOtherApp = 'C:/Program Files/Smartics2 MSKS GEN UPDCSLS/Smartics2 MSKS GEN UPDCSLS.exe';
        // this.cwdOtherApp = 'C:/Program Files/Smartics2 MSKS GEN UPDCSLS/';
        this.pathOtherApp = 'C:/icons/bin/mcEnrollment.cmd';
        this.cwdOtherApp = 'C:/icons/bin/';
        this.startLocalProgram(this.pathOtherApp, this.cwdOtherApp);
    }

    /**
     *
     * @param pathParam
     * @param cmdParam
     */
    startLocalProgram(pathParam: string, cmdParam: string) {
        this.msksService.sendRequest('RR_LAUNCHER', 'launch', {
            exemode: 'execfile',
            cmdfile: pathParam,
            cwd: cmdParam
        }, 'PGC').subscribe();
    }

    storeConfigParam() {
        this.localStorages.set('APP_LANG', this.translate.currentLang);
        this.localStorages.set('operateType', this.operateType);
    }

    gc() {
        // const remote = require('electron').remote;
        // const window = remote.getCurrentWindow();
        
        // window.addListener('focus', e => {
        //     console.log(`focus`);
        //     this.msksService.sendRequest(CHANNEL_ID_RR_CARDREADER, 'closecard').subscribe();
        // });
        // window.on('focus', e => {
        //     console.log(`on focus`);
        //     this.msksService.sendRequest(CHANNEL_ID_RR_CARDREADER, 'closecard').subscribe();
        // });
        // window.addListener('blur', e=> {
        //     console.log('blur>>>>>>>>>>>>>>>');
        // });
        // window.on('blur', e=> {
        //     console.log('on blur>>>>>>>>>>>>>>>');
        // });
        // window.addListener('minimize', e => {
        //     console.log(`minimize`);
        // });
        // window.on('minimize', e => {
        //     console.log(`on minimize`);
        // });
        // window.addListener('show', e => {
        //     console.log(`show`);
        // });
        // window.on('show', e => {
        //     console.log(`on  show`);
        // });

        // window.addListener('unmaximize', e => {
        //     console.log('unmaximize');
        // });
        // window.on('unmaximize', e => {
        //     console.log('on unmaximize');
        // });

        // window.addListener('unresponsive', e => {
        //     console.log(`unresponsive`);
        // });
        // window.on('unresponsive', e => {
        //     console.log(`on unresponsive`);
        // });
        // window.addListener('hide', e => {
        //     console.log('hide');
        // });
        // window.on('hide', e => {
        //     console.log('on hide');
        // });
    }
}
