import {Component, AfterContentInit, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ConfirmComponent } from '../../shared/sc2-confirm';
import {AppType, MenuService} from '../../shared/menu';
import { TranslateService } from '@ngx-translate/core';
import { MsksService } from '../../shared/msks';

import {MenuButtonComponent} from '../../shared/menu/mibutton.component';
import { fromEvent } from 'rxjs/observable/fromEvent';
import {LocalStorageService} from '../../shared/services/common-service/Local-storage.service';
import {INI_URL} from '../../shared/var-setting';
import {HttpClient} from '@angular/common/http';
import {ProcessingComponent} from '../../shared/processing-component';
import {CommonService} from '../../shared/services/common-service/common.service';
@Component({
    templateUrl: './kiosk-home.component.html',
    styleUrls: ['./kiosk-home.component.scss']
})

export class KioskHomeComponent implements OnInit {

    public menuitems = new Array<any>();

    @ViewChild('modalFail')
    public modalFail: ConfirmComponent;

    @ViewChild('processing')
    public processing: ProcessingComponent;

    @ViewChild('preparing')
    public preparing: ProcessingComponent;

    operateType = '1';

    messageFail = '';
    processMessage = 'SCN-GEN-STEPS.PROCESSING';
    preparingMessage = 'SCN-GEN-STEPS.PREPARING';
    DEVICE_LIGHT_CODE_OCR_READER = '03';
    DEVICE_LIGHT_CODE_IC_READER = '02';
    DEVICE_LIGHT_CODE_PRINTER = '06';
    DEVICE_LIGHT_CODE_FINGERPRINT = '06';
    DEVICE_LIGHT_ALERT_BAR_BLUE_CODE = '11';
    DEVICE_LIGHT_ALERT_BAR_GREEN_CODE = '12';
    DEVICE_LIGHT_ALERT_BAR_RED_CODE = '13';
    private oneId: string;

    private pathView: string;
    private cwdView?: string;
    private pathUpdate: string;
    private cwdUpdate?: string;

    @ViewChildren(MenuButtonComponent)
    private children;

    @ViewChild('modalNoROP')
    private modalNoROP: ConfirmComponent;

    constructor(private router: Router,
                private menusrv: MenuService,
                private commonService: CommonService,
                private translate: TranslateService,
                private route: ActivatedRoute,
                private httpClient: HttpClient,
                private localStorages: LocalStorageService,
                private msks: MsksService) { }
    previousRoute() {
        const next = this.oneId ? '/scn-gen/gen002' : '/scn-gen/gen001';
        this.router.navigate([next]);
    }

    nextRoute(next: String) {
        this.router.navigate([next]);
    }

    ngOnInit() {

        const view = document.getElementById('viewPerson');
        const upd = document.getElementById('updateCoslos');

        const s = Observable.merge(fromEvent(view, 'click').mapTo('view'), fromEvent(upd, 'click').mapTo('upd')).throttleTime(8000);

        const sub = s.subscribe(data => {
            // sub.unsubscribe();
            if (data === 'view') {
                this.viewPersonData();
                // console.log(`viewwwwwwww`);

            } else if (data === 'upd') {
                this.updateCosLos();
                // console.log('upddddddd');
            }
        });

        // const that = this;
        // $('#viewPerson').click(
        //     function(){
        //         that.viewPersonData();
        //     });
        // $('#updateCoslos').click(
        //     function(){
        //         that.updateCosLos();
        //     });
    }

    initGetParam() {
        this.preparing.show();
        this.httpClient.get(INI_URL).subscribe(data => {
            // save to local storate param.
            this.saveLocalStorages(data);
            this.startBusiness();
            this.preparing.hide();
        }, (err) => {
            this.preparing.hide();
            this.messageFail = 'SCN-GEN-STEPS.INIT_CONFIG_PARAM_ERROR';
            this.processing.hide();
            // this.isShow = false;
            this.processModalFailShow();

        });
    }

    processModalFailShow() {
        this.commonService.doLightOn(this.DEVICE_LIGHT_ALERT_BAR_RED_CODE);
        this.commonService.doFlashLight(this.DEVICE_LIGHT_ALERT_BAR_RED_CODE);

        this.modalFail.show();
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

    startBusiness() {
        this.initConfigParam();
        this.commonService.doOff(this.DEVICE_LIGHT_CODE_IC_READER).merge(
            this.commonService.doOff(this.DEVICE_LIGHT_CODE_OCR_READER),
            this.commonService.doOff(this.DEVICE_LIGHT_ALERT_BAR_RED_CODE)
        ).subscribe(data => console.log(data));
    }

    initConfigParam() {
        this.DEVICE_LIGHT_CODE_OCR_READER = this.localStorages.get('DEVICE_LIGHT_CODE_OCR_READER');
        this.DEVICE_LIGHT_CODE_IC_READER = this.localStorages.get('DEVICE_LIGHT_CODE_IC_READER');
        this.DEVICE_LIGHT_CODE_PRINTER = this.localStorages.get('DEVICE_LIGHT_CODE_PRINTER');
        this.DEVICE_LIGHT_ALERT_BAR_BLUE_CODE = this.localStorages.get('DEVICE_LIGHT_ALERT_BAR_BLUE_CODE');
        this.DEVICE_LIGHT_ALERT_BAR_GREEN_CODE = this.localStorages.get('DEVICE_LIGHT_ALERT_BAR_GREEN_CODE');
        this.DEVICE_LIGHT_ALERT_BAR_RED_CODE = this.localStorages.get('DEVICE_LIGHT_ALERT_BAR_RED_CODE');
    }

    viewPersonData() {
        this.operateType = '1';
        this.storeConfigParam();
        this.router.navigate(['/scn-gen/insertcard']);
        return;
        // this.pathView = 'C:/Program Files/Smartics2 MSKS GEN View Card/Smartics2 MSKS GEN View Card.exe';
        // this.cwdView = 'C:/Program Files/Smartics2 MSKS GEN View Card/';
        // this.startLocalProgram(this.pathView, this.cwdView);
    }

    updateCosLos() {
        this.operateType = '2';
        this.storeConfigParam();
        this.router.navigate(['/scn-gen/insertcard']);
        return;
        // this.pathUpdate = 'C:/Program Files/Smartics2 MSKS GEN UPDCSLS/Smartics2 MSKS GEN UPDCSLS.exe';
        // this.cwdUpdate = 'C:/Program Files/Smartics2 MSKS GEN UPDCSLS/';
        // this.startLocalProgram(this.pathUpdate, this.cwdUpdate);
    }

    storeConfigParam() {
        this.localStorages.set('APP_LANG', this.translate.currentLang);
        this.localStorages.set('operateType', this.operateType);

    }

    /**
     *
     * @param pathParam
     * @param cmdParam
     */
    startLocalProgram(pathParam: string, cmdParam: string) {
        this.msks.sendRequest('RR_LAUNCHER', 'launch', {
            exemode: 'execfile',
            cmdfile: pathParam,
            cwd: cmdParam
        }, 'PGC').subscribe();
    }
}
