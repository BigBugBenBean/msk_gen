import {Component, AfterContentInit, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MsksService } from '../shared/msks';

import {LocalStorageService} from '../shared/services/common-service/Local-storage.service';
import {CHANNEL_ID_RR_CARDREADER, INI_URL} from '../shared/var-setting';
import {HttpClient} from '@angular/common/http';
// import { Http, Response } from '@angular/http';
import {CommonService} from '../shared/services/common-service/common.service';
import {TrackLogService} from '../shared/sc2-tracklog';

import {ConfirmComponent} from '../shared/sc2-confirm';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { interval } from 'rxjs/observable/interval';
import { timer } from 'rxjs/observable/timer';
@Component({
    templateUrl: './kiosk-home.component.html',
    styleUrls: ['./kiosk-home.component.scss']
})

export class KioskHomeComponent implements OnInit {

    @ViewChild('modalCheckHealth')
    public modalCheckHealth: ConfirmComponent;

    @ViewChild('modalNonePaper')
    public modalNonePaper: ConfirmComponent;

    @ViewChild('modalNotAvailable')
    public modalNotAvailable: ConfirmComponent;

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
    macaoFlag = 'display';

    constructor(private router: Router,
                private commonService: CommonService,
                private translate: TranslateService,
                private route: ActivatedRoute,
                private httpClient: HttpClient,
                // private http:Http,
                private localStorages: LocalStorageService,
                private logger: TrackLogService,
                private msksService: MsksService
    ) {
        this.infoMessage = 'SCN-GEN-STEPS.CHECK-HEALTH';
    }
    ngOnInit() {
        this.initLanguage();
        console.log(`init......`);
        const macaoTemp: any = this.localStorages.get('MACAO_ECHANNEL');
        if (macaoTemp === false) {
            this.httpClient.get(INI_URL).subscribe(data => {
                console.log(`MACAO_ECHANNEL=${data['MACAO_ECHANNEL']}`);
                if (data['MACAO_ECHANNEL'] === 'none') {
                    this.macaoFlag = 'none';
                } else {
                    this.macaoFlag = 'display';
                }
                this.localStorages.set('MACAO_ECHANNEL', this.macaoFlag);
                this.healthCheck(this.macaoFlag);
            });
        }else {
            this.macaoFlag = macaoTemp;
            this.healthCheck(this.macaoFlag);
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

        const macao = document.querySelector('#macaoEchannel');
        fromEvent(macao, 'click').throttleTime(5000).mergeMap(e => {
            this.msksService.sendRequest(CHANNEL_ID_RR_CARDREADER, 'closecard').subscribe();
            // return this.getSlipPrinterObservable();
            return ['ok'];
        }).subscribe(val => {
            if (val === 'ok') {
                this.macaoApp();
            } else {
                this.commonService.doAlarm('SlipPrinter No Paper');
                if (val === 'notavailable') {
                    // this.infoMessage = val;
                    this.modalNotAvailable.show();
                    timer(5000).subscribe(data => this.modalNotAvailable.hide());
                } else if (val === 'nopaper') {
                    // this.infoMessage = val;
                    this.modalNonePaper.show();
                    timer(5000).subscribe(data => this.modalNonePaper.hide());
                } else if (val === 'alarm') {
                    this.macaoApp();
                }
            }

                // const paper$ = interval(3000).mergeMap(data => {
                //     console.log(`no paper  ${data}`);
                //     return this.getSlipPrinterObservable();
                // }).subscribe(resp => {
                //     if (resp === 'ok') {
                //         this.modalCheckHealth.hide();
                //         paper$.unsubscribe();
                //     }
                // });
        });

        // $('#macaoEchannel').click(
        //     function(){
        //         that.msksService.sendRequest(CHANNEL_ID_RR_CARDREADER, 'closecard').subscribe();
        //         that.otherApp();
        //     });
    }

    healthCheck(macaoflag) {
        const health = this.localStorages.get('BillhealthCheck');
        if (health !== 'ok') {
            this.modalCheckHealth.show();
            let health$;
            if (macaoflag === 'none') {
                health$ = Observable.forkJoin(this.getOCRHealthCheckObservable(),
                                            //   this.getSlipPrinterHealthCheckObservable(),
                                              this.getFingerprintHealthCheckObservable()).delay(1000 * 1);
            } else {
                health$ = Observable.forkJoin(this.getOCRHealthCheckObservable(),
                                              this.getSlipPrinterHealthCheckObservable(),
                                              this.getFingerprintHealthCheckObservable()).delay(1000 * 180);
            }
            health$.subscribe(val => {
                this.localStorages.set('BillhealthCheck', 'ok');
                this.modalCheckHealth.hide();
            },
            e => {
                if (e.message === 'ocrnotready') {
                    this.infoMessage = 'SCN-GEN-STEPS.CHECK-HEALTH-FAIL-OCR';
                }else if (e.message === 'spnotready') {
                    this.infoMessage = 'SCN-GEN-STEPS.CHECK-HEALTH-FAIL-SP';
                }else {
                    this.infoMessage = 'SCN-GEN-STEPS.CHECK-HEALTH-FAIL-FP';
                }
            });
        }
        // const health = this.localStorages.get('BillhealthCheck');
        // if (health !== 'ok') {
        //     this.modalCheckHealth.show();
        //     const health$ = Observable.forkJoin(this.getOCRHealthCheckObservable(),
        //                                         this.getSlipPrinterHealthCheckObservable(),
        //                                         this.getFingerprintHealthCheckObservable()).delay(1000 * 180);
        //     health$.subscribe(val => {
        //         this.localStorages.set('BillhealthCheck', 'ok');
        //         this.modalCheckHealth.hide();
        //     },
        //     e => {
        //         if (e.message === 'ocrnotready') {
        //             this.infoMessage = 'SCN-GEN-STEPS.CHECK-HEALTH-FAIL-OCR';
        //         }else if (e.message === 'spnotready') {
        //             this.infoMessage = 'SCN-GEN-STEPS.CHECK-HEALTH-FAIL-SP';
        //         }else {
        //             this.infoMessage = 'SCN-GEN-STEPS.CHECK-HEALTH-FAIL-FP';
        //         }
        //     });
        // }
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

    getSlipPrinterHealthCheckObservable() {
        const payload = {'data': []};
        return this.msksService.sendRequestWithLog('RR_SLIPPRINTER', 'printslip', payload).map(val => {
            console.log(val);
            if ($.isEmptyObject(val) || val.errorcode !== '0') {
                console.log(`sp check...`);
                throw new Error('spnotready');
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

    getSlipPrinterObservable() {
        const payload = {'data': []};
        return this.msksService.sendRequestWithLog('RR_SLIPPRINTER', 'printslip', payload).map(resp => {
            console.log(resp);
            if ($.isEmptyObject(resp)) {
                // return 'SCN-GEN-STEPS.PRINTER_NOT_AVAILABLE';
                return 'notavailable';
            } else if (resp.errorcode === '0') {
                return 'ok';
            }else if (resp.errorcode === '40005') {
                return 'alarm';
            }else if (resp.errorcode === '40003') {
                // return 'SCN-GEN-STEPS.PRINTER_NO_PAPER';
                return 'nopaper';
            }else {
                // return 'SCN-GEN-STEPS.PRINTER_NOT_AVAILABLE';
                return 'notavailable';
            }

            // if ($.isEmptyObject(resp) || resp.errorcode === '40002') {
            //     return 'SCN-GEN-STEPS.PRINTER_NOT_AVAILABLE';
            // } else if (resp.errorcode === '40003' || resp.errorcode === '40005') {
            //     return 'SCN-GEN-STEPS.PRINTER_NO_PAPER';
            // }else {
            //     return 'ok';
            // }
        });
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
        this.operateType = '1';
        this.storeConfigParam();
        this.router.navigate(['/scn-gen/insertcard']);
        return;
    }

    updateCosLos() {
        this.operateType = '2';
        this.storeConfigParam();
        this.router.navigate(['/scn-gen/insertcard']);
        return;
    }
    macaoApp() {
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
}
