import {Component, AfterContentInit, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {AppType, MenuService} from '../../shared/menu';
import { TranslateService } from '@ngx-translate/core';
import { MsksService } from '../shared/msks';

import {LocalStorageService} from '../shared/services/common-service/Local-storage.service';
import {INI_URL} from '../../shared/var-setting';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../shared/services/common-service/common.service';
import {TrackLogService} from '../shared/sc2-tracklog';
import {isNull} from 'util';

import {ConfirmComponent} from '../shared/sc2-confirm';
import {Sc2ProgramFlow} from '../shared/sc2-execution-flow/sc2-program-flow';
import {Sc2ExecutionFlow} from '../shared/sc2-execution-flow/sc2-execution-flow';
@Component({
    templateUrl: './kiosk-home-new.component.html',
    styleUrls: ['./kiosk-home-new.component.scss']
})

export class KioskHomeNewComponent implements OnInit {

    @ViewChild('modalCheckHealth')
    public modalCheckHealth: ConfirmComponent;

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

    checkHealthStatus = {
        // Light device check.
        noticelight: {channelId: 'RR_NOTICELIGHT', functionId: 'healthcheck', isSuccess: false, isResponded: false, seq: 0},
        // fingerprint device check.
        fpscannergen: {channelId: 'RR_fptool', functionId: 'healthcheck', isSuccess: false, isResponded: false},
        // collect check.
        // iccollect: {channelId: 'RR_ICCOLLECT', functionId: 'healthcheck', isSuccess: false, isResponded: false},
        // cardreader: {channelId: 'RR_cardreader', functionId: 'healthcheck', isSuccess: false, isResponded: false}
        // alarmbox: {channelId: 'RR_ALARMBOX', functionId: 'healthcheck', isSuccess: false, isResponded: false},
    };
    private programFlow: Sc2ProgramFlow;
    private mainFlowName = 'kiosk-main-flow';
    constructor(private router: Router,
                private commonService: CommonService,
                private translate: TranslateService,
                private route: ActivatedRoute,
                private httpClient: HttpClient,
                private localStorages: LocalStorageService,
                private logger: TrackLogService,
                private msksService: MsksService
                // private sc2PropertyService: Sc2PropertyService,
                // private sc2ObjectCache: Sc2ObjectCache,
                // private sc2IniPropertyService: Sc2IniPropertyService
    ) {
        this.infoMessage = 'SCN-GEN-STEPS.CHECK-HEALTH';
        this.programFlow = new Sc2ProgramFlow('kiosk-program-flow', this.createMainFlow());
    }
    ngOnInit() {
        this.initLanguage();
        // this.checkHealthMaxRetry = 999;
        // this.logger.log('STEP 1 START');
        // if (isNull(sessionStorage.getItem('isCheckedHealth'))) {
        //     this.modalCheckHealth.show();
        // }
        // this.programFlow.start();
        const that = this;
        $('#viewPerson').click(
            function(){
                that.viewPersonData();
            });
        $('#updateCoslos').click(
            function(){
                that.updateCosLos();
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
    this.programFlow.abort();
    this.operateType = '1';
    this.storeConfigParam();
    this.router.navigate(['/scn-gen/insertcard']);
    return;
}

updateCosLos() {
    this.programFlow.abort();
    this.operateType = '2';
    this.storeConfigParam();
    this.router.navigate(['/scn-gen/insertcard']);
    return;
}

storeConfigParam() {
    this.localStorages.set('APP_LANG', this.translate.currentLang);
    this.localStorages.set('operateType', this.operateType);
}

    checkDevices() {
        debugger;
        this.logger.log('Function checkDevices..........')
        if (this.isAllDeviceFine) {
            this.offRedLight();
            this.invokeLight(this.greenLight, this.on);
            sessionStorage.setItem('isCheckedHealth', 'true');
            clearInterval(this.checkHealthTimer);
            this.modalCheckHealth.hide();
        } else {
            console.log('7777');
            this.checkHealthCounter += 1;
            let devices = '';
            if (this.checkHealthCounter <= this.checkHealthMaxRetry) {
                console.log('#################################### this.checkHealthCounter', this.checkHealthCounter);
                Object.keys(this.checkHealthStatus).map((key) => {
                    console.log('key1=' + key);
                    this.doCheckHealthStatusFor(key);
                    if (!this.checkHealthStatus[key].isSuccess) {
                        if (devices) {
                            devices += ', '
                        }
                        devices += this.retrieveDeviceCommonName(this.checkHealthStatus[key].channelId);
                    }
                });
                if ( this.checkHealthCounter > 2) {
                    this.flashRedLight();
                    this.infoMessage = this.translate.instant('SCN-GEN-STEPS.CHECK-HEALTH-RETRY');
                    this.infoMessage = this.infoMessage.replace(':count', this.checkHealthCounter.toString());
                    this.infoMessage += devices;
                }
            } else {
                Object.keys(this.checkHealthStatus).map((key) => {
                    console.log('key2=' + key);
                    if (!this.checkHealthStatus[key].isSuccess) {
                        if (devices) {
                            devices += ', '
                        }
                        devices += this.retrieveDeviceCommonName(this.checkHealthStatus[key].channelId);
                    }
                });
                this.infoMessage = this.translate.instant('SCN-GEN-STEPS.CHECK-HEALTH-FAIL');
                this.infoMessage += devices;
                console.log('devices=' + devices);
                clearInterval(this.checkHealthTimer);
            }
        }
    }

    doCheckHealthStatusFor(targetDeviceName) {
        debugger;
        const targetDevice = this.checkHealthStatus[targetDeviceName];
        const channelId = this.checkHealthStatus[targetDeviceName].channelId;
        const functionId = this.checkHealthStatus[targetDeviceName].functionId;

        if (!targetDevice.isSuccess || !targetDevice.isResponded) {
            this.msksService.sendRequest(channelId, functionId, {}).subscribe((response) => {
                console.log('STEP 1 ' + targetDeviceName + ' healthcheck RESP: ', response);
                this.logger.log('STEP 1 ' + targetDeviceName + ' healthcheck RESP: ' + JSON.stringify(response));
                targetDevice.isResponded = true;
                this.checkAllResponded();
                if (typeof response.indicator !== 'undefined' && response.indicator !== null && response.indicator === 'healthy') {
                    targetDevice.isSuccess = true;
                    this.checkAllSuccess();
                }
            }, (error) => {
                console.log('%s healthcheck fails', targetDeviceName);
                this.logger.log('STEP 1' + targetDeviceName + ' healthcheck fails');
                targetDevice.isResponded = true;
                this.checkAllResponded();
            });
        }
    }
    checkAllSuccess() {
        this.isAllDeviceFine =  this.checkHealthStatus.noticelight.isSuccess &&
            this.checkHealthStatus.fpscannergen.isSuccess;
            // this.checkHealthStatus.camera.isSuccess &&
            // this.checkHealthStatus.cabapp.isSuccess &&
            // this.checkHealthStatus.ocr.isSuccess ;
        // this.checkHealthStatus.ups.isSuccess*/;
    }

    checkAllResponded() {
        this.isAllResponded =   this.checkHealthStatus.noticelight.isResponded &&
            this.checkHealthStatus.fpscannergen.isResponded;
            // this.checkHealthStatus.camera.isResponded &&
            // this.checkHealthStatus.cabapp.isResponded &&
            // this.checkHealthStatus.ocr.isResponded/*&&
            //                     this.checkHealthStatus.ups.isResponded*/;
    }

    resetLights(type: string) {
        console.log('call resetLights');
        for ( let i = 0; i <= this.lightDevices.length; i++ ) {
            if (type === 'default' && this.lightDevices.length === i) {
                this.invokeLight(this.greenNoticeLight, this.on);
            } else if (i < this.lightDevices.length) {
                this.invokeLight(this.lightDevices[i], this.off);
            }
        }
    }

    invokeLight(deviceId: string, funct: string, callback: () => void = () => {}) {
        setTimeout(() => {
            this.msksService.sendRequest('RR_NOTICELIGHT', funct, {'device': deviceId}).subscribe((resp) => {
                this.logger.log('SCK-001 RR_NOTICELIGHT initial ' + deviceId + ': ' + funct + ' response' + JSON.stringify(resp));
                console.log('lighton', resp);
                callback();
            }, (error) => {
                this.logger.log('SCK-001 RR_NOTICELIGHT initial ' + deviceId + ': ' + funct + ' error' + JSON.stringify(error));
                console.log('lighton', error);
            });
        }, 700);
    }

    private createMainFlow() {
        console.log('start 111');
        const mainFlow = new Sc2ExecutionFlow(this.mainFlowName);

        mainFlow.addFunctionStep(() => {
            if (isNull(sessionStorage.getItem('isCheckedHealth'))) {
                // this.logger.log(`###### Current running version is: ${this.sc2PropertyService.get('version')} as of ${new Date()} .`);
                // this.logger.log(`###### Logs created for ${this.office}: ${this.kioskDeviceId}`);
                this.resetLights('healthcheck');
                this.logger.log('STEP 1 Checking device health...');
                this.checkHealthTimer = setInterval(() => this.checkDevices(), 5000);
            } else {
                // this.sc2ObjectCache.clearCache();
                this.resetLights('default');
            }
            return true;
        });

        return mainFlow;
    }

    private retrieveDeviceCommonName(deviceKey: string) {
        return {
            'RR_fptool' : 'RR_fptool',
            'RR_NOTICELIGHT' : 'RR_NOTICELIGHT'
        }[deviceKey];
    }

    private flashRedLight() {
        this.invokeLight(this.greenLight, this.off, () => {
            this.invokeLight(this.redNoticeLight, this.flash);
        });
    }

    private offRedLight() {
        this.invokeLight(this.redNoticeLight, this.off);
    }
}
